import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type {
  User,
  AuthState,
  LoginCredentials,
  SignupCredentials,
  UpdateProfileInput,
} from "../types";
import api from "../services/api";
import {
  clearAuthSession,
  getAuthErrorMessage,
  normalizeAuthSession,
  persistAuthSession,
  restoreAuthSession,
  type AuthSession,
} from "../utils/auth";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<User>;
  signup: (credentials: SignupCredentials) => Promise<User>;
  updateProfile: (profile: UpdateProfileInput) => Promise<User>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

function setAuthState(session: AuthSession): AuthState {
  persistAuthSession(session);

  return {
    user: session.user,
    token: session.token,
    isAuthenticated: true,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = restoreAuthSession();

    if (session) {
      setState(setAuthState(session));
    }

    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post<unknown>("/auth/login", credentials);
      const session = normalizeAuthSession(response.data);

      setState(setAuthState(session));
      return session.user;
    } catch (err: unknown) {
      const message = getAuthErrorMessage(err, "Login failed");
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post<unknown>("/auth/signup", credentials);
      const session = normalizeAuthSession(response.data);

      setState(setAuthState(session));
      return session.user;
    } catch (err: unknown) {
      const message = getAuthErrorMessage(err, "Signup failed");
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profile: UpdateProfileInput) => {
    if (!state.user) {
      throw new Error("No authenticated user found");
    }

    const trimmedName = profile.name.trim();
    if (!trimmedName) {
      throw new Error("Name is required");
    }

    const [firstName, ...rest] = trimmedName.split(/\s+/);
    const lastName = rest.join(" ");

    const payload: Record<string, string> = {
      firstName,
      lastName,
      email: profile.email.trim(),
    };

    const trimmedPassword = profile.password?.trim();
    if (trimmedPassword) {
      payload.passwordHash = trimmedPassword;
    }

    setIsLoading(true);
    setError(null);

    try {
      await api.patch(`/users/${state.user.id}`, payload);

      const updatedUser: User = {
        ...state.user,
        name: trimmedName,
        email: payload.email,
      };

      const nextState: AuthState = {
        ...state,
        user: updatedUser,
      };

      setState(nextState);

      if (nextState.token) {
        persistAuthSession({
          user: updatedUser,
          token: nextState.token,
        });
      }

      return updatedUser;
    } catch (err: unknown) {
      const message = getAuthErrorMessage(err, "Profile update failed");
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuthSession();
    setState(initialState);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        updateProfile,
        logout,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
