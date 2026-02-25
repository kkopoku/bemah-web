"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAddSettlementAccount,
  useGetSettlementProviders,
} from "@/hooks/use-onboarding";

interface SettlementAccountFormProps {
  onComplete: () => void;
}

export function SettlementAccountForm({
  onComplete,
}: Readonly<SettlementAccountFormProps>) {
  const queryClient = useQueryClient();
  const mutation = useAddSettlementAccount();

  const [form, setForm] = useState<{
    accountType: "Bank" | "Momo" | "";
    accountProvider: string;
    accountName: string;
    accountNumber: string;
  }>({
    accountType: "",
    accountProvider: "",
    accountName: "",
    accountNumber: "",
  });

  const accountTypeKey = form.accountType
    ? (form.accountType.toLowerCase() as "bank" | "momo")
    : null;
  const providersQuery = useGetSettlementProviders(accountTypeKey, "gh");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleAccountTypeChange(value: "Bank" | "Momo") {
    setForm((prev) => ({ ...prev, accountType: value, accountProvider: "" }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.accountType) return;

    mutation.mutate(
      { ...form, accountType: form.accountType },
      {
        onSuccess: () => {
          toast.success("Settlement account added.");
          queryClient.invalidateQueries({ queryKey: ["onboarding-status"] });
          setForm({
            accountType: "",
            accountProvider: "",
            accountName: "",
            accountNumber: "",
          });
          onComplete();
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel>Account Type</FieldLabel>
          <Select
            value={form.accountType}
            onValueChange={(v) => handleAccountTypeChange(v as "Bank" | "Momo")}
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
          <FieldLabel>Account Provider</FieldLabel>
          <Select
            value={form.accountProvider}
            onValueChange={(v) =>
              setForm((prev) => ({ ...prev, accountProvider: v }))
            }
            disabled={!form.accountType || providersQuery.isLoading}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  form.accountType
                    ? "Select provider"
                    : "Select account type first"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {providersQuery.data?.map((provider) => (
                <SelectItem key={provider.code} value={provider.code}>
                  {provider.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="gs-accountName">Account Name</FieldLabel>
          <Input
            id="gs-accountName"
            name="accountName"
            value={form.accountName}
            onChange={handleChange}
            placeholder="Account holder name"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="gs-accountNumber">Account Number</FieldLabel>
          <Input
            id="gs-accountNumber"
            name="accountNumber"
            value={form.accountNumber}
            onChange={handleChange}
            placeholder="Account number"
            required
          />
        </Field>
        <Button
          type="submit"
          size="sm"
          disabled={
            mutation.isPending || !form.accountType || !form.accountProvider
          }
        >
          {mutation.isPending ? "Submitting..." : "Add Account"}
        </Button>
        {mutation.isError && (
          <p className="text-destructive text-sm">{mutation.error.message}</p>
        )}
      </FieldGroup>
    </form>
  );
}
