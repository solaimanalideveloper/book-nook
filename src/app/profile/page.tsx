"use client";

import * as React from "react";
import Link from "next/link";
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

export default function ProfilePage() {
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
            {isPending
              ? "Loading your account..."
              : user
                ? "Your account details."
                : "Please log in to continue."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {user ? (
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
          ) : !isPending ? (
            <>
              <Button
                nativeButton={false}
                render={<Link href="/login" />}
                className="w-full"
              >
                Go to Login
              </Button>
              <Button
                nativeButton={false}
                render={<Link href="/register" />}
                variant="outline"
                className="w-full"
              >
                Create an Account
              </Button>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
