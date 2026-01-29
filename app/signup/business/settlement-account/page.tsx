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
import { useAddSettlementAccount } from "@/hooks/use-onboarding";
import { useOnboardingStore } from "@/stores/onboarding.store";

export default function SettlementAccountPage() {
  const router = useRouter();
  const { businessId, clearOnboarding } = useOnboardingStore();
  const mutation = useAddSettlementAccount();
  const [form, setForm] = useState({
    accountType: "",
    accountProvider: "",
    accountName: "",
    accountNumber: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!businessId) return;

    mutation.mutate(
      { ...form, businessId },
      {
        onSuccess: () => {
          clearOnboarding();
          router.push("/");
        },
      },
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Settlement Account</CardTitle>
        <CardDescription>
          Add your bank or mobile money account for settlements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel>Account Type</FieldLabel>
              <Select
                value={form.accountType}
                onValueChange={(v) =>
                  setForm((prev) => ({ ...prev, accountType: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bank">Bank</SelectItem>
                  <SelectItem value="Momo">Mobile Money</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="accountProvider">
                Account Provider
              </FieldLabel>
              <Input
                id="accountProvider"
                name="accountProvider"
                value={form.accountProvider}
                onChange={handleChange}
                placeholder="e.g. GCB Bank"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="accountName">Account Name</FieldLabel>
              <Input
                id="accountName"
                name="accountName"
                value={form.accountName}
                onChange={handleChange}
                placeholder="Account holder name"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="accountNumber">Account Number</FieldLabel>
              <Input
                id="accountNumber"
                name="accountNumber"
                value={form.accountNumber}
                onChange={handleChange}
                placeholder="Account number"
                required
              />
            </Field>
            <Button
              type="submit"
              disabled={mutation.isPending || !form.accountType}
            >
              {mutation.isPending ? "Submitting..." : "Complete Setup"}
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
