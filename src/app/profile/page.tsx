import { Suspense } from "react";
import type { Metadata } from "next";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { ProfileView } from "@/app/profile/profile-view";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export const metadata: Metadata = {
  title: "My Profile",
};

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[65svh] items-center justify-center">
          <LoadingSpinner label="Loading your profile..." />
        </div>
      }
    >
      <ProtectedRoute returnTo="/profile">
        <ProfileView />
      </ProtectedRoute>
    </Suspense>
  );
}
