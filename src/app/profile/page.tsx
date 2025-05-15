"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfilePreviewTab from "./_components/preview/profile-preview-tab";
import EditProfileTab from "./_components/edit/edit-profile-tab";
import IdVerificationTab from "./_components/id-verification-tab";
import type { ProfileFormType, UserProfileType } from "@/types/profile";
import {
  getCurrentUserProfile,
  getProfileImg,
  updateProfileCredentials,
  updateProfileImage,
  updateProfileInfo,
} from "@/action/profile";
import { toast } from "sonner";
import { useUserStore } from "@/store/user-store";

export default function ProfilePage() {
  const { currentUser, setCurrentUser } = useUserStore();

  const [user, setUser] = useState<UserProfileType>({
    email: "",
    firstName: "",
    middleName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    nationalId: "",
    studentId: "",
    disabilityStatus: false,
    revolutionaryContribution: false,
    balance: 0.0,
    profilePicture: null,
  });

  const [formData, setFormData] = useState<ProfileFormType>({
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    address: "",
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [activeTab, setActiveTab] = useState("edit");
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch user profile on update or on page load
  useEffect(() => {
    const fetchUserProfile = async () => {
      const userProfile = await getCurrentUserProfile();
      const profileImg = await getProfileImg();

      setUser({
        email: userProfile.passengerEmail,
        firstName: userProfile.passengerFirstName,
        middleName: userProfile.passengerMiddleName,
        lastName: userProfile.passengerLastName,
        phoneNumber: userProfile.passengerPhone,
        address: userProfile.passengerAddress,
        dateOfBirth: userProfile.passengerDateOfBirth,
        nationalId: userProfile.nationalID,
        studentId: userProfile.studentID,
        disabilityStatus: userProfile.hasDisability,
        revolutionaryContribution: userProfile.isRevolutionary,
        balance: 1000,
        profilePicture: profileImg?.profileImage?.base64 ?? null,
      });

      setFormData({
        email: userProfile.passengerEmail,
        password: "",
        confirmPassword: "",
        phoneNumber: userProfile.passengerPhone,
        address: userProfile.passengerAddress,
      });
    };
    fetchUserProfile();
  }, [refreshKey]);

  // Create a preview URL for the selected image
  useEffect(() => {
    if (selectedImage) {
      const objectUrl = URL.createObjectURL(selectedImage);
      setPreviewUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedImage]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Update info and credentials in parallel
      const infoPromise = updateProfileInfo({
        passengerPhone: formData.phoneNumber,
        passengerAddress: formData.address,
      });
  
      const credentialsPromise = updateProfileCredentials({
        passengerEmail: formData.email,
        password: formData.password || undefined,
      });

      toast.promise(infoPromise, {
        loading: "Updating profile...",
        success: "Profile updated successfully!",
        error: "Failed to update profile. Please try again.",
      });

      toast.promise(credentialsPromise, {
        loading: "Updating credentials...",
        success: "Credentials updated successfully!",
        error: "Failed to update credentials. Please try again.",
      });

      // Wait for both to finish
      await Promise.all([infoPromise, credentialsPromise]);

      // Handle image upload (wait for it to finish)
      let newProfilePicture =
        currentUser?.profilePicture ?? "/images/default-avatar.jpg";
      if (selectedImage) {
        const imagePromise = updateProfileImage(selectedImage);
        toast.promise(imagePromise, {
          loading: "Updating image...",
          success: (response) => {
            newProfilePicture = response.data.profileImage.base64;
            return "Image updated successfully!";
          },
          error: "Failed to update image. Please try again.",
        });
      }

      // Now update state with the new image
      setUser((prev) => ({
        ...prev,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        profilePicture: newProfilePicture,
      }));

      setCurrentUser({
        passengerEmail: formData.email,
        passengerPhone: formData.phoneNumber,
        passengerAddress: formData.address,
        profilePicture: newProfilePicture,
        passengerFirstName: currentUser?.passengerFirstName ?? "",
        passengerMiddleName: currentUser?.passengerMiddleName ?? "",
        passengerLastName: currentUser?.passengerLastName ?? "",
        passengerDateOfBirth: currentUser?.passengerDateOfBirth ?? "",
        nationalID: currentUser?.nationalID ?? "",
        studentID: currentUser?.studentID ?? "",
        hasDisability: currentUser?.hasDisability ?? false,
        isRevolutionary: currentUser?.isRevolutionary ?? false,
      });

      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));

      setRefreshKey((prev) => prev + 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6 text-center">User Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Preview - Always visible on the left */}
        <div className="lg:col-span-5">
          <ProfilePreviewTab user={user} setActiveTab={setActiveTab} />
        </div>

        <div className="lg:col-span-7">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit">Edit Profile</TabsTrigger>
              <TabsTrigger value="verification">ID Verification</TabsTrigger>
            </TabsList>

            {/* Edit Profile Tab */}
            <TabsContent value="edit">
              <EditProfileTab
                user={user}
                handleSubmit={handleSubmit}
                previewUrl={previewUrl || null}
                formData={formData}
                handleInputChange={handleInputChange}
                setFormData={setFormData}
                setSelectedImage={setSelectedImage}
                setPreviewUrl={setPreviewUrl}
                setActiveTab={setActiveTab}
                isSubmitting={isSubmitting}
              />
            </TabsContent>

            {/* ID Verification Tab */}
            <TabsContent value="verification">
              <IdVerificationTab user={user} setUser={setUser} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
