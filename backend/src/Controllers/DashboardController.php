<?php

namespace StockFlow\Backend\Controllers;

use PDO;
use StockFlow\Backend\Core\Middleware\AuthMiddleware;

/**
 * Dashboard Controller
 * Owner: Pemila (Dashboard Analytics, Reports & System Settings)
 */
class DashboardController
{
    private PDO $db;
    private ?AuthMiddleware $authMiddleware;

    public function __construct(PDO $db, ?AuthMiddleware $authMiddleware = null)
    {
        $this->db = $db;
        $this->authMiddleware = $authMiddleware;
    }

    /**
     * GET /api/dashboard/stats
     * Aggregated KPI statistics endpoint:
     * - Total inventory valuation (cost basis & retail potential)
     * - Total product count & active stock units
     * - Low-stock & Out-of-stock item counts
     * - Category stock distribution with percentage shares
     */
    public function getStats(): void
    {
        // Authenticate request if middleware is configured
        if ($this->authMiddleware && method_exists($this->authMiddleware, 'handle')) {
            $this->authMiddleware->handle();
        }

        try {
            // 1. Total Products & Active Stock Units
            $stmtProducts = $this->db->query("
                SELECT 
                    COUNT(*) AS total_products,
                    COALESCE(SUM(quantity), 0) AS total_stock_units
                FROM products
                WHERE deleted_at IS NULL
            ");
            $productStats = $stmtProducts->fetch(PDO::FETCH_ASSOC) ?: [
                'total_products' => 0,
                'total_stock_units' => 0
            ];

            // 2. Inventory Valuations
            $stmtValuation = $this->db->query("
                SELECT 
                    COALESCE(SUM(cost_price * quantity), 0) AS total_cost_valuation,
                    COALESCE(SUM(price * quantity), 0) AS total_retail_valuation
                FROM products
                WHERE deleted_at IS NULL
            ");
            $valuationStats = $stmtValuation->fetch(PDO::FETCH_ASSOC) ?: [
                'total_cost_valuation' => 0.00,
                'total_retail_valuation' => 0.00
            ];

            // 3. Low-Stock & Out-of-Stock Counts
            $stmtLowStock = $this->db->query("
                SELECT 
                    SUM(CASE WHEN quantity > 0 AND (status = 'low_stock' OR quantity <= min_stock_alert) THEN 1 ELSE 0 END) AS low_stock_count,
                    SUM(CASE WHEN quantity = 0 OR status = 'out_of_stock' THEN 1 ELSE 0 END) AS out_of_stock_count
                FROM products
                WHERE deleted_at IS NULL
            ");
            $stockAlerts = $stmtLowStock->fetch(PDO::FETCH_ASSOC) ?: [
                'low_stock_count' => 0,
                'out_of_stock_count' => 0
            ];

            // 4. Category Stock Distribution
            $stmtCategory = $this->db->query("
                SELECT 
                    c.id AS category_id,
                    c.name AS category_name,
                    COUNT(p.id) AS product_count,
                    COALESCE(SUM(p.quantity), 0) AS total_quantity,
                    COALESCE(SUM(p.cost_price * p.quantity), 0) AS category_cost_valuation,
                    COALESCE(SUM(p.price * p.quantity), 0) AS category_retail_valuation
                FROM categories c
                LEFT JOIN products p ON c.id = p.category_id AND p.deleted_at IS NULL
                GROUP BY c.id, c.name
                ORDER BY total_quantity DESC
            ");
            $categoryRows = $stmtCategory->fetchAll(PDO::FETCH_ASSOC) ?: [];

            $totalSystemUnits = (int)$productStats['total_stock_units'];

            $categoryDistribution = array_map(function ($cat) use ($totalSystemUnits) {
                $units = (int)$cat['total_quantity'];
                $share = $totalSystemUnits > 0 ? round(($units / $totalSystemUnits) * 100, 2) : 0.00;

                return [
                    'category_id' => (int)$cat['category_id'],
                    'name' => $cat['category_name'],
                    'product_count' => (int)$cat['product_count'],
                    'total_quantity' => $units,
                    'cost_valuation' => (float)$cat['category_cost_valuation'],
                    'retail_valuation' => (float)$cat['category_retail_valuation'],
                    'share_percentage' => $share
                ];
            }, $categoryRows);

            $costVal = (float)$valuationStats['total_cost_valuation'];
            $retailVal = (float)$valuationStats['total_retail_valuation'];
            $projectedProfit = $retailVal - $costVal;
            $marginPct = $costVal > 0 ? round(($projectedProfit / $costVal) * 100, 2) : 0.00;

            $responseData = [
                'summary' => [
                    'total_products' => (int)$productStats['total_products'],
                    'total_stock_units' => (int)$productStats['total_stock_units'],
                    'total_inventory_valuation' => $costVal,
                    'total_retail_valuation' => $retailVal,
                    'projected_gross_profit' => $projectedProfit,
                    'gross_profit_margin_percent' => $marginPct,
                    'low_stock_count' => (int)$stockAlerts['low_stock_count'],
                    'out_of_stock_count' => (int)$stockAlerts['out_of_stock_count'],
                    'total_alerts' => (int)$stockAlerts['low_stock_count'] + (int)$stockAlerts['out_of_stock_count']
                ],
                'category_distribution' => $categoryDistribution
            ];

            $this->jsonResponse(true, 'Dashboard KPI metrics retrieved successfully.', $responseData, 200);

        } catch (\PDOException $e) {
            $this->jsonResponse(false, 'Database error while calculating stats: ' . $e->getMessage(), null, 500);
        } catch (\Exception $e) {
            $this->jsonResponse(false, 'Failed to process dashboard analytics request: ' . $e->getMessage(), null, 500);
        }
    }

    /**
     * Helper JSON Response output
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
