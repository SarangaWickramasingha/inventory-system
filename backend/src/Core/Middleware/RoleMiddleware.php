<?php

namespace StockFlow\Backend\Core\Middleware;

/**
 * Role-Based Access Control (RBAC) Middleware
 * Owner: Manuja (Auth, RBAC & User Management)
 */
class RoleMiddleware
{
    public function handle(array $userPayload, string $requiredRole = 'admin'): bool
    {
        $userRole = strtolower($userPayload['role'] ?? '');

        if ($userRole !== strtolower($requiredRole)) {
            $this->forbidden("Access denied. Require '{$requiredRole}' role permission.");
            return false;
        }

        return true;
    }

    private function forbidden(string $message): void
    {
        http_response_code(403);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'error' => 'FORBIDDEN',
            'message' => $message,
            'status' => 403
        ]);
        exit;
    }
}
