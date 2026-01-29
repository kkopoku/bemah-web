import { useMutation } from "@tanstack/react-query";
import { initiateBusinessOnboarding } from "@/lib/integrations/business";
import { verifyOtp, regenerateOtp, setPassword } from "@/lib/integrations/auth";
import { uploadVerificationDocument } from "@/lib/integrations/business-verification-document";
import { setProofOfAddress } from "@/lib/integrations/proof-of-address";
import { addSettlementAccount } from "@/lib/integrations/settlement-account";

export function useInitiateOnboarding() {
  return useMutation({
    mutationFn: initiateBusinessOnboarding,
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: verifyOtp,
  });
}

export function useRegenerateOtp() {
  return useMutation({
    mutationFn: regenerateOtp,
  });
}

export function useSetPassword() {
  return useMutation({
    mutationFn: setPassword,
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
