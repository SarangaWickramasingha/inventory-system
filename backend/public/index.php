<?php

/**
 * StockFlow PHP Backend Entry Point (Front Controller)
 * Owner: Monorepo Core / Infrastructure
 */

// 1. CORS Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 2. PSR-4 Autoloader Implementation
spl_autoload_register(function ($class) {
    $prefix = 'StockFlow\\Backend\\';
    $baseDir = __DIR__ . '/../src/';

    if (strncmp($prefix, $class, strlen($prefix)) !== 0) {
        return;
    }

    $relativeClass = substr($class, strlen($prefix));

    if (strpos($relativeClass, 'Config\\') === 0) {
        $file = __DIR__ . '/../config/' . substr($relativeClass, 7) . '.php';
    } else {
        $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';
    }

    if (file_exists($file)) {
        require_once $file;
    }
});

// 3. Load Environment Variables from Root .env
$envFile = __DIR__ . '/../../../.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($name, $value) = explode('=', $line, 2);
        $_ENV[trim($name)] = trim($value);
    }
}

use StockFlow\Backend\Config\Database;
use StockFlow\Backend\Repositories\ProductRepository;
use StockFlow\Backend\Repositories\UserRepository;
use StockFlow\Backend\Repositories\StockLogRepository;
use StockFlow\Backend\Services\AuthService;
use StockFlow\Backend\Services\UserService;
use StockFlow\Backend\Services\ProductService;
use StockFlow\Backend\Core\Middleware\AuthMiddleware;
use StockFlow\Backend\Core\Middleware\RoleMiddleware;
use StockFlow\Backend\Controllers\ProductController;
use StockFlow\Backend\Controllers\UserController;
use StockFlow\Backend\Controllers\AuthController;
use StockFlow\Backend\Controllers\DashboardController;
use StockFlow\Backend\Controllers\ReportController;
use StockFlow\Backend\Controllers\StaffActivityController;

// 4. Initialize Database Connection with Error Response Handling
try {
    $db = Database::getConnection();
} catch (\Throwable $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Database connection error: ' . $e->getMessage()
    ]);
    exit;
}

// 5. Dependency Injection Container Setup
$productRepo = new ProductRepository($db);
$userRepo = new UserRepository($db);
$stockLogRepo = new StockLogRepository($db);

$authService = new AuthService($userRepo);
$userService = new UserService($userRepo);
$productService = new ProductService($db, $stockLogRepo);

$authMiddleware = new AuthMiddleware($authService);
$roleMiddleware = new RoleMiddleware();

$controllers = [
    'ProductController' => new ProductController($productRepo, $authMiddleware),
    'UserController' => new UserController($userService, $authMiddleware, $roleMiddleware),
    'AuthController' => new AuthController($authService, $userService, $authMiddleware),
    'DashboardController' => new DashboardController($db, $authMiddleware),
    'ReportController' => new ReportController($db, $authMiddleware),
    'StaffActivityController' => new StaffActivityController($productService, $stockLogRepo, $authMiddleware),
];

// 6. Router Request Dispatching
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Normalize URI (remove trailing slashes)
$path = rtrim($requestUri, '/');
if (empty($path)) $path = '/';

$routes = require __DIR__ . '/../config/routes.php';
$matched = false;

foreach ($routes as $routeKey => $handler) {
    list($method, $routePattern) = explode(' ', $routeKey, 2);

    if ($method !== $requestMethod) continue;

    // Convert route pattern parameters like {id} to regex matching
    $pattern = preg_replace('/\{([a-zA-Z0-9_]+)\}/', '(?P<\1>[a-zA-Z0-9_]+)', $routePattern);
    $pattern = '#^' . $pattern . '$#';

    if (preg_match($pattern, $path, $matches)) {
        $matched = true;
        list($controllerName, $actionName) = explode('@', $handler);

        if (isset($controllers[$controllerName])) {
            $controller = $controllers[$controllerName];
            
            // Filter named arguments from route parameters
            $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
            
            if (method_exists($controller, $actionName)) {
                call_user_func_array([$controller, $actionName], array_values($params));
                exit;
            }
        }
    }
}

if (!$matched) {
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'API Route not found: ' . $requestMethod . ' ' . $path
    ]);
    exit;
}
