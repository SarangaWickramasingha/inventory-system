<?php

namespace StockFlow\Backend\Repositories;

use StockFlow\Backend\Models\StockLog;

/**
 * StockLogRepository Contract Interface
 * Owner: Sashika (Staff Activity Portal & Stock Movements)
 */
interface StockLogRepositoryInterface
{
    public function create(StockLog $stockLog): int;

    public function findById(int $id): ?StockLog;

    public function findAll(
        ?int $productId = null,
        ?int $userId = null,
        ?string $dateFilter = null,
        ?string $typeFilter = null,
        ?string $search = null
    ): array;

    public function getStaffLogs(int $userId): array;
}
