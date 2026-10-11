import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

export const ADMIN_COOKIE_NAME = "plethora_admin_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 12; // 12 hours

interface StoredAdminSecurity {
  passwordHash?: string;
  passwordSalt?: string;
  sessionEpoch: string;
  passwordUpdatedAt?: string;
}

export interface AdminSecurityInfo {
  usingDefaultPassword: boolean;
  passwordSource: "custom_stored" | "env_variable" | "local_default";
  passwordUpdatedAt: string | null;
  sessionDurationHours: number;
}

function getSecurityFilePath(): string {
  const baseDir = process.env.PLETHORA_STORAGE_DIR
    ? process.env.PLETHORA_STORAGE_DIR
    : path.join(process.cwd(), "data");
  try {
    fs.mkdirSync(baseDir, { recursive: true });
    fs.accessSync(baseDir, fs.constants.W_OK);
    return path.join(baseDir, "admin-security.json");
  } catch {
    const tmpDir = path.join(os.tmpdir(), "plethora-submissions");
    fs.mkdirSync(tmpDir, { recursive: true });
    return path.join(tmpDir, "admin-security.json");
  }
}

function readStoredSecurity(): StoredAdminSecurity {
  const filePath = getSecurityFilePath();
  if (!fs.existsSync(filePath)) {
    return { sessionEpoch: "v1" };
  }
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw) as Partial<StoredAdminSecurity>;
    return {
      passwordHash: parsed.passwordHash,
      passwordSalt: parsed.passwordSalt,
      sessionEpoch: parsed.sessionEpoch || "v1",
      passwordUpdatedAt: parsed.passwordUpdatedAt,
    };
  } catch {
    return { sessionEpoch: "v1" };
  }
}

function writeStoredSecurity(state: StoredAdminSecurity): void {
  const filePath = getSecurityFilePath();
  fs.writeFileSync(filePath, JSON.stringify(state, null, 2), "utf-8");
}

function getFallbackEnvPassword(): string {
  return process.env.PLETHORA_ADMIN_PASSWORD || "plethora-admin-2026";
}

function getSigningSecret(): string {
  const stored = readStoredSecurity();
  const baseSecret =
    process.env.PLETHORA_ADMIN_SECRET ||
    "plethora-local-dev-signing-secret-2026-change-in-prod";
  return `${baseSecret}:${stored.sessionEpoch}`;
}

export function isUsingDefaultAdminPassword(): boolean {
  const stored = readStoredSecurity();
  if (stored.passwordHash && stored.passwordSalt) {
    return false;
  }
  return !process.env.PLETHORA_ADMIN_PASSWORD;
}

export function getAdminSecurityInfo(): AdminSecurityInfo {
  const stored = readStoredSecurity();
  if (stored.passwordHash && stored.passwordSalt) {
    return {
      usingDefaultPassword: false,
      passwordSource: "custom_stored",
      passwordUpdatedAt: stored.passwordUpdatedAt || null,
      sessionDurationHours: 12,
    };
  }
  if (process.env.PLETHORA_ADMIN_PASSWORD) {
    return {
      usingDefaultPassword: false,
      passwordSource: "env_variable",
      passwordUpdatedAt: null,
      sessionDurationHours: 12,
    };
  }
  return {
    usingDefaultPassword: true,
    passwordSource: "local_default",
    passwordUpdatedAt: null,
    sessionDurationHours: 12,
  };
}

export function verifyAdminPassword(candidate: string): boolean {
  if (!candidate) return false;
  const stored = readStoredSecurity();

  if (stored.passwordHash && stored.passwordSalt) {
    try {
      const derived = crypto
        .scryptSync(candidate, stored.passwordSalt, 64)
        .toString("hex");
      const a = Buffer.from(derived, "hex");
      const b = Buffer.from(stored.passwordHash, "hex");
      if (a.length !== b.length) return false;
      return crypto.timingSafeEqual(a, b);
    } catch {
      return false;
    }
  }

  const expected = getFallbackEnvPassword();
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function changeAdminPassword(
  currentPassword: string,
  newPassword: string
): {
  ok: boolean;
  message: string;
  securityInfo?: AdminSecurityInfo;
} {
  if (!verifyAdminPassword(currentPassword)) {
    return {
      ok: false,
      message: "Your current administrator password is incorrect.",
    };
  }

  const trimmed = newPassword.trim();
  if (trimmed.length < 8) {
    return {
      ok: false,
      message: "New password must be at least 8 characters long.",
    };
  }
  if (trimmed.length > 128) {
    return {
      ok: false,
      message: "New password must not exceed 128 characters.",
    };
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(trimmed, salt, 64).toString("hex");
  const nextEpoch = crypto.randomBytes(8).toString("hex");

  writeStoredSecurity({
    passwordHash: hash,
    passwordSalt: salt,
    sessionEpoch: nextEpoch,
    passwordUpdatedAt: new Date().toISOString(),
  });

  return {
    ok: true,
    message:
      "Administrator password updated. All other active sessions have been invalidated.",
    securityInfo: getAdminSecurityInfo(),
  };
}

export function revokeAllAdminSessions(): AdminSecurityInfo {
  const current = readStoredSecurity();
  writeStoredSecurity({
    ...current,
    sessionEpoch: crypto.randomBytes(8).toString("hex"),
  });
  return getAdminSecurityInfo();
}

export function createAdminSessionToken(): string {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const payload = `admin:${expiresAt}`;
  const sig = crypto
    .createHmac("sha256", getSigningSecret())
    .update(payload)
    .digest("hex");
  return `${payload}.${sig}`;
}

export function verifyAdminSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const dotIdx = token.lastIndexOf(".");
  if (dotIdx === -1) return false;

  const payload = token.slice(0, dotIdx);
  const providedSig = token.slice(dotIdx + 1);

  const expectedSig = crypto
    .createHmac("sha256", getSigningSecret())
    .update(payload)
    .digest("hex");

  const a = Buffer.from(providedSig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return false;
  }

  const parts = payload.split(":");
  if (parts.length !== 2 || parts[0] !== "admin") return false;
  const expiresAt = Number(parts[1]);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
    return false;
  }

  return true;
}

export async function isAuthenticatedAdmin(): Promise<boolean> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminSessionToken(token);
}
