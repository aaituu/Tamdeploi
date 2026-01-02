<?php
require_once __DIR__ . '/../../helpers/response.php';

// Set CORS headers
Response::setCorsHeaders();

// Only allow POST requests
if (Response::getMethod() !== 'POST') {
    Response::error('Method not allowed', 405);
}

// Clear cookie
setcookie('token', '', [
    'expires' => time() - 3600,
    'path' => '/',
    'domain' => '',
    'secure' => isset($_SERVER['HTTPS']),
    'httponly' => true,
    'samesite' => 'Lax'
]);

// Return success response
Response::success('Logout successful');
?>