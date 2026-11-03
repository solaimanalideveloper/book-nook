"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const isRegister = mode === "register";
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [socialProvider, setSocialProvider] = React.useState<
    "google" | "github" | null
  >(null);
  const title = isRegister ? "Create an account" : "Login to BookNook";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    if (isRegister && !name) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = isRegister
        ? await authClient.signUp.email({
            name,
            email,
            password,
            callbackURL: "/profile",
          })
        : await authClient.signIn.email({
            email,
            password,
            callbackURL: "/profile",
          });

      if (result.error) {
        toast.error(result.error.message || "Authentication failed.");
        return;
      }

      toast.success(isRegister ? "Account created." : "Logged in successfully.");
      router.push("/profile");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Please try again.";
      toast.error(`Could not ${isRegister ? "register" : "log in"}: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSocialSignIn(provider: "google" | "github") {
    setSocialProvider(provider);

    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: "/profile",
      });

      if (result.error) {
        toast.error(result.error.message || `${provider} sign-in failed.`);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Please try again.";
      toast.error(`Could not sign in with ${provider}: ${message}`);
    } finally {
      setSocialProvider(null);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>
          {isRegister
            ? "Register to share and borrow books."
            : "Enter your email and password to continue."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isRegister && (
            <div className="grid gap-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" autoComplete="name" required />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              minLength={8}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting || socialProvider !== null}>
            {isSubmitting
              ? "Please wait..."
              : isRegister
                ? "Create account"
                : "Login"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {isRegister ? "Already registered?" : "New to BookNook?"}{" "}
            <Link
              className="font-medium text-primary underline-offset-4 hover:underline"
              href={isRegister ? "/login" : "/register"}
            >
              {isRegister ? "Login" : "Create an account"}
            </Link>
          </p>
        </form>

        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">or continue with</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="flex flex-col gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-10 w-full gap-3 bg-muted/50"
            disabled={isSubmitting || socialProvider !== null}
            onClick={() => handleSocialSignIn("google")}
          >
            <Image src="/image/google.png" alt="" width={18} height={18} />
            {socialProvider === "google"
              ? "Connecting..."
              : "Continue with Google"}
          </Button>
          <Button
            type="button"
            className="h-10 w-full gap-3 bg-[#24292f] text-white hover:bg-[#24292f]/90"
            disabled={isSubmitting || socialProvider !== null}
            onClick={() => handleSocialSignIn("github")}
          >
            <Image
              src="/image/github.png"
              alt=""
              width={18}
              height={18}
              className="brightness-0 invert"
            />
            {socialProvider === "github"
              ? "Connecting..."
              : "Continue with GitHub"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
