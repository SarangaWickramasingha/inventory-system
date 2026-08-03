<?php

namespace StockFlow\Backend\Core\Middleware;

use StockFlow\Backend\Services\AuthService;

/**
 * Authentication Middleware
 * Owner: Manuja (Auth, RBAC & User Management)
 */
class AuthMiddleware
{
    private AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function handle(): ?array
    {
        $headers = function_exists('getallheaders') ? getallheaders() : [];
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';

        if (empty($authHeader) || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            $this->unauthorized('Authorization header missing or invalid format.');
            return null;
        }

        $token = trim($matches[1]);
        $payload = $this->authService->verifyToken($token);

        if (!$payload) {
            $this->unauthorized('Invalid or expired authentication token.');
            return null;
        }

        return $payload;
    }

    private function unauthorized(string $message): void
    {
        http_response_code(401);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'error' => 'UNAUTHORIZED',
            'message' => $message,
            'status' => 401
        ]);
        exit;
    }
}
