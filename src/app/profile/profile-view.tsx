"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { UserRoundIcon } from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

export function ProfileView() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const handleLogout = async () => {
    try {
      const result = await authClient.signOut();
      if (result.error) {
        toast.error(result.error.message || "Could not log out.");
        return;
      }

      toast.success("Logged out successfully.");
      router.push("/");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Please try again.";
      toast.error(`Could not log out: ${message}`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-24 text-foreground">
      <Card className="w-full max-w-lg">
        <CardHeader className="items-center text-center">
          <span className="grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground">
            <UserRoundIcon className="size-6" />
          </span>
          <CardTitle className="text-2xl">My Profile</CardTitle>
          <CardDescription>
            {isPending ? "Loading your account..." : "Your account details."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {user && (
            <>
              <div className="rounded-lg border border-border bg-muted/40 p-4 text-left">
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="text-lg font-semibold">{user.name}</p>
                <p className="mt-4 text-sm text-muted-foreground">Email</p>
                <p className="text-base">{user.email}</p>
              </div>

              <Button
                type="button"
                onClick={handleLogout}
                className="w-full"
              >
                Logout
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
