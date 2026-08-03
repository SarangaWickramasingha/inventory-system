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
                c.created_at, 
                c.updated_at,
                COUNT(p.id) AS productCount
            FROM categories c
            LEFT JOIN products p ON c.id = p.category_id AND p.deleted_at IS NULL
            GROUP BY c.id, c.name, c.description, c.created_at, c.updated_at
            ORDER BY c.id ASC
        ");
        $stmt->execute();
        $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $iconMap = [
            'Computers & Laptops' => ['icon' => 'Laptop', 'color' => '#3B82F6', 'bgColor' => '#EFF6FF'],
            'Servers & Storage' => ['icon' => 'Server', 'color' => '#8B5CF6', 'bgColor' => '#F3E8FF'],
            'Networking & Telecom' => ['icon' => 'Network', 'color' => '#10B981', 'bgColor' => '#ECFDF5'],
            'Monitors & Displays' => ['icon' => 'Monitor', 'color' => '#EC4899', 'bgColor' => '#FCE7F3'],
            'Peripherals & Components' => ['icon' => 'Cpu', 'color' => '#D97706', 'bgColor' => '#FEF3C7'],
            'Power & Infrastructure' => ['icon' => 'Zap', 'color' => '#6366F1', 'bgColor' => '#EEF2FF'],
        ];

        $items = array_map(function ($cat) use ($iconMap) {
            $name = $cat['name'];
            $meta = $iconMap[$name] ?? ['icon' => 'Folder', 'color' => '#2563EB', 'bgColor' => '#EFF6FF'];
            return [
                'id' => (int)$cat['id'],
                'name' => $cat['name'],
                'description' => $cat['description'] ?? '',
                'productCount' => (int)$cat['productCount'],
                'icon' => $meta['icon'],
                'color' => $meta['color'],
                'bgColor' => $meta['bgColor'],
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
}
