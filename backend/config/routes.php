<?php

/**
 * Global Route Definitions
 * Owner: Monorepo Core / Ashan & Team
 */

return [
    // Auth Routes (Manuja)
    'POST /api/auth/login' => 'AuthController@login',
    'GET /api/auth/me' => 'AuthController@me',

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
];
