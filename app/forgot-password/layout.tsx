"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GalleryVerticalEnd } from "lucide-react";
import { useGenerateToken } from "@/hooks/use-onboarding";
import { useAuthStore } from "@/stores/auth.store";

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setClientToken, clientToken } = useAuthStore();
  const generateToken = useGenerateToken();
  const [isGenerating, setIsGenerating] = useState(!clientToken);

  useEffect(() => {
    if (clientToken) return;

    generateToken.mutate(undefined, {
      onSuccess: (data) => {
        setClientToken(data.data.accessToken);
        setIsGenerating(false);
      },
    });
  }, []);

  if (isGenerating) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-xs flex-col items-center gap-6">
          <Link href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Bemah Inc.
          </Link>
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-xs flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Bemah Inc.
        </Link>
        {children}
      </div>
    </div>
  );
}
