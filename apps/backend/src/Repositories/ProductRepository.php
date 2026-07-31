<?php

namespace StockFlow\Backend\Repositories;

use PDO;
use StockFlow\Backend\Models\Product;

/**
 * ProductRepository Implementation
 * Owner: Ashan (Product Core & Information Display)
 */
class ProductRepository implements ProductRepositoryInterface
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function findById(int $id): ?Product
    {
        $sql = "
            SELECT p.*, c.name AS category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = :id AND p.deleted_at IS NULL
            LIMIT 1
        ";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row ? Product::fromArray($row) : null;
    }

    public function findBySku(string $sku): ?Product
    {
        $sql = "
            SELECT p.*, c.name AS category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.sku = :sku AND p.deleted_at IS NULL
            LIMIT 1
        ";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(['sku' => $sku]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row ? Product::fromArray($row) : null;
    }

    public function findAll(array $filters = [], int $page = 1, int $perPage = 10): array
    {
        $whereConditions = ["p.deleted_at IS NULL"];
        $params = [];

        if (!empty($filters['search'])) {
            $whereConditions[] = "(p.name LIKE :search OR p.sku LIKE :search OR p.description LIKE :search)";
            $params['search'] = '%' . $filters['search'] . '%';
        }

        if (!empty($filters['category_id'])) {
            $whereConditions[] = "p.category_id = :category_id";
            $params['category_id'] = (int)$filters['category_id'];
        }

        if (!empty($filters['status'])) {
            $whereConditions[] = "p.status = :status";
            $params['status'] = $filters['status'];
        }

        $whereClause = implode(' AND ', $whereConditions);
        $offset = ($page - 1) * $perPage;

        $sql = "
            SELECT p.*, c.name AS category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE {$whereClause}
            ORDER BY p.id DESC
            LIMIT :limit OFFSET :offset
        ";

        $stmt = $this->db->prepare($sql);

        foreach ($params as $key => $val) {
            $stmt->bindValue(':' . $key, $val);
        }
        $stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);

        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map(fn($row) => Product::fromArray($row), $rows);
    }

    public function countAll(array $filters = []): int
    {
        $whereConditions = ["p.deleted_at IS NULL"];
        $params = [];

        if (!empty($filters['search'])) {
            $whereConditions[] = "(p.name LIKE :search OR p.sku LIKE :search OR p.description LIKE :search)";
            $params['search'] = '%' . $filters['search'] . '%';
        }

        if (!empty($filters['category_id'])) {
            $whereConditions[] = "p.category_id = :category_id";
            $params['category_id'] = (int)$filters['category_id'];
        }

        if (!empty($filters['status'])) {
            $whereConditions[] = "p.status = :status";
            $params['status'] = $filters['status'];
        }

        $whereClause = implode(' AND ', $whereConditions);

        $sql = "SELECT COUNT(*) FROM products p WHERE {$whereClause}";
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        return (int)$stmt->fetchColumn();
    }

    public function save(Product $product): bool
    {
        $sql = "
            INSERT INTO products (sku, name, category_id, price, cost_price, quantity, min_stock_alert, unit, description, status)
            VALUES (:sku, :name, :category_id, :price, :cost_price, :quantity, :min_stock_alert, :unit, :description, :status)
        ";

        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            'sku' => $product->getSku(),
            'name' => $product->getName(),
            'category_id' => $product->getCategoryId(),
            'price' => $product->getPrice(),
            'cost_price' => $product->getCostPrice(),
            'quantity' => $product->getQuantity(),
            'min_stock_alert' => $product->getMinStockAlert(),
            'unit' => $product->getUnit(),
            'description' => $product->getDescription(),
            'status' => $product->getStatus(),
        ]);
    }

    public function update(Product $product): bool
    {
        $sql = "
            UPDATE products
            SET sku = :sku,
                name = :name,
                category_id = :category_id,
                price = :price,
                cost_price = :cost_price,
                quantity = :quantity,
                min_stock_alert = :min_stock_alert,
                unit = :unit,
                description = :description,
                status = :status
            WHERE id = :id AND deleted_at IS NULL
        ";

        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            'id' => $product->getId(),
            'sku' => $product->getSku(),
            'name' => $product->getName(),
            'category_id' => $product->getCategoryId(),
            'price' => $product->getPrice(),
            'cost_price' => $product->getCostPrice(),
            'quantity' => $product->getQuantity(),
            'min_stock_alert' => $product->getMinStockAlert(),
            'unit' => $product->getUnit(),
            'description' => $product->getDescription(),
            'status' => $product->getStatus(),
        ]);
    }

    public function softDelete(int $id): bool
    {
        $sql = "UPDATE products SET deleted_at = CURRENT_TIMESTAMP WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute(['id' => $id]);
    }
}
