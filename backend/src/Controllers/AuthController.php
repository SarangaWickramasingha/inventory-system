<?php

namespace StockFlow\Backend\Controllers;

use StockFlow\Backend\Services\AuthService;
use StockFlow\Backend\Services\UserService;
use StockFlow\Backend\Core\Middleware\AuthMiddleware;

/**
 * Auth Controller
 * Owner: Manuja (Auth, RBAC & User Management)
 */
class AuthController
{
    private AuthService $authService;
    private UserService $userService;
    private AuthMiddleware $authMiddleware;

    public function __construct(
        AuthService $authService,
        UserService $userService,
        AuthMiddleware $authMiddleware
    ) {
        $this->authService = $authService;
        $this->userService = $userService;
        $this->authMiddleware = $authMiddleware;
    }

    public function login(): void
    {
        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $email = trim($input['email'] ?? $input['username'] ?? '');
        $password = $input['password'] ?? '';

        $requestedRole = trim($input['role'] ?? '');

        if (empty($email) || empty($password)) {
            $this->jsonResponse(false, 'Email and password are required.', null, 400);
            return;
        }

        $user = $this->authService->getUserByCredentials($email);
        if (!$user || !$user->verifyPassword($password)) {
            $this->jsonResponse(false, 'Invalid login credentials.', null, 401);
            return;
        }

        if (!empty($requestedRole) && strtolower($user->getRole()) !== strtolower($requestedRole)) {
            $registeredRoleName = strtolower($user->getRole()) === 'admin' ? 'Administrator' : 'Staff';
            $this->jsonResponse(false, "This account is registered as a {$registeredRoleName}. Please select the {$registeredRoleName} role to sign in.", null, 403);
            return;
        }

        if ($user->getStatus() === 'pending') {
            $this->jsonResponse(false, 'Your staff account is pending Admin approval. Please wait for an administrator to approve your account before signing in.', [
                'user' => $user->toArray(),
                'pendingApproval' => true
            ], 200);
            return;
        }

        if ($user->getStatus() === 'inactive') {
            $this->jsonResponse(false, 'Your staff account is inactive. Please contact an administrator.', null, 400);
            return;
        }

        $token = $this->authService->generateToken($user);

        $this->jsonResponse(true, 'Login successful.', [
            'token' => $token,
            'user' => $user->toArray()
        ], 200);
    }

    public function register(): void
    {
        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        try {
            if (!isset($input['status'])) {
                $input['status'] = 'pending';
            }
            $user = $this->userService->createUser($input);
            $token = $this->authService->generateToken($user);

            $this->jsonResponse(true, 'Registration submitted successfully! Your staff account is currently pending Admin approval.', [
                'token' => $token,
                'user' => $user->toArray(),
                'pendingApproval' => ($user->getStatus() === 'pending')
            ], 201);
        } catch (\InvalidArgumentException $e) {
            $this->jsonResponse(false, $e->getMessage(), null, 400);
        } catch (\Exception $e) {
            $this->jsonResponse(false, 'An unexpected error occurred during registration: ' . $e->getMessage(), null, 500);
        }
    }

    public function me(): void
    {
        $payload = $this->authMiddleware->handle();
        if (!$payload) {
            return;
        }

        $userId = $payload['sub'] ?? null;
        if (!$userId) {
            $this->jsonResponse(false, 'User ID missing in token payload.', null, 400);
            return;
        }

        $user = $this->userService->getUserById($userId);
        if (!$user) {
            $this->jsonResponse(false, 'User not found.', null, 404);
            return;
        }

        $this->jsonResponse(true, 'User details retrieved successfully.', [
            'user' => $user->toArray()
        ], 200);
    }

    public function updateProfile(): void
    {
        $payload = $this->authMiddleware->handle();
        if (!$payload) return;

        $userId = $payload['sub'] ?? null;
        if (!$userId) {
            $this->jsonResponse(false, 'Unauthorized access.', null, 401);
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        try {
            $updatedUser = $this->userService->updateUserProfile((int)$userId, $input);
            $this->jsonResponse(true, 'Profile updated successfully.', [
                'user' => $updatedUser->toArray()
            ], 200);
        } catch (\InvalidArgumentException $e) {
            $this->jsonResponse(false, $e->getMessage(), null, 400);
        } catch (\Exception $e) {
            $this->jsonResponse(false, 'Failed to update profile.', null, 500);
        }
    }

    public function updatePassword(): void
    {
        $payload = $this->authMiddleware->handle();
        if (!$payload) return;

        $userId = $payload['sub'] ?? null;
        if (!$userId) {
            $this->jsonResponse(false, 'Unauthorized access.', null, 401);
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $currentPassword = $input['current_password'] ?? $input['currentPassword'] ?? '';
        $newPassword = $input['new_password'] ?? $input['newPassword'] ?? '';

        try {
            $this->userService->updateUserPassword((int)$userId, $currentPassword, $newPassword);
            $this->jsonResponse(true, 'Password updated successfully.', null, 200);
        } catch (\InvalidArgumentException $e) {
            $this->jsonResponse(false, $e->getMessage(), null, 400);
        } catch (\Exception $e) {
            $this->jsonResponse(false, 'Failed to update password.', null, 500);
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
