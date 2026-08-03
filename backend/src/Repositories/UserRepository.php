<?php

namespace StockFlow\Backend\Repositories;

use PDO;
use StockFlow\Backend\Models\User;

/**
 * UserRepository Implementation
 * Owner: Manuja (Auth, RBAC & User Management)
 */
class UserRepository implements UserRepositoryInterface
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function findById(int $id): ?User
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE id = :id LIMIT 1");
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row ? User::fromArray($row) : null;
    }

    public function findByEmail(string $email): ?User
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = :email LIMIT 1");
        $stmt->execute(['email' => $email]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row ? User::fromArray($row) : null;
    }

    public function findByUsername(string $username): ?User
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE username = :username LIMIT 1");
        $stmt->execute(['username' => $username]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row ? User::fromArray($row) : null;
    }

    public function findAll(): array
    {
        $stmt = $this->db->query("SELECT * FROM users ORDER BY id DESC");
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map(fn($row) => User::fromArray($row), $rows);
    }

    public function save(User $user): bool
    {
        if ($user->getId() !== null) {
            // Update existing user
            $stmt = $this->db->prepare("
                UPDATE users 
                SET username = :username,
                    email = :email,
                    password_hash = :password_hash,
                    full_name = :full_name,
                    role = :role,
                    status = :status,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = :id
            ");
            return $stmt->execute([
                'id' => $user->getId(),
                'username' => $user->getUsername(),
                'email' => $user->getEmail(),
                'password_hash' => $user->getPasswordHash(),
                'full_name' => $user->getFullName(),
                'role' => $user->getRole(),
                'status' => $user->getStatus(),
            ]);
        }

        // Insert new user
        $stmt = $this->db->prepare("
            INSERT INTO users (username, email, password_hash, full_name, role, status)
            VALUES (:username, :email, :password_hash, :full_name, :role, :status)
        ");
        return $stmt->execute([
            'username' => $user->getUsername(),
            'email' => $user->getEmail(),
            'password_hash' => $user->getPasswordHash(),
            'full_name' => $user->getFullName(),
            'role' => $user->getRole(),
            'status' => $user->getStatus(),
        ]);
    }

    public function updateStatus(int $id, string $status): bool
    {
        $stmt = $this->db->prepare("
            UPDATE users 
            SET status = :status, updated_at = CURRENT_TIMESTAMP 
            WHERE id = :id
        ");
        return $stmt->execute(['id' => $id, 'status' => $status]);
    }

    public function updateLastLogin(int $id): bool
    {
        $stmt = $this->db->prepare("
            UPDATE users 
            SET last_login = CURRENT_TIMESTAMP 
            WHERE id = :id
        ");
        return $stmt->execute(['id' => $id]);
    }

    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM users WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
}
