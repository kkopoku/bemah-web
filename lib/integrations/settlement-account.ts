import axios from "axios";
import { apiClient } from "../api-client";

interface SettlementProvider {
  name: string;
  code: string;
}

interface GetSettlementProvidersParams {
  country: string;
  accountType: "bank" | "momo";
}

export async function getSettlementProviders(
  params: GetSettlementProvidersParams
): Promise<SettlementProvider[]> {
  try {
    const response = await apiClient.get("/settlement-accounts/providers", {
      params,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.status !== "success") {
      throw new Error(response.data.message);
    }

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message);
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
}

interface AddSettlementAccountData {
  userId: string;
  accountType: "Bank" | "Momo";
  accountProvider: string;
  accountName: string;
  accountNumber: string;
}

export async function addSettlementAccount(data: AddSettlementAccountData) {
  try {
    const response = await apiClient.post("/settlement-accounts/", data, {
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
