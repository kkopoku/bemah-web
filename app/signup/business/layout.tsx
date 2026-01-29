"use client";

import { usePathname } from "next/navigation";
import { GalleryVerticalEnd } from "lucide-react";

const steps = [
  { label: "Business Info", path: "/signup/business" },
  { label: "Verify OTP", path: "/signup/business/verify-otp" },
  { label: "Set Password", path: "/signup/business/set-password" },
  { label: "Documents", path: "/signup/business/verification-documents" },
  { label: "Address", path: "/signup/business/proof-of-address" },
  { label: "Settlement", path: "/signup/business/settlement-account" },
];

export default function BusinessOnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentStepIndex = steps.findIndex((s) => s.path === pathname);

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-lg flex-col gap-6">
        <a
          href="#"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Bemah Inc.
        </a>

        <div className="flex items-center justify-center gap-2">
          {steps.map((step, i) => (
            <div key={step.path} className="flex items-center gap-2">
              <div
                className={`flex size-8 items-center justify-center rounded-full text-xs font-medium ${
                  i < currentStepIndex
                    ? "bg-primary text-primary-foreground"
                    : i === currentStepIndex
                      ? "bg-primary text-primary-foreground ring-primary/30 ring-2 ring-offset-2"
                      : "bg-muted-foreground/20 text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`h-0.5 w-4 ${
                    i < currentStepIndex
                      ? "bg-primary"
                      : "bg-muted-foreground/20"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {children}
      </div>
    </div>
  );
}
