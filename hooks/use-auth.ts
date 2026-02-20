import { useMutation } from "@tanstack/react-query";
import {
  forgotPasswordInitiate,
  forgotPasswordVerify,
} from "@/lib/integrations/auth";

export function useForgotPasswordInitiate() {
  return useMutation({
    mutationFn: forgotPasswordInitiate,
  });
}

export function useForgotPasswordVerify() {
  return useMutation({
    mutationFn: forgotPasswordVerify,
  });
}
