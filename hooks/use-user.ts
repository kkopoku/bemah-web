import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/integrations/user";

export function useCurrentUser(enabled: boolean = true) {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const response = await getCurrentUser();
      return response.data;
    },
    enabled,
  });
}
