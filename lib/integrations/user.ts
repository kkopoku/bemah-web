import axios from "axios";
import { apiClient } from "../api-client";

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  phoneNumber: string;
  status: string;
  businessAdmin?: {
    id: string;
    businessId: string;
    business: {
      id: string;
      name: string;
      email: string;
      contactNumber: string;
      businessType: string;
      status: string;
    };
  } | null;
  subscriber?: {
    id: string;
  } | null;
}

export async function getCurrentUser(): Promise<{
  status: string;
  message: string;
  data: CurrentUser;
}> {
  try {
    const response = await apiClient.get("/auth/me");

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
