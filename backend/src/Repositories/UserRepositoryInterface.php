<?php

namespace StockFlow\Backend\Repositories;

use StockFlow\Backend\Models\User;

/**
 * UserRepository Interface
 * Owner: Manuja (Auth, RBAC & User Management)
 */
interface UserRepositoryInterface
{
    public function findById(int $id): ?User;
    public function findByEmail(string $email): ?User;
    public function findByUsername(string $username): ?User;
    public function findAll(): array;
    public function save(User $user): bool;
    public function updateStatus(int $id, string $status): bool;
    public function updateLastLogin(int $id): bool;
    public function delete(int $id): bool;
}
