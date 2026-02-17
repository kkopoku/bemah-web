import axios from "axios";
import { apiClient, clientApiClient } from "../api-client";
import { clientId, clientSecret } from "@/constants/env";

interface GenerateTokenResponse {
  status: string;
  message: string;
  data: {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
  };
}

export async function generateClientToken(): Promise<GenerateTokenResponse> {
  try {
    const response = await apiClient.post(
      "/auth/token",
      {
        clientId,
        clientSecret,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

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

export interface ForgotPasswordInitiateData {
  email: string;
}

export async function forgotPasswordInitiate(
  data: ForgotPasswordInitiateData,
) {
  try {
    const response = await clientApiClient.post(
      "/auth/forgot-password/initiate",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

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

export interface ForgotPasswordVerifyData {
  email: string;
  otp: string;
  newPassword: string;
}

export async function forgotPasswordVerify(data: ForgotPasswordVerifyData) {
  try {
    const response = await clientApiClient.post(
      "/auth/forgot-password/verify",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

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
