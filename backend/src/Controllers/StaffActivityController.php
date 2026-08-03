<?php

namespace StockFlow\Backend\Controllers;

use InvalidArgumentException;
use Exception;
use StockFlow\Backend\Services\ProductService;
use StockFlow\Backend\Repositories\StockLogRepositoryInterface;
use StockFlow\Backend\Core\Middleware\AuthMiddleware;

/**
 * Staff Activity & Transactional Stock Movements Controller
 * Owner: Sashika (Staff Activity Portal & Stock Movements)
 */
class StaffActivityController
{
    private ProductService $productService;
    private StockLogRepositoryInterface $stockLogRepo;
    private AuthMiddleware $authMiddleware;

    public function __construct(
        ProductService $productService,
        StockLogRepositoryInterface $stockLogRepo,
        AuthMiddleware $authMiddleware
    ) {
        $this->productService = $productService;
        $this->stockLogRepo = $stockLogRepo;
        $this->authMiddleware = $authMiddleware;
    }

    /**
     * POST /api/staff-activity/adjust-stock
     * POST /api/stock-logs/movement
     * Executes transactional stock movement adjustment (Stock IN, Stock OUT, Stock ADJUSTMENT).
     */
    public function logMovement(): void
    {
        $payload = $this->authMiddleware->handle();
        if (!$payload) {
            return;
        }

        $userId = isset($payload['sub']) ? (int)$payload['sub'] : null;

        $rawInput = file_get_contents('php://input');
        $input = json_decode($rawInput, true) ?? $_POST;

        $productId = (int)($input['product_id'] ?? $input['productId'] ?? 0);
        $type = trim($input['type'] ?? '');
        $quantity = isset($input['quantity']) ? (int)$input['quantity'] : null;
        $notes = isset($input['notes']) ? trim($input['notes']) : null;

        if ($productId <= 0) {
            $this->jsonResponse(false, 'Valid Product ID is required.', null, 400);
            return;
        }

        if (empty($type)) {
            $this->jsonResponse(false, "Movement type is required ('IN', 'OUT', or 'ADJUSTMENT').", null, 400);
            return;
        }

        if ($quantity === null) {
            $this->jsonResponse(false, 'Quantity count is required.', null, 400);
            return;
        }

        try {
            $result = $this->productService->adjustStock($productId, $type, $quantity, $notes, $userId);
            $this->jsonResponse(true, $result['message'], $result, 200);
        } catch (InvalidArgumentException $e) {
            $this->jsonResponse(false, $e->getMessage(), null, 400);
        } catch (Exception $e) {
            $this->jsonResponse(false, 'An unexpected server error occurred during stock adjustment: ' . $e->getMessage(), null, 500);
        }
    }

    /**
     * GET /api/staff-activity/logs
     * GET /api/stock-logs
     * Fetches staff stock movement audit logs with search, type, and date filters.
     */
    public function getStaffLogs(): void
    {
        $payload = $this->authMiddleware->handle();
        if (!$payload) {
            return;
        }

        $productId = isset($_GET['product_id']) ? (int)$_GET['product_id'] : null;
        $userId = isset($_GET['user_id']) ? (int)$_GET['user_id'] : null;
        $typeFilter = $_GET['type'] ?? $_GET['type_filter'] ?? 'ALL';
        $dateFilter = $_GET['date'] ?? $_GET['date_filter'] ?? 'ALL';
        $search = $_GET['search'] ?? $_GET['q'] ?? null;

        try {
            $logs = $this->stockLogRepo->findAll(
                $productId,
                $userId,
                $dateFilter,
                $typeFilter,
                $search
            );

            $logList = array_map(fn($log) => $log->toArray(), $logs);

            $this->jsonResponse(true, 'Staff activity stock movement logs retrieved successfully.', [
                'logs' => $logList,
                'count' => count($logList),
            ], 200);
        } catch (Exception $e) {
            $this->jsonResponse(false, 'Failed to retrieve stock movement logs: ' . $e->getMessage(), null, 500);
        }
    }

    private function jsonResponse(bool $success, string $message, $data = null, int $statusCode = 200): void
    {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => $success,
            'message' => $message,
            'data' => $data,
            'status' => $statusCode
        ]);
        exit;
    }
}
