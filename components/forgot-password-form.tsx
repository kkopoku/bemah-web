"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/password-input";
import { toast } from "sonner";
import {
  useForgotPasswordInitiate,
  useForgotPasswordVerify,
} from "@/hooks/use-auth";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const initiateMutation = useForgotPasswordInitiate();
  const verifyMutation = useForgotPasswordVerify();

  function handleInitiate(e: React.FormEvent) {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    initiateMutation.mutate(
      { email },
      {
        onSuccess: () => {
          toast.success("A reset code has been sent to your email.");
          setStep("reset");
        },
      },
    );
  }

  function handleVerify(e: React.FormEvent) {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit code.");
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    verifyMutation.mutate(
      { email, otp, newPassword },
      {
        onSuccess: () => {
          toast.success("Password reset successfully. Please log in.");
          router.push("/");
        },
      },
    );
  }

  if (step === "email") {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <form onSubmit={handleInitiate}>
          <FieldGroup>
            <div className="flex flex-col items-center gap-1 text-center">
              <h1 className="text-2xl font-bold">Forgot your password?</h1>
              <p className="text-muted-foreground text-sm text-balance">
                Enter your email and we&apos;ll send you a code to reset your
                password
              </p>
            </div>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field>
              <Button type="submit" disabled={initiateMutation.isPending}>
                {initiateMutation.isPending
                  ? "Sending..."
                  : "Send Reset Code"}
              </Button>
            </Field>
            {initiateMutation.isError && (
              <p className="text-destructive text-center text-sm">
                {initiateMutation.error.message}
              </p>
            )}
            <Field>
              <FieldDescription className="text-center">
                Remember your password?{" "}
                <Link href="/" className="underline underline-offset-4">
                  Back to login
                </Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleVerify}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Reset your password</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Enter the 6-digit code sent to{" "}
              <span className="font-medium">{email}</span> and your new
              password
            </p>
          </div>
          <Field>
            <FieldLabel htmlFor="otp">Reset Code</FieldLabel>
            <Input
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="000000"
              maxLength={6}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
            <PasswordInput
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 8 characters"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="confirmPassword">
              Confirm New Password
            </FieldLabel>
            <PasswordInput
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              required
            />
          </Field>
          <Field>
            <Button type="submit" disabled={verifyMutation.isPending}>
              {verifyMutation.isPending ? "Resetting..." : "Reset Password"}
            </Button>
          </Field>
          {verifyMutation.isError && (
            <p className="text-destructive text-center text-sm">
              {verifyMutation.error.message}
            </p>
          )}
          <p className="text-muted-foreground text-center text-sm">
            Didn&apos;t receive a code?{" "}
            <button
              type="button"
              className="text-primary underline underline-offset-4 hover:opacity-80 disabled:opacity-50"
              disabled={initiateMutation.isPending}
              onClick={() => {
                initiateMutation.mutate(
                  { email },
                  {
                    onSuccess: () => {
                      toast.success("A new code has been sent to your email.");
                    },
                    onError: (error) => {
                      toast.error(error.message);
                    },
                  },
                );
              }}
            >
              {initiateMutation.isPending ? "Resending..." : "Resend Code"}
            </button>
          </p>
          <Field>
            <FieldDescription className="text-center">
              Remember your password?{" "}
              <Link href="/" className="underline underline-offset-4">
                Back to login
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
