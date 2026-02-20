"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, User } from "lucide-react";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="text-center">
        <h1 className="text-xl font-semibold">Create your account</h1>
        <p className="text-muted-foreground text-sm">
          Choose an account type to get started
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card
          className="cursor-pointer transition-shadow hover:shadow-md"
          onClick={() => router.push("/signup/subscriber")}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
                <User className="text-primary size-5" />
              </div>
              <div>
                <CardTitle>Subscriber</CardTitle>
                <CardDescription>
                  Personal account for individuals
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Create a personal account to subscribe to services
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer transition-shadow hover:shadow-md"
          onClick={() => router.push("/signup/business")}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
                <Building2 className="text-primary size-5" />
              </div>
              <div>
                <CardTitle>Business</CardTitle>
                <CardDescription>
                  Merchant account for businesses
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Set up your business to start accepting payments
            </p>
          </CardContent>
        </Card>
      </div>
      <p className="text-muted-foreground px-6 text-center text-xs">
        By continuing, you agree to our{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
