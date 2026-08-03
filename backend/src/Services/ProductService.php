<?php

namespace StockFlow\Backend\Services;

use PDO;
use InvalidArgumentException;
use Exception;
use StockFlow\Backend\Models\StockLog;
use StockFlow\Backend\Repositories\StockLogRepositoryInterface;

/**
 * Product & Transactional Stock Movement Service Engine
 * Owner: Sashika (Staff Activity Portal & Stock Movements)
 */
class ProductService
{
    private PDO $db;
    private StockLogRepositoryInterface $stockLogRepo;

    public function __construct(PDO $db, StockLogRepositoryInterface $stockLogRepo)
    {
        $this->db = $db;
        $this->stockLogRepo = $stockLogRepo;
    }

    /**
     * Transactional Stock Adjustment Engine
     * Executes inside ACID Transaction with FOR UPDATE pessimistic row locks.
     *
     * @param int $productId
     * @param string $type 'IN', 'OUT', or 'ADJUSTMENT'
     * @param int $quantity Movement quantity count or target level
     * @param string|null $notes Audit notes
     * @param int|null $userId User ID performing the action
     * @return array
     * @throws InvalidArgumentException|Exception
     */
    public function adjustStock(
        int $productId,
        string $type,
        int $quantity,
        ?string $notes = null,
        ?int $userId = null
    ): array {
        $upperType = strtoupper(trim($type));
        if (!in_array($upperType, ['IN', 'OUT', 'ADJUSTMENT'], true)) {
            throw new InvalidArgumentException("Invalid movement type '{$type}'. Must be 'IN', 'OUT', or 'ADJUSTMENT'.");
        }

        if ($quantity < 0) {
            throw new InvalidArgumentException("Stock adjustment quantity cannot be negative.");
        }

        if ($upperType !== 'ADJUSTMENT' && $quantity === 0) {
            throw new InvalidArgumentException("Quantity must be greater than zero for Stock IN and Stock OUT.");
        }

        // Begin ACID Database Transaction
        $this->db->beginTransaction();

        try {
            // Row Lock: Prevent concurrent stock mutations on the same product
            $stmt = $this->db->prepare("
                SELECT id, sku, name, quantity, min_stock_alert, status 
                FROM products 
                WHERE id = :id AND deleted_at IS NULL 
                FOR UPDATE
            ");
            $stmt->execute(['id' => $productId]);
            $product = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$product) {
                throw new InvalidArgumentException("Product with ID {$productId} not found or is deleted.");
            }

            $previousQuantity = (int)$product['quantity'];
            $minAlert = (int)($product['min_stock_alert'] ?? 5);

            $newQuantity = $previousQuantity;
            $quantityChanged = 0;

            if ($upperType === 'IN') {
                $quantityChanged = $quantity;
                $newQuantity = $previousQuantity + $quantity;
            } elseif ($upperType === 'OUT') {
                if ($quantity > $previousQuantity) {
                    throw new InvalidArgumentException(
                        "Insufficient stock available for dispatch. Current stock: {$previousQuantity} pcs, requested dispatch: {$quantity} pcs."
                    );
                }
                $quantityChanged = -$quantity;
                $newQuantity = $previousQuantity - $quantity;
            } elseif ($upperType === 'ADJUSTMENT') {
                $newQuantity = $quantity;
                $quantityChanged = $newQuantity - $previousQuantity;
            }

            // Calculate new stock status badge
            $newStatus = 'in_stock';
            if ($newQuantity <= 0) {
                $newStatus = 'out_of_stock';
            } elseif ($newQuantity <= $minAlert) {
                $newStatus = 'low_stock';
            }

            // 1. Update Products Table
            $updateStmt = $this->db->prepare("
                UPDATE products 
                SET quantity = :quantity,
                    status = :status,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = :id
            ");
            $updateStmt->execute([
                'id' => $productId,
                'quantity' => $newQuantity,
                'status' => $newStatus
            ]);

            // 2. Insert Transaction Log into stock_logs Table
            $stockLog = new StockLog(
                null,
                $productId,
                $userId,
                $upperType,
                $quantityChanged,
                $previousQuantity,
                $newQuantity,
                $notes,
                date('Y-m-d H:i:s'),
                $product['name'],
                $product['sku']
            );

            $logId = $this->stockLogRepo->create($stockLog);

            // Fetch created log details with user & product join
            $createdLog = $this->stockLogRepo->findById($logId);

            // Commit ACID Transaction
            $this->db->commit();

            return [
                'success' => true,
                'message' => "Stock successfully updated ({$upperType}: {$previousQuantity} ➔ {$newQuantity}).",
                'product' => [
                    'id' => (int)$product['id'],
                    'sku' => $product['sku'],
                    'name' => $product['name'],
                    'previousQuantity' => $previousQuantity,
                    'newQuantity' => $newQuantity,
                    'quantity' => $newQuantity,
                    'status' => $newStatus,
                ],
                'stockLog' => $createdLog ? $createdLog->toArray() : null,
            ];
        } catch (Exception $e) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }
            throw $e;
        }
    }

    public function getProductById(int $id): ?array
    {
        $stmt = $this->db->prepare("
            SELECT p.*, c.name as category_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = :id AND p.deleted_at IS NULL
            LIMIT 1
        ");
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }

    public function getAllProducts(): array
    {
        $stmt = $this->db->query("
            SELECT p.*, c.name as category_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.deleted_at IS NULL
            ORDER BY p.id DESC
        ");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
