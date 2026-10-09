import crypto from 'crypto';

export interface AdminCredentials {
  email: string;
  passwordHash: string;
  salt: string;
  isFirstLogin: boolean;
}

const DEFAULT_SALT = process.env.INITIAL_ADMIN_SALT || 'c8b4f210d7a93e81';

/**
 * Hashes a plaintext password using salted SHA-256
 */
export function hashPassword(password: string, salt: string = DEFAULT_SALT): string {
  return crypto
    .createHash('sha256')
    .update(password + salt)
    .digest('hex');
}

/**
 * Securely compares a plaintext candidate password against a stored hash
 */
export function verifyPassword(password: string, storedHash: string, salt: string = DEFAULT_SALT): boolean {
  const candidateHash = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(candidateHash), Buffer.from(storedHash));
}

/**
 * Generates an encrypted HTTP-only session token payload
 */
export function generateAuthToken(email: string, role: string): string {
  const payload = JSON.stringify({
    email,
    role,
    timestamp: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  });

  const secret = process.env.JWT_SECRET || 'companyai_super_admin_secret_key_2026';
  const hmac = crypto.createHmac('sha256', secret).update(payload).digest('hex');

  return Buffer.from(payload).toString('base64') + '.' + hmac;
}

/**
 * Verifies server-side authorization token
 */
export function verifyAuthToken(token: string): { email: string; role: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const payloadStr = Buffer.from(parts[0], 'base64').toString('utf-8');
    const secret = process.env.JWT_SECRET || 'companyai_super_admin_secret_key_2026';
    const expectedHmac = crypto.createHmac('sha256', secret).update(payloadStr).digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(parts[1]), Buffer.from(expectedHmac))) {
      return null;
    }

    const payload = JSON.parse(payloadStr);
    if (payload.expiresAt < Date.now()) return null;

    return { email: payload.email, role: payload.role };
  } catch (err) {
    return null;
  }
}
