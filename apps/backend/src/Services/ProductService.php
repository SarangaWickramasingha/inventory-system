<?php

namespace App\Services;

use App\Core\Validator;
use App\Core\ValidationException;
use Exception;
use InvalidArgumentException;

/**
 * Class ProductService
 * 
 * Handles all business logic, validation rules, SKU uniqueness checks,
 * and soft deletion for the Product module.
 */
class ProductService
{
    protected mixed $productRepository;
    protected ?\PDO $db;

    public function __construct(mixed $productRepository = null, ?\PDO $db = null)
    {
        $this->productRepository = $productRepository;
        $this->db = $db;
    }

    /**
     * Create a new product after validation and business rule checks.
     * 
     * @param array $data
     * @return array Created product entity
     * @throws ValidationException|Exception
     */
    public function createProduct(array $data): array
    {
        // 1. Trim unnecessary whitespace
        $trimmedData = $this->sanitizeInput($data);

        // 2. Validate input rules
        $rules = [
            'name' => 'required|string|min:2|max:255',
            'sku' => 'required|string|min:3|max:100|unique:products,sku',
            'category' => 'required|string',
            'supplier' => 'nullable|string',
            'quantity' => 'required|integer|min:0',
            'buying_price' => 'required|numeric|min:0',
            'selling_price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'brand' => 'nullable|string',
            'barcode' => 'nullable|string',
            'image' => 'nullable|string',
            'is_active' => 'nullable',
            'track_inventory' => 'nullable',
        ];

        $messages = [
            'sku.unique' => "SKU '{$trimmedData['sku']}' already exists in the system.",
            'name.required' => "Product name is required.",
            'sku.required' => "SKU is required."
        ];

        // Execute Validator
        $validator = new Validator($trimmedData, $rules, $messages, $this->db);
        $validator->validate();

        // 3. Business rule checks (e.g. repository duplicate SKU check fallback if DB connection not passed directly to validator)
        if ($this->productRepository && method_exists($this->productRepository, 'findBySku')) {
            $existing = $this->productRepository->findBySku($trimmedData['sku']);
            if ($existing) {
                throw new ValidationException([
                    'sku' => ["SKU '{$trimmedData['sku']}' already exists in the system."]
                ]);
            }
        }

        // 4. Default fields normalization
        $productPayload = [
            'name' => $trimmedData['name'],
            'sku' => strtoupper($trimmedData['sku']),
            'category' => $trimmedData['category'],
            'supplier' => $trimmedData['supplier'] ?? null,
            'quantity' => (int) ($trimmedData['quantity'] ?? 0),
            'buying_price' => (float) ($trimmedData['buying_price'] ?? 0.0),
            'selling_price' => (float) ($trimmedData['selling_price'] ?? 0.0),
            'description' => $trimmedData['description'] ?? null,
            'brand' => $trimmedData['brand'] ?? null,
            'barcode' => $trimmedData['barcode'] ?? null,
            'image' => $trimmedData['image'] ?? null,
            'is_active' => isset($trimmedData['is_active']) ? (bool) $trimmedData['is_active'] : true,
            'track_inventory' => isset($trimmedData['track_inventory']) ? (bool) $trimmedData['track_inventory'] : true,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
        ];

        // Save via repository if present, otherwise return normalized payload
        if ($this->productRepository && method_exists($this->productRepository, 'create')) {
            return $this->productRepository->create($productPayload);
        }

        return array_merge(['id' => uniqid('prod_')], $productPayload);
    }

    /**
     * Update an existing product after validation and business rule checks.
     * 
     * @param int|string $id
     * @param array $data
     * @return array Updated product entity
     * @throws ValidationException|InvalidArgumentException|Exception
     */
    public function updateProduct(int|string $id, array $data): array
    {
        if (empty($id)) {
            throw new InvalidArgumentException("Product ID is required for update.");
        }

        // 1. Trim unnecessary whitespace
        $trimmedData = $this->sanitizeInput($data);

        // 2. Validate input rules
        $rules = [
            'name' => 'required|string|min:2|max:255',
            'sku' => "required|string|min:3|max:100|unique:products,sku,{$id},id",
            'category' => 'required|string',
            'supplier' => 'nullable|string',
            'quantity' => 'required|integer|min:0',
            'buying_price' => 'required|numeric|min:0',
            'selling_price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'brand' => 'nullable|string',
            'barcode' => 'nullable|string',
            'image' => 'nullable|string',
            'is_active' => 'nullable',
            'track_inventory' => 'nullable',
        ];

        $messages = [
            'sku.unique' => "SKU '{$trimmedData['sku']}' already exists in the system."
        ];

        $validator = new Validator($trimmedData, $rules, $messages, $this->db);
        $validator->validate();

        // 3. Business rule SKU uniqueness check via repository
        if ($this->productRepository && method_exists($this->productRepository, 'findBySku')) {
            $existing = $this->productRepository->findBySku($trimmedData['sku']);
            if ($existing && isset($existing['id']) && (string)$existing['id'] !== (string)$id) {
                throw new ValidationException([
                    'sku' => ["SKU '{$trimmedData['sku']}' already exists in the system."]
                ]);
            }
        }

        $productPayload = [
            'name' => $trimmedData['name'],
            'sku' => strtoupper($trimmedData['sku']),
            'category' => $trimmedData['category'],
            'supplier' => $trimmedData['supplier'] ?? null,
            'quantity' => (int) ($trimmedData['quantity'] ?? 0),
            'buying_price' => (float) ($trimmedData['buying_price'] ?? 0.0),
            'selling_price' => (float) ($trimmedData['selling_price'] ?? 0.0),
            'description' => $trimmedData['description'] ?? null,
            'brand' => $trimmedData['brand'] ?? null,
            'barcode' => $trimmedData['barcode'] ?? null,
            'image' => $trimmedData['image'] ?? null,
            'is_active' => isset($trimmedData['is_active']) ? (bool) $trimmedData['is_active'] : true,
            'track_inventory' => isset($trimmedData['track_inventory']) ? (bool) $trimmedData['track_inventory'] : true,
            'updated_at' => date('Y-m-d H:i:s'),
        ];

        if ($this->productRepository && method_exists($this->productRepository, 'update')) {
            return $this->productRepository->update($id, $productPayload);
        }

        return array_merge(['id' => $id], $productPayload);
    }

    /**
     * Soft delete a product.
     * 
     * @param int|string $id
     * @return bool
     * @throws InvalidArgumentException
     */
    public function deleteProduct(int|string $id): bool
    {
        if (empty($id)) {
            throw new InvalidArgumentException("Product ID is required for deletion.");
        }

        if ($this->productRepository && method_exists($this->productRepository, 'softDelete')) {
            return $this->productRepository->softDelete($id);
        }

        return true;
    }

    /**
     * Helper to trim whitespace from text inputs.
     */
    protected function sanitizeInput(array $data): array
    {
        $sanitized = [];
        foreach ($data as $key => $value) {
            if (is_string($value)) {
                $sanitized[$key] = trim($value);
            } else {
                $sanitized[$key] = $value;
            }
        }
        return $sanitized;
    }
}
