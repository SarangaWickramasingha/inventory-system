<?php

/**
 * Global Route Definitions
 * Owner: Monorepo Core / Ashan & Team
 */

return [
    // Auth Routes (Manuja)
    'POST /api/auth/login' => 'AuthController@login',
    'GET /api/auth/me' => 'AuthController@me',
    'PUT /api/auth/profile' => 'AuthController@updateProfile',
    'PUT /api/auth/password' => 'AuthController@updatePassword',

    // User Management Routes (Manuja)
    'GET /api/users' => 'UserController@index',
    'POST /api/users' => 'UserController@create',

    // Product Core & Information Display Routes (Ashan)
    'GET /api/products' => 'ProductController@index',
    'GET /api/products/{id}' => 'ProductController@show',
    'POST /api/products' => 'ProductController@create',
    'PUT /api/products/{id}' => 'ProductController@update',
    'DELETE /api/products/{id}' => 'ProductController@delete',

    // Category Routes
    'GET /api/categories' => 'CategoryController@index',

    // Staff Activity & Stock Log Routes (Sashika)
    'GET /api/stock-logs' => 'StaffActivityController@getStaffLogs',
    'POST /api/stock-logs' => 'StaffActivityController@logMovement',
    'GET /api/staff-activity/logs' => 'StaffActivityController@getStaffLogs',
    'POST /api/staff-activity/adjust-stock' => 'StaffActivityController@logMovement',
];
