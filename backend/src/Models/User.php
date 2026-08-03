<?php

namespace StockFlow\Backend\Models;

use JsonSerializable;

/**
 * User Domain Entity
 * Owner: Manuja (Auth, RBAC & User Management)
 */
class User implements JsonSerializable
{
    private ?int $id;
    private string $username;
    private string $email;
    private string $passwordHash;
    private string $fullName;
    private string $role;
    private string $status;
    private ?string $lastLogin;
    private ?string $createdAt;
    private ?string $updatedAt;

    public function __construct(
        ?int $id = null,
        string $username = '',
        string $email = '',
        string $passwordHash = '',
        string $fullName = '',
        string $role = 'staff',
        string $status = 'active',
        ?string $lastLogin = null,
        ?string $createdAt = null,
        ?string $updatedAt = null
    ) {
        $this->id = $id;
        $this->username = $username;
        $this->email = $email;
        $this->passwordHash = $passwordHash;
        $this->fullName = $fullName;
        $this->role = $role;
        $this->status = $status;
        $this->lastLogin = $lastLogin;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    public static function fromArray(array $data): self
    {
        return new self(
            $data['id'] ?? null,
            $data['username'] ?? '',
            $data['email'] ?? '',
            $data['password_hash'] ?? $data['passwordHash'] ?? '',
            $data['full_name'] ?? $data['fullName'] ?? '',
            $data['role'] ?? 'staff',
            $data['status'] ?? 'active',
            $data['last_login'] ?? null,
            $data['created_at'] ?? null,
            $data['updated_at'] ?? null
        );
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): string
    {
        return $this->username;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function getPasswordHash(): string
    {
        return $this->passwordHash;
    }

    public function getFullName(): string
    {
        return $this->fullName;
    }

    public function getRole(): string
    {
        return $this->role;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function getLastLogin(): ?string
    {
        return $this->lastLogin;
    }

    public function getCreatedAt(): ?string
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?string
    {
        return $this->updatedAt;
    }

    public function setPasswordHash(string $hash): void
    {
        $this->passwordHash = $hash;
    }

    public function setRole(string $role): void
    {
        $this->role = $role;
    }

    public function setStatus(string $status): void
    {
        $this->status = $status;
    }

    public function verifyPassword(string $password): bool
    {
        return password_verify($password, $this->passwordHash);
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isStaff(): bool
    {
        return $this->role === 'staff';
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'username' => $this->username,
            'email' => $this->email,
            'full_name' => $this->fullName,
            'role' => $this->role,
            'status' => $this->status,
            'last_login' => $this->lastLogin,
            'created_at' => $this->createdAt,
            'updated_at' => $this->updatedAt,
        ];
    }

    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}
