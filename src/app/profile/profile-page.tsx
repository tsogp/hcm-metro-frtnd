"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfilePreviewTab from "./_components/preview/profile-preview-tab";
import EditProfileTab from "./_components/edit/edit-profile-tab";
import type { ProfileFormValues } from "@/schemas/profile";
import type { UserProfileType } from "@/types/profile";
import {
  getCurrentUserProfile,
  getProfileImage,
  updateProfileCredentials,
  updateProfileImage,
  updateProfileInfo,
} from "@/action/profile";
import { toast } from "sonner";
import { useUserStore } from "@/store/user-store";
import IdVerificationTab from "./_components/id/id-verification-tab";
import { getCardImages } from "@/action/profile";
import { getUserBalance } from "@/action/payment";
import { useSearchParams } from "next/navigation";
import { validateRegister } from "@/action/register";

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
    balance: 0,
    profilePicture: null,
    idVerification: {
      national: { front: null, back: null, status: null },
      student: { front: null, back: null, status: null },
    },
  });

  const [formData, setFormData] = useState<ProfileFormValues>({
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    address: "",
    studentId: "",
  });

  const [initialFormData, setInitialFormData] = useState<ProfileFormValues>({
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    address: "",
    studentId: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("edit");
  const [refreshKey, setRefreshKey] = useState(0);

  const searchParams = useSearchParams();

  useEffect(() => {
    const paymentResult = searchParams.get("payment");

    console.log(paymentResult);

    if (!paymentResult) {
      return;
    }

    if (paymentResult === "success") {
      toast.success("Payment successful.");
    } else if (paymentResult === "failure") {
      toast.error("Payment failed, please try again.");
    }
  }, []);

  // Fetch user profile on update or on page load
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        const userProfile = await getCurrentUserProfile();
        const profileImg = await getProfileImage();
        const balance = (await getUserBalance()).balance;

        const userData = {
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
          balance: balance,
          profilePicture: profileImg?.profileImage?.base64 ?? null,
          idVerification: {
            national: { front: null, back: null, status: null },
            student: { front: null, back: null, status: null },
          },
        };

        setUser(userData);

        const formValues = {
          email: userProfile.passengerEmail,
          password: "",
          confirmPassword: "",
          phoneNumber: userProfile.passengerPhone,
          address: userProfile.passengerAddress,
          studentId: userProfile.studentID || "",
        };

        setFormData(formValues);
        setInitialFormData(formValues);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        toast.error("Failed to load user profile");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserProfile();
  }, [refreshKey]);

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
      const hasCredentialsChanged =
        formData.email !== initialFormData.email ||
        formData.password !== initialFormData.password;

      const hasInfoChanged =
        formData.phoneNumber !== initialFormData.phoneNumber ||
        formData.address !== initialFormData.address ||
        formData.studentId !== initialFormData.studentId;

      const hasImageChanged = selectedImage !== null;

      const promises = [];
      const toastPromises = [];

      if (hasCredentialsChanged) {
        try {
          if (formData.email !== initialFormData.email) {
            await toast.promise(validateRegister(formData.email), {
              error: (e) => {
                if (e?.response?.status) {
                  switch (e.response.status) {
                    case 400:
                      return e.response.data?.message || "Invalid request";
                    case 409:
                      return (
                        e.response.data?.message ||
                        "This email is already in use"
                      );
                    case 500:
                      return (
                        e.response.data?.message || "Internal Server Error"
                      );
                    default:
                      return (
                        e.response.data?.message || "Internal Server Error"
                      );
                  }
                }
                return "Internal Server Error";
              },
            });
          }

          const credentialsPromise = updateProfileCredentials({
            passengerEmail: formData.email,
            password: formData.password || undefined,
          });

          const credentialsToast = toast.promise(credentialsPromise, {
            loading: "Updating credentials...",
            success: "Credentials updated successfully!",
            error: "Failed to update credentials. Please try again.",
          });

          promises.push(credentialsPromise);
          toastPromises.push(credentialsToast);
        } catch (e) {
          setIsSubmitting(false);
          return;
        }
      }

      if (hasInfoChanged) {
        const infoPromise = updateProfileInfo({
          passengerPhone: formData.phoneNumber,
          passengerAddress: formData.address,
          studentID: formData.studentId || "",
        });

        const infoToast = toast.promise(infoPromise, {
          loading: "Updating profile...",
          success: "Profile updated successfully!",
          error: "Failed to update profile. Please try again.",
        });

        promises.push(infoPromise);
        toastPromises.push(infoToast);
      }

      // Only update image if it's changed
      if (hasImageChanged && selectedImage) {
        const imagePromise = updateProfileImage(selectedImage);

        const imageToast = toast.promise(imagePromise, {
          loading: "Updating image...",
          success: "Image updated successfully!",
          error: "Failed to update image. Please try again.",
        });

        promises.push(imagePromise);
        toastPromises.push(imageToast);
      }

      // If nothing has changed, show a message
      if (!hasCredentialsChanged && !hasInfoChanged && !hasImageChanged) {
        toast.info("No changes to save");
        setIsSubmitting(false);
        return;
      }

      // Wait for all promises to resolve
      await Promise.all(promises);

      // Refresh user data
      const userProfile = await getCurrentUserProfile();
      const profileImg = await getProfileImage();
      const balance = (await getUserBalance()).balance;

      setCurrentUser({
        ...userProfile,
        profilePicture: profileImg?.profileImage?.base64 ?? null,
        balance,
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
        balance: balance,
        profilePicture: profileImg?.profileImage?.base64 ?? null,
        idVerification: user.idVerification,
      });

      // Update initial form data to match current form data
      setInitialFormData({
        ...formData,
        password: "",
        confirmPassword: "",
      });

      // Reset password fields
      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));

      // Reset selected image
      setSelectedImage(null);

      // Increment refresh key to trigger a refresh
      setRefreshKey((prev) => prev + 1);

      // Show success message if no specific toasts were shown
      if (toastPromises.length === 0) {
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("An error occurred while updating your profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add refetch function
  const refetchCardImages = async () => {
    try {
      const response = await getCardImages();
      const images = response.data;

      if (images && user) {
        const processedImages: any = {
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
        };

        // Process all pictures and sort them by imageType
        const allPictures = [
          ...(images.nationalIdPictures || []),
          ...(images.studentIdPictures || []),
        ];

        allPictures.forEach((picture: any) => {
          const imageUrl = `data:${picture.mimeType};base64,${picture.base64}`;

          switch (picture.imageType) {
            case "NATIONAL_ID_FRONT":
              processedImages.national.front = imageUrl;
              break;
            case "NATIONAL_ID_BACK":
              processedImages.national.back = imageUrl;
              break;
            case "STUDENT_ID_FRONT":
              processedImages.student.front = imageUrl;
              break;
            case "STUDENT_ID_BACK":
              processedImages.student.back = imageUrl;
              break;
          }
        });

        // Set verification status
        processedImages.national.status = processedImages.national.front
          ? "verified"
          : null;
        processedImages.student.status = processedImages.student.front
          ? "verified"
          : null;

        // Update user state with new images
        setUser((prevUser) => {
          if (!prevUser) return prevUser;
          return {
            ...prevUser,
            idVerification: processedImages,
          };
        });

        // Trigger a refresh of the preview
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to refetch card images:", error);
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

            <TabsContent value="edit">
              <EditProfileTab
                user={user}
                handleSubmit={handleSubmit}
                previewUrl={previewUrl}
                formData={formData}
                handleInputChange={handleInputChange}
                setFormData={setFormData}
                setSelectedImage={setSelectedImage}
                setPreviewUrl={setPreviewUrl}
                setActiveTab={setActiveTab}
                isSubmitting={isSubmitting}
              />
            </TabsContent>

            <TabsContent value="verification">
              <IdVerificationTab
                user={user}
                setUser={setUser}
                onRefetch={refetchCardImages}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
