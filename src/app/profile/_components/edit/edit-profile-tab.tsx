"use client";

import type React from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useEffect, useRef } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileFormSchema, type ProfileFormValues } from "@/schemas/profile";
import type { UserProfileType } from "@/types/profile";
import EditProfileForm from "./edit-profile-form";

interface EditProfileTabProps {
  user: UserProfileType | undefined;
  handleSubmit: (e: React.FormEvent) => void;
  previewUrl: string | null;
  formData: ProfileFormValues | undefined;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  setFormData: (value: any) => void;
  setSelectedImage: (selectedImage: File | null) => void;
  setPreviewUrl: (previewUrl: string | null) => void;
  setActiveTab: (value: string) => void;
  isSubmitting: boolean;
}

function EditProfileTab({
  user,
  handleSubmit: onSubmitForm,
  previewUrl,
  formData,
  handleInputChange,
  setFormData,
  setSelectedImage,
  setPreviewUrl,
  isSubmitting,
}: EditProfileTabProps) {
  const defaultFormValues = {
    email: user?.email || "",
    password: "",
    confirmPassword: "",
    studentId: user?.studentId || "",
    phoneNumber: user?.phoneNumber || "",
    address: user?.address || "",
  };

  const editProfileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: defaultFormValues,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      const values = {
        email: user.email || "",
        password: "",
        confirmPassword: "",
        studentId: user.studentId || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
      };
      editProfileForm.reset(values);
      setFormData(values);
    }
  }, [user, setFormData]);

  const onSubmit = (data: ProfileFormValues) => {
    setFormData({ ...formData, ...data });
    onSubmitForm({ preventDefault: () => {} } as React.FormEvent);
  };

  const hasFormChanges = () => {
    const currentValues = editProfileForm.getValues();
    return (
      currentValues.email !== user?.email ||
      currentValues.phoneNumber !== user?.phoneNumber ||
      currentValues.address !== user?.address ||
      currentValues.password !== "" ||
      currentValues.confirmPassword !== "" ||
      previewUrl !== null ||
      currentValues.studentId !== user?.studentId
    );
  };

  const handleReset = () => {
    editProfileForm.reset(defaultFormValues);
    setFormData({ ...formData, ...defaultFormValues });
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // IMAGE PROCESSING FUNCTIONS
  const handleUploadClick = () => fileInputRef.current?.click();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/"))
        return alert("Please select an image file");
      if (file.size > 5 * 1024 * 1024)
        return alert("Image size should be less than 5MB");
      setSelectedImage(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const showRemoveButton = previewUrl ? true : false;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>Update your profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <EditProfileForm
          user={user as UserProfileType}
          editProfileForm={editProfileForm}
          onSubmit={onSubmit}
          hasFormChanges={hasFormChanges}
          handleInputChange={handleInputChange}
          handleReset={handleReset}
          fileInputRef={fileInputRef}
          previewUrl={previewUrl}
          handleUploadClick={handleUploadClick}
          handleImageChange={handleImageChange}
          handleRemoveImage={handleRemoveImage}
          showRemoveButton={showRemoveButton}
          isSubmitting={isSubmitting}
        />
      </CardContent>
    </Card>
  );
}

export default EditProfileTab;
