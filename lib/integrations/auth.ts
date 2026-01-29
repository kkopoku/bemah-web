import axios from "axios";
import { apiClient } from "../api-client";

interface VerifyOtpData {
  email: string;
  otp: string;
}

interface RegenerateOtpData {
  email: string;
}

interface SetPasswordData {
  email: string;
  password: string;
}

export async function verifyOtp(data: VerifyOtpData) {
  try {
    const response = await apiClient.post("/auth/verify-otp", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.status !== "success") {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message);
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
}

export async function regenerateOtp(data: RegenerateOtpData) {
  try {
    const response = await apiClient.post("/auth/regenerate-otp", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.status !== "success") {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message);
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
}

export async function setPassword(data: SetPasswordData) {
  try {
    const response = await apiClient.post("/auth/set-password", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.status !== "success") {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message);
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
}
