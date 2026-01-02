<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/jwt.php';
require_once __DIR__ . '/../helpers/response.php';

class AuthMiddleware {
    
    /**
     * Authenticate request and return user data
     */
    public static function authenticate() {
        // Get token from Authorization header or cookie
        $token = self::getToken();
        
        if (!$token) {
            Response::error('Token not provided', 401);
        }
        
        try {
            // Decode and verify token
            $payload = JWT::decode($token, JWT_SECRET);
            
            // Verify user exists
            $db = Database::getInstance()->getConnection();
            $stmt = $db->prepare("SELECT id, email, name, role FROM users WHERE id = ?");
            $stmt->execute([$payload['userId']]);
            $user = $stmt->fetch();
            
            if (!$user) {
                Response::error('User not found', 404);
            }
            
            // Add user and device info to payload
            $payload['user'] = $user;
            
            return $payload;
            
        } catch (Exception $e) {
            if (strpos($e->getMessage(), 'expired') !== false) {
                Response::error('Token expired', 401);
            } else {
                Response::error('Invalid token', 401);
            }
        }
    }
    
    /**
     * Get token from request
     */
    private static function getToken() {
        $token = null;
        
        // Check Authorization header
        $headers = getallheaders();
        if (isset($headers['Authorization'])) {
            $matches = [];
            if (preg_match('/Bearer\s+(.*)$/i', $headers['Authorization'], $matches)) {
                $token = $matches[1];
            }
        }
        
        // Check cookie as fallback
        if (!$token && isset($_COOKIE['token'])) {
            $token = $_COOKIE['token'];
        }
        
        return $token;
    }
    
    /**
     * Generate device fingerprint
     */
    public static function generateDeviceFingerprint() {
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
        $ip = self::getClientIp();
        
        return hash('sha256', $userAgent . '-' . $ip);
    }
    
    /**
     * Get client IP address
     */
    public static function getClientIp() {
        $ip = '';
        
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else {
            $ip = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
        }
        
        return $ip;
    }
    
    /**
     * Parse user agent
     */
    public static function parseUserAgent() {
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
        
        // Simple browser detection
        $browser = 'Unknown Browser';
        if (strpos($userAgent, 'Firefox') !== false) {
            $browser = 'Firefox';
        } elseif (strpos($userAgent, 'Chrome') !== false) {
            $browser = 'Chrome';
        } elseif (strpos($userAgent, 'Safari') !== false) {
            $browser = 'Safari';
        } elseif (strpos($userAgent, 'Edge') !== false) {
            $browser = 'Edge';
        }
        
        // Simple OS detection
        $os = 'Unknown OS';
        if (strpos($userAgent, 'Windows') !== false) {
            $os = 'Windows';
        } elseif (strpos($userAgent, 'Mac') !== false) {
            $os = 'macOS';
        } elseif (strpos($userAgent, 'Linux') !== false) {
            $os = 'Linux';
        } elseif (strpos($userAgent, 'Android') !== false) {
            $os = 'Android';
        } elseif (strpos($userAgent, 'iOS') !== false) {
            $os = 'iOS';
        }
        
        return "$browser on $os";
    }
}
?>