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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInitiateSubscriberOnboarding } from "@/hooks/use-subscriber";
import { useOnboardingStore } from "@/stores/onboarding.store";
import { toast } from "sonner";
import PhoneNumberInput from "@/components/phone-number-input";

export default function SubscriberInfoPage() {
  const router = useRouter();
  const { setEmail, setCurrentStep } = useOnboardingStore();
  const mutation = useInitiateSubscriberOnboarding();

  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
  const [secondaryPhone, setSecondaryPhone] = useState<string | undefined>();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    otherNames: "",
    email: "",
    password: "",
    passwordConfirm: "",
    gender: "",
    dateOfBirth: "",
    secondaryEmail: "",
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
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.password ||
      !form.gender ||
      !form.dateOfBirth ||
      !phoneNumber
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (form.password.length < 8) {
      setValidationError("Password must be at least 8 characters long.");
      return;
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;
    if (!passwordPattern.test(form.password)) {
      setValidationError(
        "Password must contain uppercase, lowercase, number and special character.",
      );
      return;
    }

    if (form.password !== form.passwordConfirm) {
      setValidationError("Passwords do not match.");
      return;
    }

    const { passwordConfirm, ...formData } = form;

    const submitData = {
      ...formData,
      phoneNumber: phoneNumber!,
      ...(secondaryPhone ? { secondaryPhone } : {}),
    };

    // Remove empty optional fields
    const cleanedData = Object.fromEntries(
      Object.entries(submitData).filter(([, v]) => v !== ""),
    ) as typeof submitData;

    mutation.mutate(cleanedData, {
      onSuccess: () => {
        setEmail(form.email);
        setCurrentStep(2);
        router.push("/signup/subscriber/verify-otp");
      },
    });
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Personal Information</CardTitle>
        <CardDescription>
          Tell us about yourself to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                <Input
                  id="firstName"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                <Input
                  id="lastName"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="otherNames">
                Other Names (optional)
              </FieldLabel>
              <Input
                id="otherNames"
                name="otherNames"
                value={form.otherNames}
                onChange={handleChange}
                placeholder="Middle name(s)"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="gender">Gender</FieldLabel>
                <Select
                  value={form.gender}
                  onValueChange={(v) =>
                    setForm((prev) => ({ ...prev, gender: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="dateOfBirth">Date of Birth</FieldLabel>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <PhoneNumberInput
                setPhone={setPhoneNumber}
                phone={phoneNumber}
                dialog={false}
                label="Phone Number"
              />
              <PhoneNumberInput
                setPhone={setSecondaryPhone}
                phone={secondaryPhone}
                dialog={false}
                label="Secondary Phone (optional)"
              />
            </div>
            <Field>
              <FieldLabel htmlFor="secondaryEmail">
                Secondary Email (optional)
              </FieldLabel>
              <Input
                id="secondaryEmail"
                name="secondaryEmail"
                type="email"
                value={form.secondaryEmail}
                onChange={handleChange}
                placeholder="alt@example.com"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="passwordConfirm">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type="password"
                  value={form.passwordConfirm}
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
