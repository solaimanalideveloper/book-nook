"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { EyeIcon, EyeOffIcon } from "lucide-react";
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

function getPasswordError(password: string): string {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password)) {
    return "Password must include at least one uppercase letter.";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must include at least one lowercase letter.";
  }
  return "";
}

function getSafeReturnPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return "/";
  }
  return value;
}

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const isRegister = mode === "register";
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnPath = getSafeReturnPath(searchParams.get("callbackURL"));
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState("");
  const [socialProvider, setSocialProvider] = React.useState<
    "google" | "github" | null
  >(null);
  const title = isRegister ? "Create an account" : "Login to BookNook";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const image = String(form.get("image") ?? "").trim();
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

    if (isRegister) {
      const error = getPasswordError(password);
      setPasswordError(error);
      if (error) return;
    }

    setIsSubmitting(true);

    try {
      const result = isRegister
        ? await authClient.signUp.email({
            name,
            email,
            password,
            image: image || undefined,
          })
        : await authClient.signIn.email({
            email,
            password,
            callbackURL: returnPath,
          });

      if (result.error) {
        toast.error(result.error.message || "Authentication failed.");
        return;
      }

      if (isRegister) {
        toast.success("Account created. Please log in.");
        router.replace(`/login?callbackURL=${encodeURIComponent(returnPath)}`);
      } else {
        toast.success("Logged in successfully.");
        router.replace(returnPath);
      }
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
        callbackURL: returnPath,
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
              <Label htmlFor="name">Name</Label>
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
          {isRegister && (
            <div className="grid gap-2">
              <Label htmlFor="image">Photo URL</Label>
              <Input
                id="image"
                name="image"
                type="url"
                autoComplete="url"
                placeholder="https://example.com/photo.jpg"
              />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={isPasswordVisible ? "text" : "password"}
                autoComplete={isRegister ? "new-password" : "current-password"}
                className="pr-10"
                required
                aria-invalid={Boolean(passwordError)}
                aria-describedby={passwordError ? "password-error" : undefined}
                onChange={(event) => {
                  if (isRegister) {
                    setPasswordError(getPasswordError(event.currentTarget.value));
                  }
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-0 right-0"
                aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                aria-pressed={isPasswordVisible}
                onClick={() => setIsPasswordVisible((visible) => !visible)}
              >
                {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
              </Button>
            </div>
            {passwordError && (
              <p id="password-error" className="text-sm text-destructive">
                {passwordError}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || socialProvider !== null}
          >
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
              href={
                isRegister
                  ? "/login"
                  : returnPath === "/"
                    ? "/register"
                    : `/register?callbackURL=${encodeURIComponent(returnPath)}`
              }
            >
              {isRegister ? "Login" : "Create an account"}
            </Link>
          </p>
        </form>

        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">
            or continue with
          </span>
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
            variant="outline"
            className="h-10 w-full gap-3 bg-muted/50"
            disabled={isSubmitting || socialProvider !== null}
            onClick={() => handleSocialSignIn("github")}
          >
            <Image
              src="/image/github.png"
              alt=""
              width={18}
              height={18}
              className="dark:invert"
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
