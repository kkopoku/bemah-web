import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface OnboardingState {
  businessId: string | null;
  adminEmail: string | null;
  currentStep: number;
  setBusinessId: (id: string) => void;
  setAdminEmail: (email: string) => void;
  setCurrentStep: (step: number) => void;
  clearOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      businessId: null,
      adminEmail: null,
      currentStep: 1,
      setBusinessId: (id) => set({ businessId: id }),
      setAdminEmail: (email) => set({ adminEmail: email }),
      setCurrentStep: (step) => set({ currentStep: step }),
      clearOnboarding: () => {
        sessionStorage.removeItem("onboarding-store");
        set({ businessId: null, adminEmail: null, currentStep: 1 });
      },
    }),
    {
      name: "onboarding-store",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
