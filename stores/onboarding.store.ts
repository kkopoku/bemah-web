import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface OnboardingState {
  email: string | null;
  currentStep: 1 | 2;
  setEmail: (email: string) => void;
  setCurrentStep: (step: 1 | 2) => void;
  clearOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      email: null,
      currentStep: 1,
      setEmail: (email) => set({ email }),
      setCurrentStep: (step) => set({ currentStep: step }),
      clearOnboarding: () => {
        sessionStorage.removeItem("onboarding-store");
        set({ email: null, currentStep: 1 });
      },
    }),
    {
      name: "onboarding-store",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
