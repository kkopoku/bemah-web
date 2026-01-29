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
import { useUploadVerificationDoc } from "@/hooks/use-onboarding";
import { useOnboardingStore } from "@/stores/onboarding.store";

export default function VerificationDocumentsPage() {
  const router = useRouter();
  const { businessId, setCurrentStep } = useOnboardingStore();
  const mutation = useUploadVerificationDoc();
  const [documentType, setDocumentType] = useState("");
  const [file, setFile] = useState<File | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!businessId || !file) return;

    const formData = new FormData();
    formData.append("businessId", businessId);
    formData.append("documentType", documentType);
    formData.append("document", file);

    mutation.mutate(formData, {
      onSuccess: () => {
        setCurrentStep(5);
        router.push("/signup/business/proof-of-address");
      },
    });
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Verification Documents</CardTitle>
        <CardDescription>
          Upload your business verification document
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="documentType">Document Type</FieldLabel>
              <Input
                id="documentType"
                name="documentType"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                placeholder="e.g. Business Registration"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="document">Upload Document</FieldLabel>
              <Input
                id="document"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                required
              />
            </Field>
            <Button type="submit" disabled={mutation.isPending || !file}>
              {mutation.isPending ? "Uploading..." : "Continue"}
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
