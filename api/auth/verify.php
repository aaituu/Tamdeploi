<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth.php';

// Set CORS headers
Response::setCorsHeaders();

// Only allow GET requests
if (Response::getMethod() !== 'GET') {
    Response::error('Method not allowed', 405);
}

// Authenticate user
$auth = AuthMiddleware::authenticate();

// Return user data
Response::success('Token is valid', [
    'user' => $auth['user']
]);
?>