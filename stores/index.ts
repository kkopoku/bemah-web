import { useAuthStore } from "./auth.store";
import { useOnboardingStore } from "./onboarding.store";

export const clearStores = () => {
  useAuthStore.getState().clearAccessToken();
  useOnboardingStore.getState().clearOnboarding();
};
