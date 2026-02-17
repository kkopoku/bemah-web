"use client";

import { useState } from "react";
import { Check, Circle, ChevronDown } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  useUploadVerificationDoc,
  useSetProofOfAddress,
  useAddSettlementAccount,
} from "@/hooks/use-onboarding";
import type { OnboardingStatusResponse } from "@/lib/integrations/business";

interface GetStartedProps {
  status: OnboardingStatusResponse;
  businessId: string;
}

export function GetStarted({ status, businessId }: GetStartedProps) {
  const completedCount = [
    status.verificationDocuments,
    status.proofOfAddress,
    status.settlementAccount,
  ].filter(Boolean).length;

  const firstIncompleteTask = !status.verificationDocuments
    ? "verification"
    : !status.proofOfAddress
      ? "proof-of-address"
      : !status.settlementAccount
        ? "settlement"
        : null;

  const [openTask, setOpenTask] = useState<string | null>(firstIncompleteTask);

  function toggleTask(task: string) {
    setOpenTask((prev) => (prev === task ? null : task));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Get Started</CardTitle>
        <CardDescription>
          Complete these steps to start accepting payments
        </CardDescription>
        <div className="flex items-center gap-3 pt-2">
          <Progress value={(completedCount / 3) * 100} className="flex-1" />
          <span className="text-muted-foreground text-sm font-medium">
            {completedCount} of 3 completed
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <TaskItem
          title="Upload Verification Documents"
          description="Provide your business registration or incorporation documents"
          completed={status.verificationDocuments}
          open={openTask === "verification"}
          onToggle={() => toggleTask("verification")}
        >
          <VerificationDocumentsForm
            businessId={businessId}
            onComplete={() => setOpenTask(firstIncompleteTask)}
          />
        </TaskItem>

        <TaskItem
          title="Proof of Address"
          description="Upload a utility bill or document confirming your business address"
          completed={status.proofOfAddress}
          open={openTask === "proof-of-address"}
          onToggle={() => toggleTask("proof-of-address")}
        >
          <ProofOfAddressForm
            businessId={businessId}
            onComplete={() => setOpenTask(firstIncompleteTask)}
          />
        </TaskItem>

        <TaskItem
          title="Settlement Account"
          description="Add a bank or mobile money account to receive payments"
          completed={status.settlementAccount}
          open={openTask === "settlement"}
          onToggle={() => toggleTask("settlement")}
        >
          <SettlementAccountForm
            businessId={businessId}
            onComplete={() => setOpenTask(firstIncompleteTask)}
          />
        </TaskItem>
      </CardContent>
    </Card>
  );
}

function TaskItem({
  title,
  description,
  completed,
  open,
  onToggle,
  children,
}: {
  title: string;
  description: string;
  completed: boolean;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <Collapsible open={open && !completed} onOpenChange={onToggle}>
      <CollapsibleTrigger
        className="flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors hover:bg-muted/50"
        disabled={completed}
      >
        {completed ? (
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
            <Check className="size-4" />
          </div>
        ) : (
          <div className="flex size-6 shrink-0 items-center justify-center">
            <Circle className="text-muted-foreground size-5" />
          </div>
        )}
        <div className="flex-1">
          <p
            className={`text-sm font-medium ${completed ? "text-muted-foreground line-through" : ""}`}
          >
            {title}
          </p>
          <p className="text-muted-foreground text-xs">{description}</p>
        </div>
        {!completed && (
          <ChevronDown
            className={`text-muted-foreground size-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="border-x border-b rounded-b-lg p-4">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function VerificationDocumentsForm({
  businessId,
  onComplete,
}: {
  businessId: string;
  onComplete: () => void;
}) {
  const queryClient = useQueryClient();
  const mutation = useUploadVerificationDoc();
  const [documentType, setDocumentType] = useState("");
  const [file, setFile] = useState<File | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !documentType) return;

    const formData = new FormData();
    formData.append("businessId", businessId);
    formData.append("documentType", documentType);
    formData.append("document", file);

    mutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Verification document uploaded.");
        queryClient.invalidateQueries({ queryKey: ["onboarding-status"] });
        setDocumentType("");
        setFile(null);
        onComplete();
      },
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="gs-documentType">Document Type</FieldLabel>
          <Input
            id="gs-documentType"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            placeholder="e.g. Business Registration"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="gs-document">Upload Document</FieldLabel>
          <Input
            id="gs-document"
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            required
          />
        </Field>
        <Button
          type="submit"
          size="sm"
          disabled={mutation.isPending || !file || !documentType}
        >
          {mutation.isPending ? "Uploading..." : "Upload"}
        </Button>
        {mutation.isError && (
          <p className="text-destructive text-sm">{mutation.error.message}</p>
        )}
      </FieldGroup>
    </form>
  );
}

function ProofOfAddressForm({
  businessId,
  onComplete,
}: {
  businessId: string;
  onComplete: () => void;
}) {
  const queryClient = useQueryClient();
  const mutation = useSetProofOfAddress();
  const [addressType, setAddressType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [address, setAddress] = useState({
    addressLine: "",
    streetName: "",
    city: "",
    landmark: "",
    country: "",
    postalCode: "",
    region: "",
  });

  function handleAddressChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !addressType) return;

    const formData = new FormData();
    formData.append("businessId", businessId);
    formData.append("addressType", addressType);
    formData.append("document", file);

    for (const [key, value] of Object.entries(address)) {
      if (value) formData.append(key, value);
    }

    mutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Proof of address submitted.");
        queryClient.invalidateQueries({ queryKey: ["onboarding-status"] });
        setAddressType("");
        setFile(null);
        setAddress({
          addressLine: "",
          streetName: "",
          city: "",
          landmark: "",
          country: "",
          postalCode: "",
          region: "",
        });
        onComplete();
      },
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel>Address Type</FieldLabel>
          <Select value={addressType} onValueChange={setAddressType}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UTILITY_BILL">Utility Bill</SelectItem>
              <SelectItem value="OTHERS">Others</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="gs-addressDocument">Upload Document</FieldLabel>
          <Input
            id="gs-addressDocument"
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            required
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="gs-addressLine">
              Address Line (optional)
            </FieldLabel>
            <Input
              id="gs-addressLine"
              name="addressLine"
              value={address.addressLine}
              onChange={handleAddressChange}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="gs-streetName">
              Street Name (optional)
            </FieldLabel>
            <Input
              id="gs-streetName"
              name="streetName"
              value={address.streetName}
              onChange={handleAddressChange}
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="gs-city">City (optional)</FieldLabel>
            <Input
              id="gs-city"
              name="city"
              value={address.city}
              onChange={handleAddressChange}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="gs-country">Country (optional)</FieldLabel>
            <Input
              id="gs-country"
              name="country"
              value={address.country}
              onChange={handleAddressChange}
            />
          </Field>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Field>
            <FieldLabel htmlFor="gs-landmark">Landmark (optional)</FieldLabel>
            <Input
              id="gs-landmark"
              name="landmark"
              value={address.landmark}
              onChange={handleAddressChange}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="gs-postalCode">
              Postal Code (optional)
            </FieldLabel>
            <Input
              id="gs-postalCode"
              name="postalCode"
              value={address.postalCode}
              onChange={handleAddressChange}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="gs-region">Region (optional)</FieldLabel>
            <Input
              id="gs-region"
              name="region"
              value={address.region}
              onChange={handleAddressChange}
            />
          </Field>
        </div>
        <Button
          type="submit"
          size="sm"
          disabled={mutation.isPending || !file || !addressType}
        >
          {mutation.isPending ? "Submitting..." : "Submit"}
        </Button>
        {mutation.isError && (
          <p className="text-destructive text-sm">{mutation.error.message}</p>
        )}
      </FieldGroup>
    </form>
  );
}

function SettlementAccountForm({
  businessId,
  onComplete,
}: {
  businessId: string;
  onComplete: () => void;
}) {
  const queryClient = useQueryClient();
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
    if (!form.accountType) return;

    mutation.mutate(
      { ...form, businessId },
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
          <FieldLabel htmlFor="gs-accountProvider">Account Provider</FieldLabel>
          <Input
            id="gs-accountProvider"
            name="accountProvider"
            value={form.accountProvider}
            onChange={handleChange}
            placeholder="e.g. GCB Bank"
            required
          />
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
          disabled={mutation.isPending || !form.accountType}
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
