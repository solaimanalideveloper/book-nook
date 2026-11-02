"use client";

import * as React from "react";
import { BookOpenIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useAuth } from "@/components/auth/auth-context";

export type AuthMode = "login" | "register";

export function LoginDialog({
  open,
  onOpenChange,
  mode,
  onModeChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
}) {
  const { login } = useAuth();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  function resetAndClose() {
    setName("");
    setEmail("");
    setPassword("");
    onOpenChange(false);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    // Mock auth: use the part before @ as the display name
    const displayName = email.split("@")[0];
    login(displayName.charAt(0).toUpperCase() + displayName.slice(1), email);
    resetAndClose();
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    login(name, email);
    resetAndClose();
  }

  function switchToRegister(e: React.FormEvent) {
    e.preventDefault();
    onModeChange("register");
  }

  function switchToLogin(e: React.FormEvent) {
    e.preventDefault();
    onModeChange("login");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <BookOpenIcon className="size-5" />
          </span>
          <DialogHeader>
            <DialogTitle className="text-lg">Welcome to BookNook</DialogTitle>
            <DialogDescription>
              Borrow and share books with your neighbourhood.
            </DialogDescription>
          </DialogHeader>
        </div>

        <Tabs
          value={mode}
          onValueChange={(value) => onModeChange(value as AuthMode)}
        >
          <TabsList className="w-full">
            <TabsTrigger value="login" className="w-full">
              Login
            </TabsTrigger>
            <TabsTrigger value="register" className="w-full">
              Register
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="flex flex-col gap-3">
              <Input
                autoFocus
                required
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                required
                type="password"
                minLength={6}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" className="justify-center">
                Login
              </Button>
              <button
                type="button"
                onClick={switchToRegister}
                className="text-center text-xs text-muted-foreground hover:text-foreground hover:underline"
              >
                New here? Create an account
              </button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="flex flex-col gap-3">
              <Input
                required
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                required
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                required
                type="password"
                minLength={6}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" className="justify-center">
                Create account
              </Button>
              <button
                type="button"
                onClick={switchToLogin}
                className="text-center text-xs text-muted-foreground hover:text-foreground hover:underline"
              >
                Already a member? Login instead
              </button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
