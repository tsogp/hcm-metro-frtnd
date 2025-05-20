import { Suspense } from "react";
import ProfilePage from "./profile-page";

export default function ProfilePageSuspense() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfilePage />
    </Suspense>
  );
}
