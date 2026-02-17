import { useAuthStore } from "./auth.store";
import { useOnboardingStore } from "./onboarding.store";
import { useUserStore } from "./user.store";

export const clearStores = () => {
  useAuthStore.getState().clearAuth();
  useOnboardingStore.getState().clearOnboarding();
  useUserStore.getState().clearUser();
};
