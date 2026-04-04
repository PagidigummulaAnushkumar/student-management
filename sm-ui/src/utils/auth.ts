import axios from "axios";
import { ROUTES } from "./constants";
import type { Role, User } from "../types";

export interface AuthSession {
  user: User;
  token: string;
  refreshToken?: string;
}

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";

const DASHBOARD_ROUTES: Record<Role, string> = {
  admin: ROUTES.DASHBOARD.ADMIN,
  teacher: ROUTES.DASHBOARD.TEACHER,
  student: ROUTES.DASHBOARD.STUDENT,
  parent: ROUTES.DASHBOARD.PARENT,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isRole(value: unknown): value is Role {
  return (
    value === "admin" ||
    value === "teacher" ||
    value === "student" ||
    value === "parent"
  );
}

function isUser(value: unknown): value is User {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.email === "string" &&
    isRole(value.role) &&
    (value.avatar === undefined || typeof value.avatar === "string")
  );
}

function extractToken(value: Record<string, unknown>): string | null {
  const tokenValue =
    typeof value.token === "string"
      ? value.token
      : typeof value.accessToken === "string"
        ? value.accessToken
        : null;

  return tokenValue && tokenValue.trim() ? tokenValue : null;
}

function extractSession(value: unknown): AuthSession | null {
  if (!isRecord(value)) {
    return null;
  }

  if (isRecord(value.data)) {
    const nestedSession = extractSession(value.data);
    if (nestedSession) {
      return nestedSession;
    }
  }

  const token = extractToken(value);
  if (token && isUser(value.user)) {
    return {
      user: value.user,
      token,
      refreshToken:
        typeof value.refreshToken === "string"
          ? value.refreshToken
          : undefined,
    };
  }

  return null;
}

export function normalizeAuthSession(response: unknown): AuthSession {
  const session = extractSession(response);

  if (!session) {
    throw new Error("The server returned an unexpected auth response.");
  }

  return session;
}

export function getDashboardRoute(role: Role): string {
  return DASHBOARD_ROUTES[role];
}

export function persistAuthSession(session: AuthSession) {
  localStorage.setItem(AUTH_TOKEN_KEY, session.token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(session.user));
}

export function restoreAuthSession(): AuthSession | null {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const userValue = localStorage.getItem(AUTH_USER_KEY);

  if (!token || !userValue) {
    return null;
  }

  try {
    const parsedUser: unknown = JSON.parse(userValue);

    if (!isUser(parsedUser)) {
      clearAuthSession();
      return null;
    }

    return {
      user: parsedUser,
      token,
    };
  } catch {
    clearAuthSession();
    return null;
  }
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function getAuthErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const responseData: unknown = error.response?.data;

    if (typeof responseData === "string" && responseData.trim()) {
      return responseData;
    }

    if (isRecord(responseData)) {
      const message = responseData.message;
      const errorMessage = responseData.error;
      const detail = responseData.detail;

      if (typeof message === "string" && message.trim()) {
        return message;
      }

      if (typeof errorMessage === "string" && errorMessage.trim()) {
        return errorMessage;
      }

      if (typeof detail === "string" && detail.trim()) {
        return detail;
      }
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

export function isAuthEndpoint(url?: string): boolean {
  if (!url) {
    return false;
  }

  return (
    url.includes("/auth/login") ||
    url.includes("/auth/signup") ||
    url.includes("/auth/refresh")
  );
}