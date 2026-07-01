"use client";

import { apiFetch, type User } from "./api";

export const EMPLOYER_TOKEN_KEY = "employer_token";
export const APPLICANT_TOKEN_KEY = "applicant_token";

export function readToken(key: string) {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(key) || localStorage.getItem(key) || "";
}

export function saveToken(key: string, token: string, persist = true) {
  sessionStorage.setItem(key, token);
  if (persist) localStorage.setItem(key, token);
}

export function clearToken(key: string) {
  sessionStorage.removeItem(key);
  localStorage.removeItem(key);
}

export function clearAuthTokens() {
  clearToken(EMPLOYER_TOKEN_KEY);
  clearToken(APPLICANT_TOKEN_KEY);
}

export function defaultEmployerPath(roles: string[]) {
  if (roles.includes("Platform_Admin")) return "/platform/performance";
  if (
    roles.includes("Hiring_Manager") &&
    !roles.some((role) => ["Company_Admin", "HR", "Recruiter"].includes(role))
  ) {
    return "/hiring_manager/interviews";
  }
  return "/employer/workspace";
}

export async function getCurrentUser(token: string) {
  return apiFetch<User>("/auth/me", { token });
}

export async function requireRole(
  tokenKey: string,
  role: User["role"],
  redirectTo: string,
) {
  const token = readToken(tokenKey);
  if (!token) {
    window.location.href = redirectTo;
    return null;
  }

  try {
    const user = await getCurrentUser(token);
    if (user.role !== role) return null;
    saveToken(tokenKey, token);
    return { token, user };
  } catch {
    clearToken(tokenKey);
    window.location.href = redirectTo;
    return null;
  }
}
