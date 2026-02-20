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
import { PasswordInput } from "@/components/password-input";
import { useInitiateOnboarding } from "@/hooks/use-onboarding";
import { useOnboardingStore } from "@/stores/onboarding.store";
import { toast } from "sonner";
import PhoneNumberInput from "@/components/phone-number-input";

export default function BusinessInfoPage() {
  const router = useRouter();
  const { setEmail, setCurrentStep } = useOnboardingStore();
  const mutation = useInitiateOnboarding();

  const [businessContactNumber, setBusinessContactNumber] = useState<
    string | undefined
  >();
  const [adminPhoneNumber, setAdminPhoneNumber] = useState<
    string | undefined
  >();

  const [form, setForm] = useState({
    businessName: "",
    businessEmail: "",
    businessType: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
    adminPasswordConfirm: "",
  });

  const [validationError, setValidationError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setValidationError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (mutation.isPending) {
      toast.error("Submission in progress. Please wait.");
      return;
    }

    if (
      !form.businessName ||
      !businessContactNumber ||
      !form.businessEmail ||
      !form.businessType ||
      !form.adminName ||
      !adminPhoneNumber ||
      !form.adminEmail ||
      !form.adminPassword
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (form.adminPassword.length < 8) {
      setValidationError("Password must be at least 8 characters long.");
      return;
    }

    if (form.adminPassword !== form.adminPasswordConfirm) {
      setValidationError("Passwords do not match.");
      return;
    }

    const { adminPasswordConfirm, ...formData } = form;

    const submitData = {
      ...formData,
      businessContactNumber: businessContactNumber!,
      adminPhoneNumber: adminPhoneNumber!,
    };

    mutation.mutate(submitData, {
      onSuccess: () => {
        setEmail(form.adminEmail);
        setCurrentStep(2);
        router.push("/signup/business/verify-otp");
      },
    });
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Business Information</CardTitle>
        <CardDescription>
          Tell us about your business to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="businessName">Business Name</FieldLabel>
              <Input
                id="businessName"
                name="businessName"
                value={form.businessName}
                onChange={handleChange}
                placeholder="Acme Ltd."
                required
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <PhoneNumberInput
                setPhone={setBusinessContactNumber}
                phone={businessContactNumber}
                dialog={false}
                label="Contact Number"
              />
              <Field>
                <FieldLabel htmlFor="businessEmail">Business Email</FieldLabel>
                <Input
                  id="businessEmail"
                  name="businessEmail"
                  type="email"
                  value={form.businessEmail}
                  onChange={handleChange}
                  placeholder="info@acme.com"
                  required
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="businessType">Business Type</FieldLabel>
              <Input
                id="businessType"
                name="businessType"
                value={form.businessType}
                onChange={handleChange}
                placeholder="e.g. Retail"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="adminName">Admin Name</FieldLabel>
              <Input
                id="adminName"
                name="adminName"
                value={form.adminName}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <PhoneNumberInput
                setPhone={setAdminPhoneNumber}
                phone={adminPhoneNumber}
                dialog={false}
                label="Admin Phone Number"
              />
              <Field>
                <FieldLabel htmlFor="adminEmail">Admin Email</FieldLabel>
                <Input
                  id="adminEmail"
                  name="adminEmail"
                  type="email"
                  value={form.adminEmail}
                  onChange={handleChange}
                  placeholder="john@acme.com"
                  required
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="adminPassword">Password</FieldLabel>
                <PasswordInput
                  id="adminPassword"
                  name="adminPassword"
                  value={form.adminPassword}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="adminPasswordConfirm">
                  Confirm Password
                </FieldLabel>
                <PasswordInput
                  id="adminPasswordConfirm"
                  name="adminPasswordConfirm"
                  value={form.adminPasswordConfirm}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  required
                />
              </Field>
            </div>
            {validationError && (
              <p className="text-destructive text-sm">{validationError}</p>
            )}
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Submitting..." : "Continue"}
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
