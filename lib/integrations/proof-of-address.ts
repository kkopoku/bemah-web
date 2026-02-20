import axios from "axios";
import { apiClient } from "../api-client";

export async function setProofOfAddress(data: FormData) {
  try {
    const response = await apiClient.post("/proof-of-address/", data, {
      headers: {
        "Content-Type": "multipart/form-data",
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
