<?php

namespace StockFlow\Backend\Repositories;

use PDO;
use StockFlow\Backend\Models\StockLog;

/**
 * StockLogRepository Implementation
 * Owner: Sashika (Staff Activity Portal & Stock Movements)
 */
class StockLogRepository implements StockLogRepositoryInterface
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function create(StockLog $stockLog): int
    {
        $stmt = $this->db->prepare("
            INSERT INTO stock_logs (
                product_id,
                user_id,
                type,
                quantity_changed,
                previous_quantity,
                new_quantity,
                notes
            ) VALUES (
                :product_id,
                :user_id,
                :type,
                :quantity_changed,
                :previous_quantity,
                :new_quantity,
                :notes
            )
        ");

        $stmt->execute([
            'product_id' => $stockLog->getProductId(),
            'user_id' => $stockLog->getUserId(),
            'type' => $stockLog->getType(),
            'quantity_changed' => $stockLog->getQuantityChanged(),
            'previous_quantity' => $stockLog->getPreviousQuantity(),
            'new_quantity' => $stockLog->getNewQuantity(),
            'notes' => $stockLog->getNotes(),
        ]);

        return (int)$this->db->lastInsertId();
    }

    public function findById(int $id): ?StockLog
    {
        $stmt = $this->db->prepare("
            SELECT 
                sl.*, 
                p.name AS product_name, 
                p.sku, 
                c.name AS category, 
                u.full_name AS user_name, 
                u.role AS user_role
            FROM stock_logs sl
            LEFT JOIN products p ON sl.product_id = p.id
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN users u ON sl.user_id = u.id
            WHERE sl.id = :id
            LIMIT 1
        ");

        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row ? StockLog::fromArray($row) : null;
    }

    public function findAll(
        ?int $productId = null,
        ?int $userId = null,
        ?string $dateFilter = null,
        ?string $typeFilter = null,
        ?string $search = null
    ): array {
        $sql = "
            SELECT 
                sl.*, 
                p.name AS product_name, 
                p.sku, 
                c.name AS category, 
                u.full_name AS user_name, 
                u.role AS user_role
            FROM stock_logs sl
            LEFT JOIN products p ON sl.product_id = p.id
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN users u ON sl.user_id = u.id
            WHERE 1=1
        ";

        $params = [];

        if ($productId !== null && $productId > 0) {
            $sql .= " AND sl.product_id = :product_id";
            $params['product_id'] = $productId;
        }

        if ($userId !== null && $userId > 0) {
            $sql .= " AND sl.user_id = :user_id";
            $params['user_id'] = $userId;
        }

        if (!empty($typeFilter) && strtoupper($typeFilter) !== 'ALL') {
            $sql .= " AND sl.type = :type_filter";
            $params['type_filter'] = strtoupper($typeFilter);
        }

        if (!empty($dateFilter) && strtoupper($dateFilter) !== 'ALL') {
            $dateUpper = strtoupper($dateFilter);
            if ($dateUpper === 'TODAY') {
                $sql .= " AND DATE(sl.created_at) = CURRENT_DATE()";
            } elseif ($dateUpper === 'WEEK') {
                $sql .= " AND sl.created_at >= NOW() - INTERVAL 7 DAY";
            } elseif ($dateUpper === 'MONTH') {
                $sql .= " AND sl.created_at >= NOW() - INTERVAL 30 DAY";
            }
        }

        if (!empty($search)) {
            $sql .= " AND (
                p.name LIKE :search 
                OR p.sku LIKE :search 
                OR u.full_name LIKE :search 
                OR sl.notes LIKE :search
            )";
            $params['search'] = '%' . trim($search) . '%';
        }

        $sql .= " ORDER BY sl.id DESC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map(fn($row) => StockLog::fromArray($row), $rows);
    }

    public function getStaffLogs(int $userId): array
    {
        return $this->findAll(null, $userId);
    }
}
