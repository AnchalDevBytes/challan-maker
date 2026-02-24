import axios from "axios";
import { clearSessionCookie } from "@/lib/session";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthRequest =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/signup") ||
      originalRequest.url?.includes("/auth/verify-otp") ||
      originalRequest.url?.includes("/auth/google") ||
      originalRequest.url?.includes("/auth/refresh");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRequest
    ) {
      originalRequest._retry = true;

      try {
        // The browser automatically sends the httpOnly refreshToken cookie
        // (from the Render domain) along with this request via withCredentials.
        // On success the backend issues new httpOnly accessToken + refreshToken
        // cookies — the browser stores them; no frontend token handling needed.
        await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );
        return api(originalRequest);
      } catch (refreshError) {
        clearSessionCookie();

        if (
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/login")
        ) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
