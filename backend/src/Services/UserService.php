<?php

namespace StockFlow\Backend\Services;

use InvalidArgumentException;
use StockFlow\Backend\Models\User;
use StockFlow\Backend\Repositories\UserRepositoryInterface;

/**
 * User Service (CRUD, Password Hashing, Status Toggles)
 * Owner: Manuja (Auth, RBAC & User Management)
 */
class UserService
{
    private UserRepositoryInterface $userRepo;

    public function __construct(UserRepositoryInterface $userRepo)
    {
        $this->userRepo = $userRepo;
    }

    public function getAllUsers(): array
    {
        return $this->userRepo->findAll();
    }

    public function getUserById(int $id): ?User
    {
        return $this->userRepo->findById($id);
    }

    public function createUser(array $data): User
    {
        $username = trim($data['username'] ?? '');
        $email = trim($data['email'] ?? '');
        $password = $data['password'] ?? '';
        $fullName = trim($data['full_name'] ?? $data['fullName'] ?? '');
        $role = strtolower(trim($data['role'] ?? 'staff'));
        $status = strtolower(trim($data['status'] ?? 'active'));

        if (empty($username) || empty($email) || empty($password) || empty($fullName)) {
            throw new InvalidArgumentException("Username, email, password, and full name are required.");
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException("Invalid email format.");
        }

        if (!in_array($role, ['admin', 'staff'], true)) {
            throw new InvalidArgumentException("Invalid role specified. Must be 'admin' or 'staff'.");
        }

        if ($this->userRepo->findByEmail($email)) {
            throw new InvalidArgumentException("User with this email already exists.");
        }

        if ($this->userRepo->findByUsername($username)) {
            throw new InvalidArgumentException("User with this username already exists.");
        }

        $passwordHash = password_hash($password, PASSWORD_BCRYPT);
        $user = new User(
            null,
            $username,
            $email,
            $passwordHash,
            $fullName,
            $role,
            $status
        );

        $success = $this->userRepo->save($user);
        if (!$success) {
            throw new \RuntimeException("Failed to persist user to database.");
        }

        return $this->userRepo->findByEmail($email);
    }

    public function updateUserStatus(int $id, string $status): bool
    {
        if (!in_array($status, ['active', 'inactive', 'pending'], true)) {
            throw new InvalidArgumentException("Status must be 'active', 'inactive', or 'pending'.");
        }

        $user = $this->userRepo->findById($id);
        if (!$user) {
            throw new InvalidArgumentException("User not found.");
        }

        return $this->userRepo->updateStatus($id, $status);
    }

    public function deleteUser(int $id): bool
    {
        $user = $this->userRepo->findById($id);
        if (!$user) {
            throw new InvalidArgumentException("User not found.");
        }

        return $this->userRepo->delete($id);
    }

    public function updateUser(int $id, array $data): User
    {
        $user = $this->userRepo->findById($id);
        if (!$user) {
            throw new InvalidArgumentException("User not found.");
        }

        $fullName = trim($data['name'] ?? $data['full_name'] ?? $data['fullName'] ?? $user->getFullName());
        $username = trim($data['username'] ?? $user->getUsername());
        $email = trim($data['email'] ?? $user->getEmail());
        $role = !empty($data['role']) ? strtolower(trim($data['role'])) : strtolower($user->getRole());
        $status = !empty($data['status']) ? strtolower(trim($data['status'])) : strtolower($user->getStatus());

        if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException("Invalid email format.");
        }

        if (!in_array($status, ['active', 'inactive', 'pending'], true)) {
            throw new InvalidArgumentException("Status must be 'active', 'inactive', or 'pending'.");
        }

        $updated = new User(
            $user->getId(),
            $username,
            $email,
            $user->getPasswordHash(),
            $fullName,
            $role,
            $status
        );

        $this->userRepo->save($updated);
        return $this->userRepo->findById($id);
    }

    public function updateUserProfile(int $id, array $data): User
    {
        $user = $this->userRepo->findById($id);
        if (!$user) {
            throw new InvalidArgumentException("User not found.");
        }

        $fullName = trim($data['name'] ?? $data['full_name'] ?? $data['fullName'] ?? $user->getFullName());
        $email = trim($data['email'] ?? $user->getEmail());
        $role = strtolower(trim($data['role'] ?? $user->getRole()));

        if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException("Invalid email format.");
        }

        $updated = new User(
            $user->getId(),
            $user->getUsername(),
            $email,
            $user->getPasswordHash(),
            $fullName,
            $role,
            $user->getStatus()
        );

        $this->userRepo->save($updated);
        return $this->userRepo->findById($id);
    }

    public function updateUserPassword(int $id, string $currentPassword, string $newPassword): bool
    {
        $user = $this->userRepo->findById($id);
        if (!$user) {
            throw new InvalidArgumentException("User not found.");
        }

        if (!password_verify($currentPassword, $user->getPasswordHash())) {
            throw new InvalidArgumentException("Current password is incorrect.");
        }

        if (strlen($newPassword) < 6) {
            throw new InvalidArgumentException("New password must be at least 6 characters.");
        }

        $user->setPasswordHash(password_hash($newPassword, PASSWORD_BCRYPT));
        return $this->userRepo->save($user);
    }
}
