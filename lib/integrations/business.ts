import axios from "axios";
import { apiClient } from "../api-client";

export interface InitiateBusinessOnboardingData {
  businessName: string;
  businessContactNumber: string;
  businessEmail: string;
  businessType?: string;
  tin?: string;
  adminName: string;
  adminPhoneNumber: string;
  adminEmail: string;
}

export async function initiateBusinessOnboarding(
  data: InitiateBusinessOnboardingData,
) {
  try {
    const response = await apiClient.post(
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
