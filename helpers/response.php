<?php
// Response Helper Functions
class Response {
    
    /**
     * Send JSON response
     */
    public static function json($data, $statusCode = 200) {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    /**
     * Send success response
     */
    public static function success($message = 'Success', $data = null, $statusCode = 200) {
        $response = [
            'success' => true,
            'message' => $message
        ];
        
        if ($data !== null) {
            $response = array_merge($response, $data);
        }
        
        self::json($response, $statusCode);
    }
    
    /**
     * Send error response
     */
    public static function error($message = 'Error', $statusCode = 400, $data = null) {
        $response = [
            'success' => false,
            'message' => $message
        ];
        
        if ($data !== null) {
            $response = array_merge($response, $data);
        }
        
        self::json($response, $statusCode);
    }
    
    /**
     * Set CORS headers
     */
    public static function setCorsHeaders() {
        // Allow from any origin
        if (isset($_SERVER['HTTP_ORIGIN'])) {
            header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Max-Age: 86400');
        }
        
        // Access-Control headers are received during OPTIONS requests
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
                header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
            }
            
            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
                header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
            }
            
            exit(0);
        }
    }
    
    /**
     * Get request method
     */
    public static function getMethod() {
        return $_SERVER['REQUEST_METHOD'];
    }
    
    /**
     * Get JSON input
     */
    public static function getJsonInput() {
        $input = file_get_contents('php://input');
        return json_decode($input, true);
    }
    
    /**
     * Validate required fields
     */
    public static function validateRequired($data, $fields) {
        foreach ($fields as $field) {
            if (!isset($data[$field]) || empty(trim($data[$field]))) {
                self::error("Field '$field' is required", 400);
            }
        }
        return true;
    }
}
?>