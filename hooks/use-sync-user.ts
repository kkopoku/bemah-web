import { useEffect } from "react";
import { useCurrentUser } from "./use-user";
import { useUserStore } from "@/stores/user.store";

export function useSyncUser(enabled: boolean) {
  const { data: userData, isLoading, error } = useCurrentUser(enabled);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData, setUser]);

  return { userData, isLoading, error };
}
