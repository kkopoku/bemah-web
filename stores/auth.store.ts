import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  setAccessToken: (accessToken: string) => void;
  updateAccessToken: (updates: Partial<{ accessToken: string }>) => void;
  clearAccessToken: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (accessToken) => set({ accessToken }),
      updateAccessToken: (update) =>
        set((state) => ({
          accessToken: update.accessToken ?? state.accessToken,
        })),
      clearAccessToken: () => {
        sessionStorage.removeItem("auth-store");
        set({ accessToken: null });
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
