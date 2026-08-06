<?php

namespace StockFlow\Backend\Controllers;

use StockFlow\Backend\Services\UserService;
use StockFlow\Backend\Core\Middleware\AuthMiddleware;
use StockFlow\Backend\Core\Middleware\RoleMiddleware;

/**
 * User Controller (Admin Module)
 * Owner: Manuja (Auth, RBAC & User Management)
 */
class UserController
{
    private UserService $userService;
    private AuthMiddleware $authMiddleware;
    private RoleMiddleware $roleMiddleware;

    public function __construct(
        UserService $userService,
        AuthMiddleware $authMiddleware,
        RoleMiddleware $roleMiddleware
    ) {
        $this->userService = $userService;
        $this->authMiddleware = $authMiddleware;
        $this->roleMiddleware = $roleMiddleware;
    }

    private function authenticateAdmin(): array
    {
        $payload = $this->authMiddleware->handle();
        $this->roleMiddleware->handle($payload, 'admin');
        return $payload;
    }

    public function index(): void
    {
        $this->authenticateAdmin();

        $users = $this->userService->getAllUsers();
        $userList = array_map(fn($user) => $user->toArray(), $users);

        $this->jsonResponse(true, 'Users fetched successfully.', $userList, 200);
    }

    public function create(): void
    {
        $this->authenticateAdmin();

        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        try {
            $user = $this->userService->createUser($input);
            $this->jsonResponse(true, 'User created successfully.', $user->toArray(), 201);
        } catch (\InvalidArgumentException $e) {
            $this->jsonResponse(false, $e->getMessage(), null, 400);
        } catch (\Exception $e) {
            $this->jsonResponse(false, 'Failed to create user.', null, 500);
        }
    }

    public function update(int $id): void
    {
        $this->authenticateAdmin();

        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        try {
            $updatedUser = $this->userService->updateUser($id, $input);
            if ($updatedUser !== null) {
                $this->jsonResponse(true, 'User account updated successfully.', $updatedUser->toArray(), 200);
            } else {
                $this->jsonResponse(false, 'User not found after update.', null, 404);
            }
        } catch (\InvalidArgumentException $e) {
            $this->jsonResponse(false, $e->getMessage(), null, 400);
        } catch (\Exception $e) {
            $this->jsonResponse(false, 'Failed to update user account.', null, 500);
        }
    }

    public function updateStatus(int $id): void
    {
        $this->authenticateAdmin();

        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $status = $input['status'] ?? '';

        try {
            $success = $this->userService->updateUserStatus($id, $status);
            if ($success) {
                $this->jsonResponse(true, "User status updated to '{$status}'.", null, 200);
            } else {
                $this->jsonResponse(false, 'Failed to update user status.', null, 500);
            }
        } catch (\InvalidArgumentException $e) {
            $this->jsonResponse(false, $e->getMessage(), null, 400);
        }
    }

    public function delete(int $id): void
    {
        $currentAdmin = $this->authenticateAdmin();

        // Prevent self-deletion
        if (($currentAdmin['sub'] ?? null) == $id) {
            $this->jsonResponse(false, 'You cannot delete your own account.', null, 400);
            return;
        }

        try {
            $success = $this->userService->deleteUser($id);
            if ($success) {
                $this->jsonResponse(true, 'User deleted successfully.', null, 200);
            } else {
                $this->jsonResponse(false, 'Failed to delete user.', null, 500);
            }
        } catch (\InvalidArgumentException $e) {
            $this->jsonResponse(false, $e->getMessage(), null, 400);
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
            'status' => $statusCode
        ]);
        exit;
    }
}
