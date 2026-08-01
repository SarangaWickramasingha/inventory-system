<?php

namespace App\Core;

/**
 * Class Response
 * 
 * Standardized API Response Helper matching architecture guidelines.
 */
class Response
{
    /**
     * Return JSON response with consistent structure.
     * 
     * @param bool $success
     * @param mixed $data
     * @param string $message
     * @param int $statusCode
     * @return void
     */
    public static function json(bool $success, mixed $data = null, string $message = '', int $statusCode = 200): void
    {
        if (!headers_sent()) {
            http_response_code($statusCode);
            header('Content-Type: application/json; charset=utf-8');
        }

        $payload = [
            'success' => $success,
            'message' => $message,
            'data' => $data,
            'statusCode' => $statusCode,
        ];

        echo json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        exit;
    }
}
