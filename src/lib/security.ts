// ── Central Security Utilities ──
// Provides input sanitization, validation, and data masking functions
// to prevent XSS, injection attacks, and data leaks across the application.

interface SecurityEvent {
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: number;
  data?: Record<string, unknown>;
}

const securityEvents: SecurityEvent[] = [];
const MAX_EVENTS = 100;

export function logSecurityEvent(type: SecurityEvent['type'], message: string, data?: Record<string, unknown>): void {
  const event: SecurityEvent = {
    type,
    message,
    timestamp: Date.now(),
    data,
  };
  securityEvents.push(event);
  if (securityEvents.length > MAX_EVENTS) {
    securityEvents.shift();
  }
  if (typeof window !== 'undefined' && window.console) {
    console.log(`[Security ${type.toUpperCase()}]`, message, data || '');
  }
}

export function getSecurityEvents(): SecurityEvent[] {
  return [...securityEvents];
}

export function clearSecurityEvents(): void {
  securityEvents.length = 0;
}

/**
 * Rate limiting for login attempts
 */
const loginAttempts = new Map<string, { count: number; firstAttempt: number; lockedUntil?: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000;

export function checkRateLimit(identifier: string): { allowed: boolean; remainingAttempts: number; lockedUntil?: number } {
  const now = Date.now();
  const record = loginAttempts.get(identifier);
  
  if (record?.lockedUntil && now < record.lockedUntil) {
    return { allowed: false, remainingAttempts: 0, lockedUntil: record.lockedUntil };
  }
  
  if (record?.lockedUntil && now >= record.lockedUntil) {
    loginAttempts.delete(identifier);
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }
  
  if (!record) {
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }
  
  const attemptsRemaining = MAX_ATTEMPTS - record.count;
  return { allowed: attemptsRemaining > 0, remainingAttempts: Math.max(0, attemptsRemaining) };
}

export function recordFailedAttempt(identifier: string): void {
  const now = Date.now();
  const record = loginAttempts.get(identifier);
  
  if (!record) {
    loginAttempts.set(identifier, { count: 1, firstAttempt: now });
  } else {
    record.count += 1;
    if (record.count >= MAX_ATTEMPTS) {
      record.lockedUntil = now + LOCKOUT_DURATION;
      logSecurityEvent('warning', `Account locked due to multiple failed attempts`, { identifier });
    }
  }
}

export function clearFailedAttempts(identifier: string): void {
  loginAttempts.delete(identifier);
}

/**
 * Sanitize general text input — strips HTML tags, template literals,
 * javascript: URIs, and limits length.
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[{}]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .replace(/data:/gi, '')
    .trim()
    .slice(0, 200);
}

/**
 * Validate email format.
 */
export function sanitizeEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Sanitize phone — keep only digits, +, -, spaces, parentheses.
 */
export function sanitizePhone(phone: string): string {
  return phone.replace(/[^\d+\-\s()]/g, '').slice(0, 20);
}

/**
 * Sanitize ZIP code — keep only digits, dashes, spaces.
 */
export function sanitizeZip(zip: string): string {
  return zip.replace(/[^\d-\s]/g, '').slice(0, 10);
}

/**
 * Mask card number — show only last 4 digits, replace rest with bullets.
 */
export function maskCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (cleaned.length <= 4) return cleaned;
  return '•'.repeat(cleaned.length - 4) + cleaned.slice(-4);
}

/**
 * Sanitize card number input — digits only, max 19 (standard card length).
 */
export function sanitizeCardInput(cardNumber: string): string {
  return cardNumber.replace(/\D/g, '').slice(0, 19);
}

/**
 * Sanitize expiry input — keep digits and forward slash, max 5 chars (MM/YY).
 */
export function sanitizeExpiry(expiry: string): string {
  return expiry.replace(/[^\d/]/g, '').slice(0, 5);
}

/**
 * Sanitize CVV input — digits only, max 4 chars.
 */
export function sanitizeCVV(cvv: string): string {
  return cvv.replace(/\D/g, '').slice(0, 4);
}

/**
 * Sanitize URL input — allow http/https URLs only, strip scripts.
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';
  const cleaned = url.trim().replace(/<[^>]*>/g, '').slice(0, 500);
  if (cleaned && !cleaned.match(/^https?:\/\/.+/i)) return '';
  return cleaned;
}

/**
 * Validate required text fields — non-empty after trimming.
 */
export function validateRequired(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Validate credit card number via Luhn algorithm (basic check).
 */
export function validateCardNumber(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (cleaned.length < 13 || cleaned.length > 19) return false;
  
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

/**
 * Validate expiry date — MM/YY format, not expired.
 */
export function validateExpiry(expiry: string): boolean {
  if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
  const [monthStr, yearStr] = expiry.split('/');
  const month = parseInt(monthStr, 10);
  const year = parseInt('20' + yearStr, 10);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const expiryDate = new Date(year, month);
  return expiryDate > now;
}

/**
 * Validate CVV — 3 or 4 digits.
 */
export function validateCVV(cvv: string): boolean {
  return /^\d{3,4}$/.test(cvv);
}
