"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  useVerifyBusinessOnboarding,
  useResendBusinessOnboardingOtp,
} from "@/hooks/use-onboarding";
import { useOnboardingStore } from "@/stores/onboarding.store";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";

export default function VerifyOtpPage() {
  const router = useRouter();
  const { email, clearOnboarding } = useOnboardingStore();
  const { clearAccessToken } = useAuthStore();
  const mutation = useVerifyBusinessOnboarding();
  const resendMutation = useResendBusinessOnboardingOtp();
  const [otp, setOtp] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email) return;

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP code.");
      return;
    }

    mutation.mutate(
      { email, otp },
      {
        onSuccess: () => {
          clearOnboarding();
          clearAccessToken();
          toast.success("Account created! Please log in.");
          router.push("/");
        },
      },
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Verify Your Email</CardTitle>
        <CardDescription>
          Enter the 6-digit code sent to{" "}
          <span className="font-medium">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="otp">OTP Code</FieldLabel>
              <Input
                id="otp"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
                maxLength={6}
                required
              />
            </Field>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Verifying..." : "Verify"}
            </Button>
            {mutation.isError && (
              <p className="text-destructive text-sm">
                {mutation.error.message}
              </p>
            )}
            <p className="text-muted-foreground text-center text-sm">
              Didn&apos;t receive a code?{" "}
              <button
                type="button"
                className="text-primary underline underline-offset-4 hover:opacity-80 disabled:opacity-50"
                disabled={resendMutation.isPending}
                onClick={() => {
                  if (!email) return;
                  resendMutation.mutate(
                    { email },
                    {
                      onSuccess: () => {
                        toast.success(
                          "A new OTP has been sent to your email.",
                        );
                      },
                      onError: (error) => {
                        toast.error(error.message);
                      },
                    },
                  );
                }}
              >
                {resendMutation.isPending ? "Resending..." : "Resend OTP"}
              </button>
            </p>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
