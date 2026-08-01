<?php

namespace App\Controllers;

use App\Services\ProductService;
use App\Core\Response;
use App\Core\ValidationException;
use Exception;
use InvalidArgumentException;

/**
 * Class ProductController
 * 
 * Handles HTTP requests for the Product Add/Edit/Delete endpoints.
 * Strictly delegates business logic to ProductService and formats responses via Response::json.
 */
class ProductController
{
    protected ProductService $productService;

    public function __construct(?ProductService $productService = null)
    {
        $this->productService = $productService ?? new ProductService();
    }

    /**
     * Store a newly created product in storage.
     * Endpoint: POST /api/products
     * 
     * @param array|null $requestData Data array or parses php://input if null
     * @return void Outputs JSON response
     */
    public function store(?array $requestData = null): void
    {
        try {
            $input = $requestData ?? $this->getRequestInput();

            $product = $this->productService->createProduct($input);

            Response::json(
                success: true,
                data: $product,
                message: "Product created successfully.",
                statusCode: 201
            );
        } catch (ValidationException $e) {
            Response::json(
                success: false,
                data: ['errors' => $e->getErrors()],
                message: $e->getMessage(),
                statusCode: 422
            );
        } catch (InvalidArgumentException $e) {
            Response::json(
                success: false,
                data: null,
                message: $e->getMessage(),
                statusCode: 400
            );
        } catch (Exception $e) {
            Response::json(
                success: false,
                data: null,
                message: $e->getMessage() ?: "An error occurred while creating the product.",
                statusCode: 500
            );
        }
    }

    /**
     * Update the specified product in storage.
     * Endpoint: PUT /api/products/{id}
     * 
     * @param int|string $id
     * @param array|null $requestData
     * @return void Outputs JSON response
     */
    public function update(int|string $id, ?array $requestData = null): void
    {
        try {
            $input = $requestData ?? $this->getRequestInput();

            $product = $this->productService->updateProduct($id, $input);

            Response::json(
                success: true,
                data: $product,
                message: "Product updated successfully.",
                statusCode: 200
            );
        } catch (ValidationException $e) {
            Response::json(
                success: false,
                data: ['errors' => $e->getErrors()],
                message: $e->getMessage(),
                statusCode: 422
            );
        } catch (InvalidArgumentException $e) {
            Response::json(
                success: false,
                data: null,
                message: $e->getMessage(),
                statusCode: 400
            );
        } catch (Exception $e) {
            Response::json(
                success: false,
                data: null,
                message: $e->getMessage() ?: "An error occurred while updating the product.",
                statusCode: 500
            );
        }
    }

    /**
     * Remove (soft delete) the specified product from storage.
     * Endpoint: DELETE /api/products/{id}
     * 
     * @param int|string $id
     * @return void Outputs JSON response
     */
    public function destroy(int|string $id): void
    {
        try {
            $this->productService->deleteProduct($id);

            Response::json(
                success: true,
                data: null,
                message: "Product removed successfully.",
                statusCode: 200
            );
        } catch (InvalidArgumentException $e) {
            Response::json(
                success: false,
                data: null,
                message: $e->getMessage(),
                statusCode: 400
            );
        } catch (Exception $e) {
            Response::json(
                success: false,
                data: null,
                message: $e->getMessage() ?: "An error occurred while deleting the product.",
                statusCode: 500
            );
        }
    }

    /**
     * Helper to read JSON request body from standard input stream.
     */
    protected function getRequestInput(): array
    {
        $rawContent = file_get_contents('php://input');
        if (!empty($rawContent)) {
            $decoded = json_decode($rawContent, true);
            if (is_array($decoded)) {
                return $decoded;
            }
        }
        return $_POST ?? [];
    }
}
