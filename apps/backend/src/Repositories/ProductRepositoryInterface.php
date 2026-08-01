<?php

namespace StockFlow\Backend\Repositories;

use StockFlow\Backend\Models\Product;

/**
 * ProductRepository Interface
 * Owner: Ashan (Product Core & Information Display)
 */
interface ProductRepositoryInterface
{
    public function findById(int $id): ?Product;
    public function findBySku(string $sku): ?Product;
    public function findAll(array $filters = [], int $page = 1, int $perPage = 10): array;
    public function countAll(array $filters = []): int;
    public function save(Product $product): bool;
    public function update(Product $product): bool;
    public function softDelete(int $id): bool;
}
