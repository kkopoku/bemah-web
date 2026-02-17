"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useUploadVerificationDoc } from "@/hooks/use-onboarding";

interface VerificationDocumentsFormProps {
  businessId: string;
  onComplete: () => void;
}

export function VerificationDocumentsForm({
  businessId,
  onComplete,
}: Readonly<VerificationDocumentsFormProps>) {
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
