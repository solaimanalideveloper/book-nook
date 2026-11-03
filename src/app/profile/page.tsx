import { Suspense } from "react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { ProfileView } from "@/app/profile/profile-view";

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen animate-pulse bg-muted/30" />}>
      <ProtectedRoute returnTo="/profile">
        <ProfileView />
      </ProtectedRoute>
    </Suspense>
  );
}
