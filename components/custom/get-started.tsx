"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TaskItem } from "@/components/onboarding/task-item";
import { VerificationDocumentsForm } from "@/components/onboarding/verification-documents-form";
import { ProofOfAddressForm } from "@/components/onboarding/proof-of-address-form";
import { SettlementAccountForm } from "@/components/onboarding/settlement-account-form";
import type { OnboardingStatusResponse } from "@/lib/integrations/business";

interface GetStartedProps {
  status: OnboardingStatusResponse;
  businessId: string;
}

export function GetStarted({ status, businessId }: Readonly<GetStartedProps>) {
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
            onComplete={() => setOpenTask(firstIncompleteTask)}
          />
        </TaskItem>
      </CardContent>
    </Card>
  );
}
