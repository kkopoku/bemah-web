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
import { useInitiateOnboarding } from "@/hooks/use-onboarding";
import { useOnboardingStore } from "@/stores/onboarding.store";
import { toast } from "sonner";

export default function BusinessInfoPage() {
  const router = useRouter();
  const { setBusinessId, setAdminEmail, setCurrentStep } = useOnboardingStore();
  const mutation = useInitiateOnboarding();

  const [form, setForm] = useState({
    businessName: "",
    businessContactNumber: "",
    businessEmail: "",
    businessType: "",
    tin: "",
    adminName: "",
    adminPhoneNumber: "",
    adminEmail: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (mutation.isPending) {
      toast.error("Submission in progress. Please wait.");
      return;
    }

    if (
      !form.businessName ||
      !form.businessContactNumber ||
      !form.businessEmail ||
      !form.adminName ||
      !form.adminPhoneNumber ||
      !form.adminEmail
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    mutation.mutate(form, {
      onSuccess: (data) => {
        setBusinessId(data.data?.business?.id);
        setAdminEmail(form.adminEmail);
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
              <Field>
                <FieldLabel htmlFor="businessContactNumber">
                  Contact Number
                </FieldLabel>
                <Input
                  id="businessContactNumber"
                  name="businessContactNumber"
                  value={form.businessContactNumber}
                  onChange={handleChange}
                  placeholder="+233 000 000 000"
                  required
                />
              </Field>
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
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="businessType">
                  Business Type (optional)
                </FieldLabel>
                <Input
                  id="businessType"
                  name="businessType"
                  value={form.businessType}
                  onChange={handleChange}
                  placeholder="e.g. Retail"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="tin">TIN (optional)</FieldLabel>
                <Input
                  id="tin"
                  name="tin"
                  value={form.tin}
                  onChange={handleChange}
                  placeholder="Tax ID"
                />
              </Field>
            </div>
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
              <Field>
                <FieldLabel htmlFor="adminPhoneNumber">
                  Admin Phone Number
                </FieldLabel>
                <Input
                  id="adminPhoneNumber"
                  name="adminPhoneNumber"
                  value={form.adminPhoneNumber}
                  onChange={handleChange}
                  placeholder="+233 000 000 000"
                  required
                />
              </Field>
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
