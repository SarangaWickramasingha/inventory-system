<?php

namespace StockFlow\Backend\Controllers;

use StockFlow\Backend\Core\Middleware\AuthMiddleware;
use PDO;

/**
 * CategoryController
 * REST Controller for Category management and Database retrieval.
 */
class CategoryController
{
    private PDO $db;
    private AuthMiddleware $authMiddleware;

    public function __construct(PDO $db, AuthMiddleware $authMiddleware)
    {
        $this->db = $db;
        $this->authMiddleware = $authMiddleware;
    }

    public function index(): void
    {
        // Authenticate request
        $this->authMiddleware->handle();

        $stmt = $this->db->prepare("
            SELECT 
                c.id, 
                c.name, 
                c.description, 
                c.icon,
                c.color,
                c.created_at, 
                c.updated_at,
                COUNT(p.id) AS productCount
            FROM categories c
            LEFT JOIN products p ON c.id = p.category_id AND p.deleted_at IS NULL
            GROUP BY c.id, c.name, c.description, c.icon, c.color, c.created_at, c.updated_at
            ORDER BY c.id ASC
        ");
        $stmt->execute();
        $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $defaultIconMap = [
            'Computers & Laptops' => ['icon' => 'Laptop', 'color' => '#3B82F6'],
            'Servers & Storage' => ['icon' => 'Server', 'color' => '#8B5CF6'],
            'Networking & Telecom' => ['icon' => 'Network', 'color' => '#10B981'],
            'Monitors & Displays' => ['icon' => 'Monitor', 'color' => '#EC4899'],
            'Peripherals & Components' => ['icon' => 'Cpu', 'color' => '#D97706'],
            'Power & Infrastructure' => ['icon' => 'Zap', 'color' => '#6366F1'],
        ];

        $items = array_map(function ($cat) use ($defaultIconMap) {
            $name = $cat['name'];
            $defaultMeta = $defaultIconMap[$name] ?? ['icon' => 'Folder', 'color' => '#2563EB'];
            
            $icon = !empty($cat['icon']) ? $cat['icon'] : $defaultMeta['icon'];
            $color = !empty($cat['color']) ? $cat['color'] : $defaultMeta['color'];

            return [
                'id' => (int)$cat['id'],
                'name' => $cat['name'],
                'description' => $cat['description'] ?? '',
                'productCount' => (int)$cat['productCount'],
                'icon' => $icon,
                'color' => $color,
                'bgColor' => '#EFF6FF',
                'created_at' => $cat['created_at'],
                'updated_at' => $cat['updated_at'],
            ];
        }, $categories);

        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'message' => 'Categories retrieved successfully from database.',
            'data' => [
                'items' => $items,
                'total_items' => count($items)
            ]
        ]);
        exit;
    }

    public function create(): void
    {
        $payload = $this->authMiddleware->handle();
        if (!$payload) {
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $name = trim($input['name'] ?? '');
        $description = trim($input['description'] ?? '');
        $icon = trim($input['icon'] ?? 'Folder');
        $color = trim($input['color'] ?? '#2563EB');

        if (empty($name)) {
            header('Content-Type: application/json');
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Category name is required.',
                'data' => null
            ]);
            exit;
        }

        // Check if category name already exists
        $checkStmt = $this->db->prepare("SELECT id FROM categories WHERE LOWER(name) = LOWER(:name) LIMIT 1");
        $checkStmt->execute(['name' => $name]);
        if ($checkStmt->fetch()) {
            header('Content-Type: application/json');
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Category with this name already exists in the database.',
                'data' => null
            ]);
            exit;
        }

        // Insert new category
        $insertStmt = $this->db->prepare("
            INSERT INTO categories (name, description, icon, color)
            VALUES (:name, :description, :icon, :color)
        ");
        $insertStmt->execute([
            'name' => $name,
            'description' => $description,
            'icon' => !empty($icon) ? $icon : 'Folder',
            'color' => !empty($color) ? $color : '#2563EB',
        ]);

        $catId = (int)$this->db->lastInsertId();

        $newCategory = [
            'id' => $catId,
            'name' => $name,
            'description' => $description,
            'productCount' => 0,
            'icon' => !empty($icon) ? $icon : 'Folder',
            'color' => !empty($color) ? $color : '#2563EB',
            'bgColor' => '#EFF6FF'
        ];

        header('Content-Type: application/json');
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Category created successfully in database.',
            'data' => [
                'category' => $newCategory
            ]
        ]);
        exit;
    }

    public function delete(int $id): void
    {
        $payload = $this->authMiddleware->handle();
        if (!$payload) {
            return;
        }

        if ($id <= 0) {
            header('Content-Type: application/json');
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid category ID provided.'
            ]);
            exit;
        }

        // 1. Unassign products under this category so they are safe
        $unassignStmt = $this->db->prepare("UPDATE products SET category_id = NULL WHERE category_id = :id");
        $unassignStmt->execute(['id' => $id]);

        // 2. Delete category record from database
        $stmt = $this->db->prepare("DELETE FROM categories WHERE id = :id");
        $stmt->execute(['id' => $id]);

        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'message' => 'Category deleted from database successfully.'
        ]);
        exit;
    }
}
