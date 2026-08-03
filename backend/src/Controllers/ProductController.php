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
        $perPage = isset($_GET['per_page']) ? max(1, min(500, (int)$_GET['per_page'])) : 100;

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

    /**
     * POST /api/products
     * Create a new product in the database
     */
    public function create(): void
    {
        if (method_exists($this->authMiddleware, 'handle')) {
            $this->authMiddleware->handle();
        }

        $rawInput = file_get_contents('php://input');
        $data = json_decode($rawInput, true) ?? $_POST;

        if (empty($data['name']) || empty($data['sku'])) {
            $this->jsonResponse(false, 'Product name and SKU are required.', null, 400);
            return;
        }

        $existing = $this->productRepository->findBySku($data['sku']);
        if ($existing) {
            $this->jsonResponse(false, 'SKU already exists.', null, 409);
            return;
        }

        // Map price/cost_price/min_stock_alert field aliases if sent from frontend
        if (isset($data['sellingPrice']) && !isset($data['price'])) $data['price'] = $data['sellingPrice'];
        if (isset($data['buyingPrice']) && !isset($data['cost_price'])) $data['cost_price'] = $data['buyingPrice'];
        if (isset($data['reorderPoint']) && !isset($data['min_stock_alert'])) $data['min_stock_alert'] = $data['reorderPoint'];

        $qty = max(0, (int)($data['quantity'] ?? 0));
        $alert = (int)($data['min_stock_alert'] ?? 5);
        $data['quantity'] = $qty;
        if ($qty === 0) {
            $data['status'] = 'out_of_stock';
        } elseif ($qty <= $alert) {
            $data['status'] = 'low_stock';
        } else {
            $data['status'] = 'in_stock';
        }

        $product = \StockFlow\Backend\Models\Product::fromArray($data);
        $success = $this->productRepository->save($product);

        if ($success) {
            $created = $this->productRepository->findBySku($data['sku']);
            $this->jsonResponse(true, 'Product created successfully.', $created ? $created->toArray() : $product->toArray(), 201);
        } else {
            $this->jsonResponse(false, 'Failed to create product in database.', null, 500);
        }
    }

    /**
     * PUT /api/products/{id}
     * Update an existing product in the database
     */
    public function update(int $id): void
    {
        if (method_exists($this->authMiddleware, 'handle')) {
            $this->authMiddleware->handle();
        }

        $existing = $this->productRepository->findById($id);
        if (!$existing) {
            $this->jsonResponse(false, 'Product not found.', null, 404);
            return;
        }

        $rawInput = file_get_contents('php://input');
        $data = json_decode($rawInput, true) ?? [];

        if (isset($data['sellingPrice']) && !isset($data['price'])) $data['price'] = $data['sellingPrice'];
        if (isset($data['buyingPrice']) && !isset($data['cost_price'])) $data['cost_price'] = $data['buyingPrice'];
        if (isset($data['reorderPoint']) && !isset($data['min_stock_alert'])) $data['min_stock_alert'] = $data['reorderPoint'];

        $mergedData = array_merge($existing->toArray(), $data, ['id' => $id]);

        $qty = max(0, (int)($mergedData['quantity'] ?? 0));
        $alert = (int)($mergedData['min_stock_alert'] ?? 5);
        $mergedData['quantity'] = $qty;
        if ($qty === 0) {
            $mergedData['status'] = 'out_of_stock';
        } elseif ($qty <= $alert) {
            $mergedData['status'] = 'low_stock';
        } else {
            $mergedData['status'] = 'in_stock';
        }

        $updatedProduct = \StockFlow\Backend\Models\Product::fromArray($mergedData);

        $success = $this->productRepository->update($updatedProduct);

        if ($success) {
            $refetched = $this->productRepository->findById($id);
            $this->jsonResponse(true, 'Product updated successfully.', $refetched ? $refetched->toArray() : $updatedProduct->toArray(), 200);
        } else {
            $this->jsonResponse(false, 'Failed to update product in database.', null, 500);
        }
    }

    /**
     * DELETE /api/products/{id}
     * Soft delete a product from the database
     */
    public function delete(int $id): void
    {
        if (method_exists($this->authMiddleware, 'handle')) {
            $this->authMiddleware->handle();
        }

        $existing = $this->productRepository->findById($id);
        if (!$existing) {
            $this->jsonResponse(false, 'Product not found.', null, 404);
            return;
        }

        $success = $this->productRepository->softDelete($id);

        if ($success) {
            $this->jsonResponse(true, 'Product deleted successfully.', ['id' => $id], 200);
        } else {
            $this->jsonResponse(false, 'Failed to delete product from database.', null, 500);
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
        ]);
        exit;
    }
}
