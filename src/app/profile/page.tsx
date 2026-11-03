"use client";

import * as React from "react";
import Link from "next/link";
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
import { clearStoredUser, getStoredUser } from "@/lib/user-session";

export default function ProfilePage() {
  const [user, setUser] = React.useState(() => getStoredUser());

  const refreshUser = () => setUser(getStoredUser());

  React.useEffect(() => {
    const handleStorage = () => refreshUser();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = () => {
    clearStoredUser();
    refreshUser();
    toast.success("Logged out successfully.");
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
            {user ? "Your account details are ready to use." : "Please log in to continue."}
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

              <Button type="button" onClick={handleLogout} className="w-full">
                Logout
              </Button>
            </>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
