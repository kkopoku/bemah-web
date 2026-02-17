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
import { useSetProofOfAddress } from "@/hooks/use-onboarding";

interface ProofOfAddressFormProps {
  businessId: string;
  onComplete: () => void;
}

export function ProofOfAddressForm({
  businessId,
  onComplete,
}: Readonly<ProofOfAddressFormProps>) {
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
