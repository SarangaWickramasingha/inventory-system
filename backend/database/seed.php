<?php

/**
 * StockFlow Automatic Database Seeder Runner
 * Connects to MySQL and executes schema.sql and seeders.sql
 */

$host = getenv('DB_HOST') ?: '127.0.0.1';
$port = getenv('DB_PORT') ?: '3306';
$user = getenv('DB_USERNAME') ?: 'root';
$pass = getenv('DB_PASSWORD') ?: '';
$dbname = getenv('DB_DATABASE') ?: 'stockflow_db';

echo "==========================================" . PHP_EOL;
echo "StockFlow MySQL Database Seeder Runner" . PHP_EOL;
echo "==========================================" . PHP_EOL;

try {
    // 1. Connect to MySQL server
    echo "[1/4] Connecting to MySQL server at {$host}:{$port}..." . PHP_EOL;
    $pdo = new PDO("mysql:host={$host};port={$port};charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    // 2. Create Database if not exists
    echo "[2/4] Initializing database '{$dbname}'..." . PHP_EOL;
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$dbname}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE `{$dbname}`");

    // 3. Execute Schema Definition
    echo "[3/4] Executing schema.sql (tables, indexes, foreign keys)..." . PHP_EOL;
    $schemaSql = file_get_contents(__DIR__ . '/schema.sql');
    if ($schemaSql) {
        $pdo->exec($schemaSql);
        echo "      ✔ Schema loaded successfully." . PHP_EOL;
    }

    // 4. Execute Seeders Definition
    echo "[4/4] Executing seeders.sql (IT categories, products, users, logs)..." . PHP_EOL;
    $seedersSql = file_get_contents(__DIR__ . '/seeders.sql');
    if ($seedersSql) {
        $pdo->exec($seedersSql);
        echo "      ✔ Seed data inserted successfully." . PHP_EOL;
    }

    // 5. Verify Categories Table Count
    $catCount = $pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn();
    $prodCount = $pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
    $userCount = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();

    echo "==========================================" . PHP_EOL;
    echo "SUCCESS! Database populated successfully:" . PHP_EOL;
    echo " - Categories: {$catCount} IT equipment categories" . PHP_EOL;
    echo " - Products:   {$prodCount} IT hardware items" . PHP_EOL;
    echo " - Users:      {$userCount} initial user accounts" . PHP_EOL;
    echo "==========================================" . PHP_EOL;

} catch (PDOException $e) {
    echo PHP_EOL . "❌ MySQL Connection/Query Error: " . $e->getMessage() . PHP_EOL;
    echo "Tip: Make sure MySQL service is running on {$host}:{$port} and credentials are correct." . PHP_EOL;
    exit(1);
}
