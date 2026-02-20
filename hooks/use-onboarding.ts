import { useMutation, useQuery } from "@tanstack/react-query";
import {
  initiateBusinessOnboarding,
  verifyBusinessOnboarding,
  resendBusinessOnboardingOtp,
  getOnboardingStatus,
} from "@/lib/integrations/business";
import { generateClientToken } from "@/lib/integrations/auth";
import { uploadVerificationDocument } from "@/lib/integrations/business-verification-document";
import { setProofOfAddress } from "@/lib/integrations/proof-of-address";
import { addSettlementAccount } from "@/lib/integrations/settlement-account";

export function useGenerateToken() {
  return useMutation({
    mutationFn: generateClientToken,
  });
}

export function useInitiateOnboarding() {
  return useMutation({
    mutationFn: initiateBusinessOnboarding,
  });
}

export function useVerifyBusinessOnboarding() {
  return useMutation({
    mutationFn: verifyBusinessOnboarding,
  });
}

export function useResendBusinessOnboardingOtp() {
  return useMutation({
    mutationFn: resendBusinessOnboardingOtp,
  });
}

export function useUploadVerificationDoc() {
  return useMutation({
    mutationFn: uploadVerificationDocument,
  });
}

export function useSetProofOfAddress() {
  return useMutation({
    mutationFn: setProofOfAddress,
  });
}

export function useAddSettlementAccount() {
  return useMutation({
    mutationFn: addSettlementAccount,
  });
}

export function useOnboardingStatus(enabled: boolean = true) {
  return useQuery({
    queryKey: ["onboarding-status"],
    queryFn: async () => {
      const response = await getOnboardingStatus();
      return response.data;
    },
    enabled,
  });
}
