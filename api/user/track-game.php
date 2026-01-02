<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth.php';

// Set CORS headers
Response::setCorsHeaders();

// Only allow POST requests
if (Response::getMethod() !== 'POST') {
    Response::error('Method not allowed', 405);
}

// Authenticate user
$auth = AuthMiddleware::authenticate();

// Get JSON input
$data = Response::getJsonInput();

// Validate required fields
Response::validateRequired($data, ['gameName']);

$gameName = trim($data['gameName']);

try {
    $db = Database::getInstance()->getConnection();
    
    // Get current gameStats
    $stmt = $db->prepare("SELECT gameStats FROM users WHERE id = ?");
    $stmt->execute([$auth['userId']]);
    $user = $stmt->fetch();
    
    if (!$user) {
        Response::error('User not found', 404);
    }
    
    // Parse current stats
    $stats = json_decode($user['gameStats'], true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        $stats = [];
    }
    
    // Increment game count
    if (!isset($stats[$gameName])) {
        $stats[$gameName] = 0;
    }
    $stats[$gameName]++;
    
    // Update database
    $stmt = $db->prepare("UPDATE users SET gameStats = ? WHERE id = ?");
    $stmt->execute([json_encode($stats), $auth['userId']]);
    
    Response::success('Game visit tracked');
    
} catch (PDOException $e) {
    if (DEBUG_MODE) {
        Response::error('Database error: ' . $e->getMessage(), 500);
    } else {
        Response::error('Failed to track game visit', 500);
    }
}
?>