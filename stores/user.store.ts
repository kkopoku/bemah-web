import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface Business {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  businessType: string;
  status: string;
}

export interface BusinessAdmin {
  id: string;
  businessId: string;
  business: Business;
}

export interface Subscriber {
  id: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber: string;
  status: string;
  businessAdmin?: BusinessAdmin | null;
  subscriber?: Subscriber | null;
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  clearUser: () => void;
  isAuthenticated: () => boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      clearUser: () => {
        sessionStorage.removeItem("user-store");
        set({ user: null });
      },
      isAuthenticated: () => {
        return get().user !== null;
      },
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
