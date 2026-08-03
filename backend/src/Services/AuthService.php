<?php

namespace StockFlow\Backend\Services;

use StockFlow\Backend\Models\User;
use StockFlow\Backend\Repositories\UserRepositoryInterface;

/**
 * Pure PHP HMAC SHA-256 Authentication Service
 * Owner: Manuja (Auth, RBAC & User Management)
 */
class AuthService
{
    private UserRepositoryInterface $userRepo;
    private string $secretKey;

    public function __construct(UserRepositoryInterface $userRepo, string $secretKey = 'stockflow_secret_key_2026_hmac_sha256')
    {
        $this->userRepo = $userRepo;
        $this->secretKey = $secretKey;
    }

    public function authenticate(string $email, string $password): ?User
    {
        $user = $this->userRepo->findByEmail($email);

        if (!$user) {
            // Also try username fallback
            $user = $this->userRepo->findByUsername($email);
        }

        if (!$user || !$user->isActive()) {
            return null;
        }

        if (!$user->verifyPassword($password)) {
            return null;
        }

        if ($user->getId()) {
            $this->userRepo->updateLastLogin($user->getId());
        }

        return $user;
    }

    public function generateToken(User $user, int $ttlSeconds = 86400): string
    {
        $header = ['alg' => 'HS256', 'typ' => 'JWT'];
        $now = time();
        $payload = [
            'sub' => $user->getId(),
            'username' => $user->getUsername(),
            'email' => $user->getEmail(),
            'role' => $user->getRole(),
            'name' => $user->getFullName(),
            'iat' => $now,
            'exp' => $now + $ttlSeconds
        ];

        $encodedHeader = $this->base64UrlEncode(json_encode($header));
        $encodedPayload = $this->base64UrlEncode(json_encode($payload));

        $signature = hash_hmac('sha256', "$encodedHeader.$encodedPayload", $this->secretKey, true);
        $encodedSignature = $this->base64UrlEncode($signature);

        return "$encodedHeader.$encodedPayload.$encodedSignature";
    }

    public function verifyToken(string $token): ?array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        [$encodedHeader, $encodedPayload, $providedSignature] = $parts;

        $expectedSignature = $this->base64UrlEncode(
            hash_hmac('sha256', "$encodedHeader.$encodedPayload", $this->secretKey, true)
        );

        if (!hash_equals($expectedSignature, $providedSignature)) {
            return null;
        }

        $payload = json_decode($this->base64UrlDecode($encodedPayload), true);
        if (!$payload || !isset($payload['exp']) || $payload['exp'] < time()) {
            return null;
        }

        return $payload;
    }

    private function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private function base64UrlDecode(string $data): string
    {
        return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', (4 - strlen($data) % 4) % 4));
    }
}
