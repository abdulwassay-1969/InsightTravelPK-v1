// Generic memory-based rate limiter
const store = new Map<string, { count: number; expiresAt: number }>();

export type RateLimitOptions = {
  windowMs?: number;
  maxAttempts?: number;
  errorMessage?: string;
};

/**
 * Basic in-memory rate limiter to prevent spam/brute-force.
 * Note: Reset on server restart. For production scale, use Redis.
 */
export function checkRateLimit(
  identifier: string, 
  keyPrefix: string = 'default',
  options: RateLimitOptions = {}
): { success: boolean; error?: string } {
  const {
    windowMs = 5 * 60 * 1000, // Default 5 minutes
    maxAttempts = 5,
    errorMessage = "Too many requests. Please try again in 5 minutes."
  } = options;

  const now = Date.now();
  const key = `${keyPrefix}:${identifier}`;
  
  let record = store.get(key);
  
  // Cleanup expired record
  if (record && now > record.expiresAt) {
    record = undefined;
  }

  if (!record) {
    store.set(key, { count: 1, expiresAt: now + windowMs });
    return { success: true };
  }

  if (record.count >= maxAttempts) {
    return { success: false, error: errorMessage };
  }

  record.count += 1;
  store.set(key, record);
  return { success: true };
}
