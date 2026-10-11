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
  try {
    fs.writeFileSync(filePath, JSON.stringify(state, null, 2), "utf-8");
  } catch {
    const tmpDir = path.join(os.tmpdir(), "plethora-submissions");
    fs.mkdirSync(tmpDir, { recursive: true });
    fs.writeFileSync(
      path.join(tmpDir, "admin-security.json"),
      JSON.stringify(state, null, 2),
      "utf-8"
    );
  }
}

function getFallbackEnvPassword(): string {
  return (process.env.PLETHORA_ADMIN_PASSWORD || "plethora-admin-2026").trim();
}

function getBaseSecret(): string {
  return (
    process.env.PLETHORA_ADMIN_SECRET ||
    "plethora-local-dev-signing-secret-2026-change-in-prod"
  );
}

function getSigningSecret(): string {
  const stored = readStoredSecurity();
  const baseSecret = getBaseSecret();
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
  const trimmedCandidate = (candidate || "").trim();
  if (!trimmedCandidate) return false;

  const stored = readStoredSecurity();

  if (stored.passwordHash && stored.passwordSalt) {
    try {
      const derived = crypto
        .scryptSync(trimmedCandidate, stored.passwordSalt, 64)
        .toString("hex");
      const a = Buffer.from(derived, "hex");
      const b = Buffer.from(stored.passwordHash, "hex");
      if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
        return true;
      }
    } catch {
      // fall through
    }
  }

  // If PLETHORA_ADMIN_PASSWORD is explicitly configured in environment, allow it as recovery/env credential
  if (process.env.PLETHORA_ADMIN_PASSWORD) {
    const envExpected = process.env.PLETHORA_ADMIN_PASSWORD.trim();
    const a = Buffer.from(trimmedCandidate);
    const b = Buffer.from(envExpected);
    if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
      return true;
    }
  }

  // Also check fallback default password when no custom password is set
  if (!stored.passwordHash) {
    const expected = getFallbackEnvPassword();
    const a = Buffer.from(trimmedCandidate);
    const b = Buffer.from(expected);
    if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
      return true;
    }
  }

  return false;
}

export function changeAdminPassword(
  currentPasswordOrNew: string,
  maybeNewPassword?: string
): {
  ok: boolean;
  message: string;
  securityInfo?: AdminSecurityInfo;
} {
  // Support both changeAdminPassword(currentPassword, newPassword) and direct changeAdminPassword(newPassword)
  const hasTwoArgs = typeof maybeNewPassword === "string";
  const currentPassword = hasTwoArgs ? currentPasswordOrNew.trim() : "";
  const newPassword = (hasTwoArgs ? maybeNewPassword : currentPasswordOrNew).trim();

  if (currentPassword && !verifyAdminPassword(currentPassword)) {
    return {
      ok: false,
      message: "The current password you entered does not match.",
    };
  }

  if (newPassword.length < 4) {
    return {
      ok: false,
      message: "New password must be at least 4 characters long.",
    };
  }
  if (newPassword.length > 128) {
    return {
      ok: false,
      message: "New password must not exceed 128 characters.",
    };
  }

  const current = readStoredSecurity();
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(newPassword, salt, 64).toString("hex");

  writeStoredSecurity({
    passwordHash: hash,
    passwordSalt: salt,
    sessionEpoch: current.sessionEpoch || "v1",
    passwordUpdatedAt: new Date().toISOString(),
  });

  return {
    ok: true,
    message:
      "New administrator password saved. Use this new password the next time you sign in.",
    securityInfo: getAdminSecurityInfo(),
  };
}

export function resetAdminPasswordToDefault(): AdminSecurityInfo {
  const current = readStoredSecurity();
  writeStoredSecurity({
    sessionEpoch: current.sessionEpoch || "v1",
  });
  return getAdminSecurityInfo();
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

  const stored = readStoredSecurity();
  const candidateSecrets = [getSigningSecret()];
  if (stored.sessionEpoch === "v1") {
    candidateSecrets.push(getBaseSecret());
  }

  let signatureValid = false;
  for (const secret of candidateSecrets) {
    const expectedSig = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");
    const a = Buffer.from(providedSig);
    const b = Buffer.from(expectedSig);
    if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
      signatureValid = true;
      break;
    }
  }

  if (!signatureValid) {
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
