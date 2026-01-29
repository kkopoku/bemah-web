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
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSetPassword } from "@/hooks/use-onboarding";
import { useOnboardingStore } from "@/stores/onboarding.store";

export default function SetPasswordPage() {
  const router = useRouter();
  const { adminEmail, setCurrentStep } = useOnboardingStore();
  const mutation = useSetPassword();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationError("");

    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }
    if (!adminEmail) return;

    mutation.mutate(
      { email: adminEmail, password },
      {
        onSuccess: () => {
          setCurrentStep(4);
          router.push("/signup/business/verification-documents");
        },
      },
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Set Your Password</CardTitle>
        <CardDescription>
          Create a secure password for your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Field>
            {validationError && (
              <p className="text-destructive text-sm">{validationError}</p>
            )}
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Setting password..." : "Continue"}
            </Button>
            {mutation.isError && (
              <p className="text-destructive text-sm">
                {mutation.error.message}
              </p>
            )}
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
