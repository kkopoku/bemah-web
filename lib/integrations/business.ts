import axios from "axios";
import { apiClient, clientApiClient } from "../api-client";

export interface InitiateBusinessOnboardingData {
  businessName: string;
  businessContactNumber: string;
  businessEmail: string;
  businessType: string;
  adminName: string;
  adminPhoneNumber: string;
  adminEmail: string;
  adminPassword: string;
}

export interface VerifyBusinessOnboardingData {
  email: string;
  otp: string;
}

export interface ResendBusinessOnboardingOtpData {
  email: string;
}

export interface OnboardingStatusResponse {
  verificationDocuments: boolean;
  proofOfAddress: boolean;
  settlementAccount: boolean;
}

export async function initiateBusinessOnboarding(
  data: InitiateBusinessOnboardingData,
) {
  try {
    const response = await clientApiClient.post(
      "/business/onboarding/initiate",
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

export async function verifyBusinessOnboarding(
  data: VerifyBusinessOnboardingData,
) {
  try {
    const response = await clientApiClient.post(
      "/business/onboarding/verify",
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

export async function resendBusinessOnboardingOtp(
  data: ResendBusinessOnboardingOtpData,
) {
  try {
    const response = await clientApiClient.post(
      "/business/onboarding/resend-otp",
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

export async function getOnboardingStatus(): Promise<{
  status: string;
  message: string;
  data: OnboardingStatusResponse;
}> {
  try {
    const response = await apiClient.get("/business/onboarding/status");

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
