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
import { useSetProofOfAddress } from "@/hooks/use-onboarding";
import { useOnboardingStore } from "@/stores/onboarding.store";

export default function ProofOfAddressPage() {
  const router = useRouter();
  const { businessId, setCurrentStep } = useOnboardingStore();
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
    if (!businessId || !file || !addressType) return;

    const formData = new FormData();
    formData.append("businessId", businessId);
    formData.append("addressType", addressType);
    formData.append("document", file);

    for (const [key, value] of Object.entries(address)) {
      if (value) formData.append(key, value);
    }

    mutation.mutate(formData, {
      onSuccess: () => {
        setCurrentStep(6);
        router.push("/signup/business/settlement-account");
      },
    });
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Proof of Address</CardTitle>
        <CardDescription>
          Upload a document to verify your business address
        </CardDescription>
      </CardHeader>
      <CardContent>
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
              <FieldLabel htmlFor="addressDocument">Upload Document</FieldLabel>
              <Input
                id="addressDocument"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                required
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="addressLine">
                  Address Line (optional)
                </FieldLabel>
                <Input
                  id="addressLine"
                  name="addressLine"
                  value={address.addressLine}
                  onChange={handleAddressChange}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="streetName">
                  Street Name (optional)
                </FieldLabel>
                <Input
                  id="streetName"
                  name="streetName"
                  value={address.streetName}
                  onChange={handleAddressChange}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="city">City (optional)</FieldLabel>
                <Input
                  id="city"
                  name="city"
                  value={address.city}
                  onChange={handleAddressChange}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="landmark">Landmark (optional)</FieldLabel>
                <Input
                  id="landmark"
                  name="landmark"
                  value={address.landmark}
                  onChange={handleAddressChange}
                />
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Field>
                <FieldLabel htmlFor="country">Country (optional)</FieldLabel>
                <Input
                  id="country"
                  name="country"
                  value={address.country}
                  onChange={handleAddressChange}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="postalCode">
                  Postal Code (optional)
                </FieldLabel>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={address.postalCode}
                  onChange={handleAddressChange}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="region">Region (optional)</FieldLabel>
                <Input
                  id="region"
                  name="region"
                  value={address.region}
                  onChange={handleAddressChange}
                />
              </Field>
            </div>
            <Button
              type="submit"
              disabled={mutation.isPending || !file || !addressType}
            >
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
