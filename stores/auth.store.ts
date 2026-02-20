import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  clientToken: string | null;
  setAccessToken: (accessToken: string) => void;
  setClientToken: (clientToken: string) => void;
  updateAccessToken: (updates: Partial<{ accessToken: string }>) => void;
  clearAccessToken: () => void;
  clearClientToken: () => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      clientToken: null,
      setAccessToken: (accessToken) => set({ accessToken }),
      setClientToken: (clientToken) => set({ clientToken }),
      updateAccessToken: (update) =>
        set((state) => ({
          accessToken: update.accessToken ?? state.accessToken,
        })),
      clearAccessToken: () => {
        set({ accessToken: null });
      },
      clearClientToken: () => {
        set({ clientToken: null });
      },
      clearAuth: () => {
        sessionStorage.removeItem("auth-store");
        set({ accessToken: null, clientToken: null });
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
