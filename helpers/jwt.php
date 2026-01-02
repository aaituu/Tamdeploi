<?php
// Simple JWT Implementation for PHP
class JWT {
    
    /**
     * Generate a JWT token
     */
    public static function encode($payload, $secret, $expiration = 3600) {
        $header = [
            'typ' => 'JWT',
            'alg' => JWT_ALGORITHM
        ];
        
        // Add expiration to payload
        $payload['iat'] = time();
        $payload['exp'] = time() + $expiration;
        
        // Encode header
        $headerEncoded = self::base64UrlEncode(json_encode($header));
        
        // Encode payload
        $payloadEncoded = self::base64UrlEncode(json_encode($payload));
        
        // Create signature
        $signature = hash_hmac('sha256', $headerEncoded . "." . $payloadEncoded, $secret, true);
        $signatureEncoded = self::base64UrlEncode($signature);
        
        // Create JWT
        return $headerEncoded . "." . $payloadEncoded . "." . $signatureEncoded;
    }
    
    /**
     * Decode and verify a JWT token
     */
    public static function decode($jwt, $secret) {
        // Split token
        $parts = explode('.', $jwt);
        
        if (count($parts) !== 3) {
            throw new Exception('Invalid token format');
        }
        
        list($headerEncoded, $payloadEncoded, $signatureEncoded) = $parts;
        
        // Verify signature
        $signature = self::base64UrlDecode($signatureEncoded);
        $expectedSignature = hash_hmac('sha256', $headerEncoded . "." . $payloadEncoded, $secret, true);
        
        if (!hash_equals($signature, $expectedSignature)) {
            throw new Exception('Invalid signature');
        }
        
        // Decode payload
        $payload = json_decode(self::base64UrlDecode($payloadEncoded), true);
        
        if (!$payload) {
            throw new Exception('Invalid payload');
        }
        
        // Check expiration
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            throw new Exception('Token expired');
        }
        
        return $payload;
    }
    
    /**
     * Base64 URL encode
     */
    private static function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
    
    /**
     * Base64 URL decode
     */
    private static function base64UrlDecode($data) {
        return base64_decode(strtr($data, '-_', '+/'));
    }
}
?>