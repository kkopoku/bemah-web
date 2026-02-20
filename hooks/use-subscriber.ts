import { useMutation } from "@tanstack/react-query";
import {
  initiateSubscriberOnboarding,
  verifySubscriberOnboarding,
  resendSubscriberOnboardingOtp,
} from "@/lib/integrations/subscriber";

export function useInitiateSubscriberOnboarding() {
  return useMutation({
    mutationFn: initiateSubscriberOnboarding,
  });
}

export function useVerifySubscriberOnboarding() {
  return useMutation({
    mutationFn: verifySubscriberOnboarding,
  });
}

export function useResendSubscriberOnboardingOtp() {
  return useMutation({
    mutationFn: resendSubscriberOnboardingOtp,
  });
}
