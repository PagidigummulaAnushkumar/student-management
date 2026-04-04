import axios, {
  type AxiosInstance,
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { API_BASE_URL } from "../utils/constants";
import type { ApiError } from "../types";
import { clearAuthSession, isAuthEndpoint } from "../utils/auth";
import { ROUTES } from "../utils/constants";

class ApiService {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (
          typeof FormData !== "undefined" &&
          config.data instanceof FormData
        ) {
          config.headers["Content-Type"] = undefined;
        }

        const token = localStorage.getItem("auth_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (
          error.response?.status === 401 &&
          !isAuthEndpoint(error.config?.url)
        ) {
          clearAuthSession();
          window.location.href = ROUTES.LOGIN;
        }
        return Promise.reject(error);
      },
    );
  }

  get<T>(url: string, params?: Record<string, unknown>) {
    return this.instance.get<T>(url, { params });
  }

  post<T>(url: string, data?: unknown) {
    return this.instance.post<T>(url, data);
  }

  put<T>(url: string, data?: unknown) {
    return this.instance.put<T>(url, data);
  }

  patch<T>(url: string, data?: unknown) {
    return this.instance.patch<T>(url, data);
  }

  delete<T>(url: string) {
    return this.instance.delete<T>(url);
  }

  getInstance() {
    return this.instance;
  }
}

export const api = new ApiService();
export default api;
