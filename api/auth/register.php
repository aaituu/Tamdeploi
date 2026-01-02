<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';

// Set CORS headers
Response::setCorsHeaders();

// Only allow POST requests
if (Response::getMethod() !== 'POST') {
    Response::error('Method not allowed', 405);
}

// Get JSON input
$data = Response::getJsonInput();

// Validate required fields
Response::validateRequired($data, ['email', 'password']);

$email = trim($data['email']);
$password = $data['password'];
$name = isset($data['name']) ? trim($data['name']) : null;

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    Response::error('Invalid email format', 400);
}

// Validate password length
if (strlen($password) < 6) {
    Response::error('Password must be at least 6 characters', 400);
}

try {
    $db = Database::getInstance()->getConnection();
    
    // Check if user already exists
    $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->fetch()) {
        Response::error('User with this email already exists', 409);
    }
    
    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    
    // Generate UUID
    $userId = sprintf(
        '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
    
    // Insert user
    $stmt = $db->prepare("
        INSERT INTO users (id, email, password, name, gameStats, createdAt, updatedAt) 
        VALUES (?, ?, ?, ?, '{}', NOW(), NOW())
    ");
    
    $stmt->execute([$userId, $email, $hashedPassword, $name]);
    
    // Return success response
    Response::success('Registration successful', [
        'user' => [
            'id' => $userId,
            'email' => $email,
            'name' => $name,
            'createdAt' => date('Y-m-d H:i:s')
        ]
    ], 201);
    
} catch (PDOException $e) {
    if (DEBUG_MODE) {
        Response::error('Database error: ' . $e->getMessage(), 500);
    } else {
        Response::error('Registration failed', 500);
    }
}
?>