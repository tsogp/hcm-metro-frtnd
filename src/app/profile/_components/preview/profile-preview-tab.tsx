"use client";

import type { UserProfileType } from "@/types/profile";
import ProfilePreviewCard from "./profile-preview-card";

type ProfilePreviewTabProps = {
  user: UserProfileType;
  setActiveTab: (value: string) => void;
};

function ProfilePreviewTab({ user, setActiveTab }: ProfilePreviewTabProps) {
  return (
    <ProfilePreviewCard user={user} setActiveTab={setActiveTab} />
  );
}

export default ProfilePreviewTab;
