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

try {
    $db = Database::getInstance()->getConnection();
    
    // Get user with devices
    $stmt = $db->prepare("
        SELECT id, email, name, role, gameStats, createdAt 
        FROM users 
        WHERE id = ?
    ");
    $stmt->execute([$auth['userId']]);
    $user = $stmt->fetch();
    
    if (!$user) {
        Response::error('User not found', 404);
    }
    
    // Get user devices
    $stmt = $db->prepare("
        SELECT id, deviceName, lastUsedAt, createdAt 
        FROM devices 
        WHERE userId = ? 
        ORDER BY lastUsedAt DESC
    ");
    $stmt->execute([$auth['userId']]);
    $devices = $stmt->fetchAll();
    
    // Parse gameStats JSON
    $gameStats = json_decode($user['gameStats'], true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        $gameStats = [];
    }
    
    // Return profile data
    Response::success('Profile loaded', [
        'user' => [
            'id' => $user['id'],
            'email' => $user['email'],
            'name' => $user['name'],
            'role' => $user['role'] ?? 'user',
            'gameStats' => $gameStats,
            'createdAt' => $user['createdAt'],
            'devices' => $devices
        ]
    ]);
    
} catch (PDOException $e) {
    if (DEBUG_MODE) {
        Response::error('Database error: ' . $e->getMessage(), 500);
    } else {
        Response::error('Failed to load profile', 500);
    }
}
?>