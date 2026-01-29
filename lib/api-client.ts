import { backendUrl } from "@/constants/env";
import { clearStores } from "@/stores";
import { useAuthStore } from "@/stores/auth.store";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: `${backendUrl}/api/v1/app`,
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (process.env.NODE_ENV === "development") {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  function onFulfilled(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async function onRejected(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const status = error.response?.status;
    const isLoginPage =
      typeof window !== "undefined" && window.location.pathname === "/";

    // Log errors in development
    if (process.env.NODE_ENV === "development") {
      console.error(`[API Error] ${status || "Network Error"}:`, {
        url: error.config?.url,
        method: error.config?.method,
        message: error.message,
        data: error.response?.data,
      });
    }

    // Check for 401 (Unauthorized) and ensure we're not on the login page
    if (status === 401 && !isLoginPage) {
      console.error("Token invalid or expired (401). Forcing sign-out.");

      // 1. Clear local application state (Zustand stores)
      clearStores();

      // 2. Clear the server session/cookies
      //   await SignOut();

      // 3. Redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }

      // Reject the promise so the calling function can still handle the error
      return Promise.reject(error);
    }
    return Promise.reject(error);
  },
);
