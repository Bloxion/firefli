import prisma from "./database";

const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;
const FAILED_ATTEMPT_WINDOW_MS = 30 * 60 * 1000;

interface LoginAttempt {
  count: number;
  firstAttempt: number;
  lockedUntil: number | null;
}

const loginAttempts = new Map<string, LoginAttempt>();
setInterval(() => {
  const now = Date.now();
  for (const [key, attempt] of loginAttempts.entries()) {
    if (
      (attempt.lockedUntil && now > attempt.lockedUntil && now - attempt.firstAttempt > FAILED_ATTEMPT_WINDOW_MS) ||
      (!attempt.lockedUntil && now - attempt.firstAttempt > FAILED_ATTEMPT_WINDOW_MS)
    ) {
      loginAttempts.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function isAccountLocked(userId: string | number): { locked: boolean; remainingMs: number } {
  const key = String(userId);
  const attempt = loginAttempts.get(key);
  
  if (!attempt || !attempt.lockedUntil) {
    return { locked: false, remainingMs: 0 };
  }

  const now = Date.now();
  if (now < attempt.lockedUntil) {
    return { locked: true, remainingMs: attempt.lockedUntil - now };
  }

  loginAttempts.delete(key);
  return { locked: false, remainingMs: 0 };
}

export function recordFailedAttempt(userId: string | number): { 
  locked: boolean; 
  attemptsRemaining: number; 
  lockoutDurationMs: number;
} {
  const key = String(userId);
  const now = Date.now();
  let attempt = loginAttempts.get(key);

  if (!attempt || now - attempt.firstAttempt > FAILED_ATTEMPT_WINDOW_MS) {
    attempt = { count: 1, firstAttempt: now, lockedUntil: null };
    loginAttempts.set(key, attempt);
    return { locked: false, attemptsRemaining: LOCKOUT_THRESHOLD - 1, lockoutDurationMs: 0 };
  }

  attempt.count++;

  if (attempt.count >= LOCKOUT_THRESHOLD) {
    attempt.lockedUntil = now + LOCKOUT_DURATION_MS;
    loginAttempts.set(key, attempt);
    
    console.warn(`[System] Account ${key} locked after ${attempt.count} failed attempts`);
    
    return { 
      locked: true, 
      attemptsRemaining: 0, 
      lockoutDurationMs: LOCKOUT_DURATION_MS 
    };
  }

  loginAttempts.set(key, attempt);
  return { 
    locked: false, 
    attemptsRemaining: LOCKOUT_THRESHOLD - attempt.count, 
    lockoutDurationMs: 0 
  };
}

export function clearLoginAttempts(userId: string | number): void {
  loginAttempts.delete(String(userId));
}

export function getFailedAttemptCount(userId: string | number): number {
  const attempt = loginAttempts.get(String(userId));
  if (!attempt) return 0;
  if (Date.now() - attempt.firstAttempt > FAILED_ATTEMPT_WINDOW_MS) {
    loginAttempts.delete(String(userId));
    return 0;
  }
  return attempt.count;
}
