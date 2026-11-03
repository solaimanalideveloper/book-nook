"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
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

const socialProviders = ["google", "github"] as const;

function getSafeReturnPath(value: string | null): string | null {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\")
  ) {
    return null;
  }
  return value;
}

export function ProfileView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnPath = getSafeReturnPath(searchParams.get("returnTo"));
  const suggestedProvider = searchParams.get("linkProvider");
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [linkedProviders, setLinkedProviders] = React.useState<string[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = React.useState(true);
  const [linkingProvider, setLinkingProvider] = React.useState<
    (typeof socialProviders)[number] | null
  >(null);

  React.useEffect(() => {
    let isActive = true;

    async function loadAccounts() {
      try {
        const result = await authClient.listAccounts();
        if (result.error) {
          toast.error(result.error.message || "Could not load linked accounts.");
          return;
        }

        if (isActive) {
          setLinkedProviders(result.data.map((account) => account.providerId));
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Please try again.";
        toast.error(`Could not load linked accounts: ${message}`);
      } finally {
        if (isActive) setIsLoadingAccounts(false);
      }
    }

    void loadAccounts();
    return () => {
      isActive = false;
    };
  }, []);

  async function handleLinkProvider(provider: (typeof socialProviders)[number]) {
    setLinkingProvider(provider);

    try {
      const errorCallbackURL = new URL("/profile", window.location.origin);
      errorCallbackURL.searchParams.set("linkError", "1");
      if (returnPath) {
        errorCallbackURL.searchParams.set("returnTo", returnPath);
      }

      const result = await authClient.linkSocial({
        provider,
        callbackURL: returnPath ?? "/profile",
        errorCallbackURL: errorCallbackURL.toString(),
      });

      if (result.error) {
        toast.error(result.error.message || `Could not connect ${provider}.`);
        setLinkingProvider(null);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Please try again.";
      toast.error(`Could not connect ${provider}: ${message}`);
      setLinkingProvider(null);
    }
  }

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
    <div className="flex min-h-[calc(100svh-4rem)] items-center justify-center px-4 py-20 text-foreground sm:px-6 sm:py-24">
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
                <p className="break-words text-lg font-semibold">{user.name}</p>
                <p className="mt-4 text-sm text-muted-foreground">Email</p>
                <p className="break-all text-base">{user.email}</p>
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <p className="font-semibold">Social accounts</p>
                  <p className="text-sm text-muted-foreground">
                    Connect a provider to sign in with it next time. The
                    provider email must match your BookNook email.
                  </p>
                </div>
                {searchParams.get("linkError") && (
                  <p role="alert" className="text-sm text-destructive">
                    Could not connect that account. Sign in with the provider
                    using the same email as your BookNook account and try again.
                  </p>
                )}
                {socialProviders.map((provider) => {
                  const isLinked = linkedProviders.includes(provider);
                  const label =
                    provider === "google" ? "Google" : "GitHub";

                  return (
                    <Button
                      key={provider}
                      type="button"
                      variant="outline"
                      className="w-full gap-3"
                      disabled={
                        isLoadingAccounts ||
                        linkingProvider !== null ||
                        isLinked
                      }
                      onClick={() => void handleLinkProvider(provider)}
                    >
                      <Image
                        src={`/image/${provider}.png`}
                        alt=""
                        width={18}
                        height={18}
                        className={provider === "github" ? "dark:invert" : ""}
                      />
                      {isLoadingAccounts
                        ? "Loading accounts..."
                        : linkingProvider === provider
                          ? "Connecting..."
                          : isLinked
                            ? `${label} connected`
                            : suggestedProvider === provider
                              ? `Connect ${label} to finish sign-in`
                              : `Connect ${label}`}
                    </Button>
                  );
                })}
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
