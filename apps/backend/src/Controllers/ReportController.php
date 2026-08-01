<?php

namespace StockFlow\Backend\Controllers;

use PDO;
use StockFlow\Backend\Core\Middleware\AuthMiddleware;

/**
 * Report Controller & Settings Configuration Handler
 * Owner: Pemila (Dashboard Analytics, Reports & System Settings)
 */
class ReportController
{
    private PDO $db;
    private ?AuthMiddleware $authMiddleware;

    public function __construct(PDO $db, ?AuthMiddleware $authMiddleware = null)
    {
        $this->db = $db;
        $this->authMiddleware = $authMiddleware;
    }

    /**
     * GET /api/reports
     * Comprehensive reports endpoint providing:
     * 1. Stock Valuation Summary (cost basis, retail market value, gross margin)
     * 2. Low Stock Warning List (critical items below reorder threshold)
     * 3. Exportable Report Data (formatted for CSV/JSON/PDF generation)
     */
    public function getReports(): void
    {
        if ($this->authMiddleware && method_exists($this->authMiddleware, 'handle')) {
            $this->authMiddleware->handle();
        }

        try {
            // 1. Stock Valuation Summary
            $stmtValuation = $this->db->query("
                SELECT 
                    COUNT(*) AS total_items,
                    COALESCE(SUM(quantity), 0) AS total_units,
                    COALESCE(SUM(cost_price * quantity), 0) AS total_cost_valuation,
                    COALESCE(SUM(price * quantity), 0) AS total_retail_valuation
                FROM products
                WHERE deleted_at IS NULL
            ");
            $valuationSummary = $stmtValuation->fetch(PDO::FETCH_ASSOC) ?: [
                'total_items' => 0,
                'total_units' => 0,
                'total_cost_valuation' => 0.00,
                'total_retail_valuation' => 0.00
            ];

            $totalCost = (float)$valuationSummary['total_cost_valuation'];
            $totalRetail = (float)$valuationSummary['total_retail_valuation'];
            $totalProfit = $totalRetail - $totalCost;
            $avgMargin = $totalCost > 0 ? round(($totalProfit / $totalCost) * 100, 2) : 0.00;

            // Category Valuation Breakdown
            $stmtCatVal = $this->db->query("
                SELECT 
                    c.name AS category,
                    COUNT(p.id) AS product_count,
                    COALESCE(SUM(p.quantity), 0) AS total_quantity,
                    COALESCE(SUM(p.cost_price * p.quantity), 0) AS cost_valuation,
                    COALESCE(SUM(p.price * p.quantity), 0) AS retail_valuation
                FROM categories c
                LEFT JOIN products p ON c.id = p.category_id AND p.deleted_at IS NULL
                GROUP BY c.id, c.name
                ORDER BY cost_valuation DESC
            ");
            $categoryValuations = $stmtCatVal->fetchAll(PDO::FETCH_ASSOC) ?: [];

            // 2. Low Stock Warning List
            $stmtLowStock = $this->db->query("
                SELECT 
                    p.id,
                    p.sku,
                    p.name,
                    c.name AS category,
                    p.quantity,
                    p.min_stock_alert,
                    p.unit,
                    p.cost_price,
                    p.price,
                    p.status,
                    CASE 
                        WHEN p.quantity = 0 THEN 'CRITICAL'
                        WHEN p.quantity <= p.min_stock_alert THEN 'WARNING'
                        ELSE 'NORMAL'
                    END AS alert_level
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE p.deleted_at IS NULL 
                  AND (p.quantity <= p.min_stock_alert OR p.status IN ('low_stock', 'out_of_stock'))
                ORDER BY p.quantity ASC, p.name ASC
            ");
            $lowStockWarningList = $stmtLowStock->fetchAll(PDO::FETCH_ASSOC) ?: [];

            // 3. Exportable Report Data Payload
            $stmtExport = $this->db->query("
                SELECT 
                    p.sku AS SKU,
                    p.name AS ItemName,
                    c.name AS Category,
                    p.quantity AS QuantityInStock,
                    p.unit AS Unit,
                    p.cost_price AS UnitCostPrice,
                    p.price AS UnitSellingPrice,
                    (p.cost_price * p.quantity) AS TotalCostValuation,
                    (p.price * p.quantity) AS TotalRetailValuation,
                    ((p.price * p.quantity) - (p.cost_price * p.quantity)) AS ProjectedGrossProfit,
                    CASE 
                        WHEN p.cost_price > 0 THEN ROUND((((p.price - p.cost_price) / p.cost_price) * 100), 2)
                        ELSE 0.00
                    END AS ProfitMarginPercent,
                    p.min_stock_alert AS ReorderPointThreshold,
                    p.status AS InventoryStatus
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE p.deleted_at IS NULL
                ORDER BY p.name ASC
            ");
            $exportableReportData = $stmtExport->fetchAll(PDO::FETCH_ASSOC) ?: [];

            $responseData = [
                'valuation_summary' => [
                    'total_items' => (int)$valuationSummary['total_items'],
                    'total_units' => (int)$valuationSummary['total_units'],
                    'total_cost_valuation' => $totalCost,
                    'total_retail_valuation' => $totalRetail,
                    'total_projected_profit' => $totalProfit,
                    'average_profit_margin_percent' => $avgMargin,
                    'category_breakdown' => $categoryValuations
                ],
                'low_stock_warnings' => [
                    'count' => count($lowStockWarningList),
                    'items' => $lowStockWarningList
                ],
                'exportable_data' => [
                    'item_count' => count($exportableReportData),
                    'generated_at' => date('Y-m-d H:i:s'),
                    'records' => $exportableReportData
                ]
            ];

            $this->jsonResponse(true, 'Comprehensive analytics report retrieved successfully.', $responseData, 200);

        } catch (\PDOException $e) {
            $this->jsonResponse(false, 'Database query failed: ' . $e->getMessage(), null, 500);
        } catch (\Exception $e) {
            $this->jsonResponse(false, 'Failed to compile analytics reports: ' . $e->getMessage(), null, 500);
        }
    }

    /**
     * GET /api/settings/thresholds
     * Handler to fetch current low-stock alert threshold configurations
     */
    public function getThresholdSettings(): void
    {
        if ($this->authMiddleware && method_exists($this->authMiddleware, 'handle')) {
            $this->authMiddleware->handle();
        }

        try {
            // Retrieve average or default threshold from DB / default fallback
            $stmt = $this->db->query("
                SELECT 
                    AVG(min_stock_alert) AS default_reorder_threshold,
                    MIN(min_stock_alert) AS minimum_threshold,
                    MAX(min_stock_alert) AS maximum_threshold
                FROM products 
                WHERE deleted_at IS NULL
            ");
            $thresholdData = $stmt->fetch(PDO::FETCH_ASSOC);

            $settings = [
                'default_low_stock_threshold' => (int)($thresholdData['default_reorder_threshold'] ?? 30),
                'critical_warning_level' => 5,
                'enable_dashboard_alerts' => true,
                'enable_email_notifications' => true,
                'auto_flag_reorder_queue' => true,
                'system_base_currency' => 'USD ($)',
                'last_updated' => date('Y-m-d H:i:s')
            ];

            $this->jsonResponse(true, 'Low-stock threshold settings fetched successfully.', $settings, 200);

        } catch (\Exception $e) {
            $this->jsonResponse(false, 'Failed to load threshold settings: ' . $e->getMessage(), null, 500);
        }
    }

    /**
     * POST/PUT /api/settings/thresholds
     * System settings configuration handler to update low-stock alert thresholds
     */
    public function updateThresholdSettings(): void
    {
        if ($this->authMiddleware && method_exists($this->authMiddleware, 'handle')) {
            $this->authMiddleware->handle();
        }

        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $newThreshold = isset($input['default_low_stock_threshold']) ? (int)$input['default_low_stock_threshold'] : null;

        if ($newThreshold === null || $newThreshold < 1) {
            $this->jsonResponse(false, 'Invalid threshold value provided. Must be a positive integer.', null, 400);
            return;
        }

        try {
            // Bulk update min_stock_alert threshold across products if requested
            if (!empty($input['apply_globally'])) {
                $stmt = $this->db->prepare("UPDATE products SET min_stock_alert = :threshold WHERE deleted_at IS NULL");
                $stmt->execute(['threshold' => $newThreshold]);
            }

            $updatedSettings = [
                'default_low_stock_threshold' => $newThreshold,
                'critical_warning_level' => isset($input['critical_warning_level']) ? (int)$input['critical_warning_level'] : 5,
                'enable_dashboard_alerts' => isset($input['enable_dashboard_alerts']) ? (bool)$input['enable_dashboard_alerts'] : true,
                'enable_email_notifications' => isset($input['enable_email_notifications']) ? (bool)$input['enable_email_notifications'] : true,
                'auto_flag_reorder_queue' => isset($input['auto_flag_reorder_queue']) ? (bool)$input['auto_flag_reorder_queue'] : true,
                'updated_at' => date('Y-m-d H:i:s')
            ];

            $this->jsonResponse(true, 'Low-stock alert threshold settings updated successfully.', $updatedSettings, 200);

        } catch (\PDOException $e) {
            $this->jsonResponse(false, 'Database update failed: ' . $e->getMessage(), null, 500);
        } catch (\Exception $e) {
            $this->jsonResponse(false, 'Failed to update threshold settings: ' . $e->getMessage(), null, 500);
        }
    }

    /**
     * JSON Response Helper
     */
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
