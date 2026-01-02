
<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth.php';

// Set CORS headers
Response::setCorsHeaders();

// Authenticate user
$auth = AuthMiddleware::authenticate();

$method = Response::getMethod();

try {
    $db = Database::getInstance()->getConnection();
    
    if ($method === 'GET') {
        // Get all user devices
        $stmt = $db->prepare("
            SELECT id, deviceName, lastUsedAt, createdAt 
            FROM devices 
            WHERE userId = ? 
            ORDER BY lastUsedAt DESC
        ");
        $stmt->execute([$auth['userId']]);
        $devices = $stmt->fetchAll();
        
        Response::success('Devices loaded', [
            'devices' => $devices
        ]);
        
    } elseif ($method === 'DELETE') {
        // Delete specific device or all except current
        
        // Parse request URI to get device ID
        $requestUri = $_SERVER['REQUEST_URI'];
        $parts = explode('/', trim($requestUri, '/'));
        
        // Check if it's delete all except current
        if (end($parts) === 'except-current') {
            $stmt = $db->prepare("
                DELETE FROM devices 
                WHERE userId = ? AND id != ?
            ");
            $stmt->execute([$auth['userId'], $auth['deviceId']]);
            
            Response::success('All devices deleted except current');
        } else {
            // Get device ID from URL
            $deviceId = end($parts);
            
            // Check if device belongs to user
            $stmt = $db->prepare("
                SELECT id FROM devices 
                WHERE id = ? AND userId = ?
            ");
            $stmt->execute([$deviceId, $auth['userId']]);
            $device = $stmt->fetch();
            
            if (!$device) {
                Response::error('Device not found', 404);
            }
            
            // Prevent deleting current device
            if ($device['id'] === $auth['deviceId']) {
                Response::error('Cannot delete current device. Please logout first.', 403);
            }
            
            // Delete device
            $stmt = $db->prepare("DELETE FROM devices WHERE id = ?");
            $stmt->execute([$deviceId]);
            
            Response::success('Device deleted');
        }
    } else {
        Response::error('Method not allowed', 405);
    }
    
} catch (PDOException $e) {
    if (DEBUG_MODE) {
        Response::error('Database error: ' . $e->getMessage(), 500);
    } else {
        Response::error('Device operation failed', 500);
    }
}
?>