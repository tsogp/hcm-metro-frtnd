"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfilePreviewTab from "./_components/preview/profile-preview-tab";
import EditProfileTab from "./_components/edit/edit-profile-tab";
import IdVerificationTab from "./_components/id/id-verification-tab";
import type { ProfileFormType, UserProfileType } from "@/types/profile";
import {
  getCurrentUserProfile,
  getProfileImage,
  updateProfileCredentials,
  updateProfileImage,
  updateProfileInfo,
} from "@/action/profile";
import { toast } from "sonner";
import { useUserStore } from "@/store/user-store";

export default function ProfilePage() {
  const { setCurrentUser } = useUserStore();

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
    idVerification: {
      national: { front: null, back: null, status: null },
      student: { front: null, back: null, status: null },
    },
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
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("edit");
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch user profile on update or on page load
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        const userProfile = await getCurrentUserProfile();
        const profileImg = await getProfileImage();

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
          idVerification: {
            national: { front: null, back: null, status: null },
            student: { front: null, back: null, status: null },
          },
        });

        setFormData({
          email: userProfile.passengerEmail,
          password: "",
          confirmPassword: "",
          phoneNumber: userProfile.passengerPhone,
          address: userProfile.passengerAddress,
        });
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        toast.error("Failed to load user profile");
      } finally {
        setIsLoading(false);
      }
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
    setPreviewUrl(null);

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

      if (selectedImage) {
        const onUploadImageAction = updateProfileImage(selectedImage);

        toast.promise(onUploadImageAction, {
          loading: "Updating image...",
          success: () => {
            return "Image updated successfully!";
          },
          error: "Failed to update image. Please try again.",
        });
        await onUploadImageAction;
      }

      const userProfile = await getCurrentUserProfile();
      const profileImg = await getProfileImage();
      setCurrentUser({
        ...userProfile,
        profilePicture: profileImg?.profileImage?.base64 ?? null,
      });
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
        idVerification: user.idVerification, // Preserve existing verification data
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
