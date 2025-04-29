"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfilePreviewTab from "./_components/profile-preview-tab";
import EditProfileTab from "./_components/edit-profile-tab";
import IdVerificationTab from "./_components/id-verification-tab";
import type { ProfileFormType, UserProfileType } from "@/types/profile";

export default function ProfilePage() {
  // Mock user data - in a real app, this would come from your database
  const [user, setUser] = useState<UserProfileType>({
    email: "user@example.com",
    firstName: "Nguyen",
    middleName: "Son",
    lastName: "Tung",
    phoneNumber: "0121234567",
    address: "702 Nguyen Van Linh, District 7, HCMC, Vietnam",
    dateOfBirth: "1990/05/15",
    nationalId: "AB123456789",
    studentId: "-",
    disabilityStatus: false,
    revolutionaryContribution: true,
    balance: 1250.12,
    profilePicture: null,
    idVerification: {
      national: {
        front: null,
        back: null,
        status: null,
      },
      student: {
        front: null,
        back: null,
        status: null,
      },
    },
  });

  // Form state
  const [formData, setFormData] = useState<ProfileFormType>({
    email: user.email,
    password: "",
    confirmPassword: "",
    firstName: user.firstName,
    middleName: user.middleName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    address: user.address,
    dateOfBirth: user.dateOfBirth,
    nationalId: user.nationalId,
    studentId: user.studentId || "",
    disabilityStatus: user.disabilityStatus,
    revolutionaryContribution: user.revolutionaryContribution,
  });

  // Profile picture state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    user.profilePicture
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");

  // Create preview URL when a new image is selected
  useEffect(() => {
    if (selectedImage) {
      const objectUrl = URL.createObjectURL(selectedImage);
      setPreviewUrl(objectUrl);

      // Clean up the URL when component unmounts or when the selected image changes
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedImage]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // In a real app, you would upload the image to a server here
      // and get back a URL to store in the user object

      // Update user data
      setUser({
        ...user,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        profilePicture: previewUrl, // Update profile picture
      });

      // Reset password fields
      setFormData({
        ...formData,
        password: "",
        confirmPassword: "",
      });

      setIsSubmitting(false);

      // In a real app, you would show a success message here
      alert("Profile updated successfully!");
    }, 1000);

    console.log(user);
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6 text-center">User Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Preview - Always visible on the left */}
        <div className="lg:col-span-5">
          <ProfilePreviewTab
            user={user}
            getInitials={getInitials}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* Editing Tabs - On the right */}
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
                previewUrl={previewUrl}
                getInitials={getInitials}
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
