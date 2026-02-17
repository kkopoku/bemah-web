import axios from "axios";
import { clientApiClient } from "../api-client";

export interface InitiateSubscriberOnboardingData {
  firstName: string;
  lastName: string;
  otherNames?: string;
  email: string;
  password: string;
  gender: string;
  dateOfBirth: string;
  phoneNumber: string;
  secondaryPhone?: string;
  secondaryEmail?: string;
}

export interface VerifySubscriberOnboardingData {
  email: string;
  otp: string;
}

export interface ResendSubscriberOnboardingOtpData {
  email: string;
}

export async function initiateSubscriberOnboarding(
  data: InitiateSubscriberOnboardingData,
) {
  try {
    const response = await clientApiClient.post(
      "/subscriber/onboarding/initiate",
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

export async function verifySubscriberOnboarding(
  data: VerifySubscriberOnboardingData,
) {
  try {
    const response = await clientApiClient.post(
      "/subscriber/onboarding/verify",
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

export async function resendSubscriberOnboardingOtp(
  data: ResendSubscriberOnboardingOtpData,
) {
  try {
    const response = await clientApiClient.post(
      "/subscriber/onboarding/resend-otp",
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
