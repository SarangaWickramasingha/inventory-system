<?php

namespace StockFlow\Backend\Controllers;

use StockFlow\Backend\Repositories\ProductRepositoryInterface;
use StockFlow\Backend\Core\Middleware\AuthMiddleware;

/**
 * Product Controller
 * Owner: Ashan (Product Core & Information Display - Listing & Details)
 */
class ProductController
{
    private ProductRepositoryInterface $productRepository;
    private AuthMiddleware $authMiddleware;

    public function __construct(
        ProductRepositoryInterface $productRepository,
        AuthMiddleware $authMiddleware
    ) {
        $this->productRepository = $productRepository;
        $this->authMiddleware = $authMiddleware;
    }

    /**
     * GET /api/products
     * Listing with search, filtering, and pagination
     */
    public function index(): void
    {
        // Authenticate request if middleware is configured
        if (method_exists($this->authMiddleware, 'handle')) {
            $this->authMiddleware->handle();
        }

        $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
        $perPage = isset($_GET['per_page']) ? max(1, min(100, (int)$_GET['per_page'])) : 10;

        $filters = [
            'search' => $_GET['search'] ?? null,
            'category_id' => $_GET['category_id'] ?? null,
            'status' => $_GET['status'] ?? null,
        ];

        $products = $this->productRepository->findAll($filters, $page, $perPage);
        $totalItems = $this->productRepository->countAll($filters);
        $totalPages = ceil($totalItems / $perPage);

        $productList = array_map(fn($product) => $product->toArray(), $products);

        $this->jsonResponse(true, 'Products retrieved successfully.', [
            'items' => $productList,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total_items' => $totalItems,
                'total_pages' => $totalPages,
            ]
        ], 200);
    }

    /**
     * GET /api/products/{id}
     * Single product detail lookup
     */
    public function show(int $id): void
    {
        if (method_exists($this->authMiddleware, 'handle')) {
            $this->authMiddleware->handle();
        }

        $product = $this->productRepository->findById($id);

        if (!$product) {
            $this->jsonResponse(false, 'Product not found.', null, 404);
            return;
        }

        $this->jsonResponse(true, 'Product details retrieved successfully.', $product->toArray(), 200);
    }

    private function jsonResponse(bool $success, string $message, $data = null, int $statusCode = 200): void
    {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => $success,
            'message' => $message,
            'data' => $data,
        ]);
        exit;
    }
}
