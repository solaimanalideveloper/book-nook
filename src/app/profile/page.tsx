import Link from "next/link";
import { UserRoundIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center text-foreground">
      <span className="grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground">
        <UserRoundIcon className="size-6" />
      </span>
      <h1 className="text-3xl font-bold">My Profile</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        Manage your account and borrowing history — coming soon.
      </p>
      <Button
        nativeButton={false}
        render={<Link href="/" />}
        className="rounded-full"
      >
        Back to Home
      </Button>
    </div>
  );
}
