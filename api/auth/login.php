<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/jwt.php';
require_once __DIR__ . '/../../middleware/auth.php';

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

try {
    $db = Database::getInstance()->getConnection();
    
    // Find user by email
    $stmt = $db->prepare("
        SELECT id, email, name, password, createdAt 
        FROM users 
        WHERE email = ?
    ");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if (!$user) {
        Response::error('Invalid email or password', 401);
    }
    
    // Verify password
    if (!password_verify($password, $user['password'])) {
        Response::error('Invalid email or password', 401);
    }
    
    // Generate device fingerprint
    $deviceFingerprint = AuthMiddleware::generateDeviceFingerprint();
    
    // Check if device exists
    $stmt = $db->prepare("SELECT id, deviceName FROM devices WHERE fingerprint = ?");
    $stmt->execute([$deviceFingerprint]);
    $device = $stmt->fetch();
    
    if (!$device) {
        // Check device limit
        $stmt = $db->prepare("SELECT COUNT(*) as count FROM devices WHERE userId = ?");
        $stmt->execute([$user['id']]);
        $deviceCount = $stmt->fetch()['count'];
        
        if ($deviceCount >= MAX_DEVICES_PER_USER) {
            // Get user's devices
            $stmt = $db->prepare("
                SELECT id, deviceName, lastUsedAt 
                FROM devices 
                WHERE userId = ? 
                ORDER BY lastUsedAt DESC
            ");
            $stmt->execute([$user['id']]);
            $devices = $stmt->fetchAll();
            
            $deviceList = array_map(function($d) {
                return [
                    'id' => $d['id'],
                    'name' => $d['deviceName'],
                    'lastUsed' => $d['lastUsedAt']
                ];
            }, $devices);
            
            Response::error(
                'Device limit exceeded (maximum ' . MAX_DEVICES_PER_USER . '). Please remove an old device to login from a new one.',
                403,
                ['devices' => $deviceList]
            );
        }
        
        // Create new device
        $deviceId = sprintf(
            '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
        
        $deviceName = AuthMiddleware::parseUserAgent();
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
        
        $stmt = $db->prepare("
            INSERT INTO devices (id, userId, deviceName, userAgent, fingerprint, lastUsedAt, createdAt) 
            VALUES (?, ?, ?, ?, ?, NOW(), NOW())
        ");
        $stmt->execute([$deviceId, $user['id'], $deviceName, $userAgent, $deviceFingerprint]);
        
        $device = [
            'id' => $deviceId,
            'deviceName' => $deviceName
        ];
    } else {
        // Update last used time
        $stmt = $db->prepare("UPDATE devices SET lastUsedAt = NOW() WHERE id = ?");
        $stmt->execute([$device['id']]);
        
        $deviceId = $device['id'];
        $device = [
            'id' => $device['id'],
            'deviceName' => $device['deviceName']
        ];
    }
    
    // Generate JWT token
    $payload = [
        'userId' => $user['id'],
        'email' => $user['email'],
        'deviceId' => $deviceId
    ];
    
    $token = JWT::encode($payload, JWT_SECRET, JWT_EXPIRATION);
    
    // Set cookie
    setcookie('token', $token, [
        'expires' => time() + JWT_EXPIRATION,
        'path' => '/',
        'domain' => '',
        'secure' => isset($_SERVER['HTTPS']),
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
    
    // Return success response
    Response::success('Login successful', [
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'email' => $user['email'],
            'name' => $user['name']
        ],
        'device' => $device
    ]);
    
} catch (PDOException $e) {
    if (DEBUG_MODE) {
        Response::error('Database error: ' . $e->getMessage(), 500);
    } else {
        Response::error('Login failed', 500);
    }
}
?>