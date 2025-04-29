"use client";

import type React from "react";
import { useState, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  X,
  Check,
  AlertCircle,
  Info,
  Upload,
  ShieldCheck,
  Clock,
  ShieldAlert,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { UserProfileType } from "../../../types/profile";
import { Badge } from "@/components/ui/badge";

type IdVerificationTabProps = {
  user: UserProfileType;
  setUser?: React.Dispatch<React.SetStateAction<UserProfileType>>;
};

type IdType = "national" | "student";
type IdSide = "front" | "back";

interface IdImage {
  url: string;
  file: File;
}

interface IdImages {
  national: {
    front: IdImage | null;
    back: IdImage | null;
  };
  student: {
    front: IdImage | null;
    back: IdImage | null;
  };
}

export default function IdVerificationTab({
  user,
  setUser,
}: IdVerificationTabProps) {
  // Initialize with existing verification images if available
  const [idImages, setIdImages] = useState<IdImages>({
    national: {
      front: user.idVerification?.national.front
        ? {
            url: user.idVerification.national.front,
            file: new File([], "national-front"),
          }
        : null,
      back: user.idVerification?.national.back
        ? {
            url: user.idVerification.national.back,
            file: new File([], "national-back"),
          }
        : null,
    },
    student: {
      front: user.idVerification?.student.front
        ? {
            url: user.idVerification.student.front,
            file: new File([], "student-front"),
          }
        : null,
      back: user.idVerification?.student.back
        ? {
            url: user.idVerification.student.back,
            file: new File([], "student-back"),
          }
        : null,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState({
    national: false,
    student: false,
  });
  const [submitSuccess, setSubmitSuccess] = useState({
    national:
      user.idVerification?.national.status === "pending" ||
      user.idVerification?.national.status === "verified",
    student:
      user.idVerification?.student.status === "pending" ||
      user.idVerification?.student.status === "verified",
  });
  const [submitError, setSubmitError] = useState<{
    national: string | null;
    student: string | null;
  }>({
    national: null,
    student: null,
  });

  const fileInputRefs = {
    national: {
      front: useRef<HTMLInputElement>(null),
      back: useRef<HTMLInputElement>(null),
    },
    student: {
      front: useRef<HTMLInputElement>(null),
      back: useRef<HTMLInputElement>(null),
    },
  };

  const handleUploadClick = (idType: IdType, side: IdSide) => {
    fileInputRefs[idType][side].current?.click();
  };

  const validateFile = (file: File): string | null => {
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return "File size must be less than 5MB";
    }

    // Check file type (only JPEG or PNG)
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      return "Only JPEG and PNG formats are allowed";
    }

    return null;
  };

  const handleImageChange =
    (idType: IdType, side: IdSide) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];

        // Validate file
        const validationError = validateFile(file);
        if (validationError) {
          alert(validationError);
          return;
        }

        // Create object URL for preview
        const url = URL.createObjectURL(file);

        // Update state with new image
        setIdImages((prev) => ({
          ...prev,
          [idType]: {
            ...prev[idType],
            [side]: { url, file },
          },
        }));

        // Reset submission states for this ID type
        setSubmitSuccess((prev) => ({
          ...prev,
          [idType]: false,
        }));
        setSubmitError((prev) => ({
          ...prev,
          [idType]: null,
        }));
      }
    };

  const handleRemoveImage = (idType: IdType, side: IdSide) => {
    // Revoke object URL to prevent memory leaks
    if (idImages[idType][side]?.url) {
      URL.revokeObjectURL(idImages[idType][side]!.url);
    }

    // Reset file input
    if (fileInputRefs[idType][side].current) {
      fileInputRefs[idType][side].current!.value = "";
    }

    // Update state
    setIdImages((prev) => ({
      ...prev,
      [idType]: {
        ...prev[idType],
        [side]: null,
      },
    }));
  };

  const handleSubmit = async (idType: IdType) => {
    // Validate that both sides of the selected ID type are uploaded
    const currentIdType = idImages[idType];
    if (!currentIdType.front || !currentIdType.back) {
      setSubmitError((prev) => ({
        ...prev,
        [idType]: `Please upload both sides of your ${
          idType === "national" ? "National ID" : "Student ID"
        }`,
      }));
      return;
    }

    setIsSubmitting((prev) => ({
      ...prev,
      [idType]: true,
    }));
    setSubmitError((prev) => ({
      ...prev,
      [idType]: null,
    }));

    try {
      // Simulate API call to upload images
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, you would upload the images to a server here
      // const formData = new FormData();
      // formData.append(`${idType}_front`, currentIdType.front.file);
      // formData.append(`${idType}_back`, currentIdType.back.file);
      // const response = await fetch('/api/upload-id', { method: 'POST', body: formData });

      if (setUser) {
        // Update user state with the new verification images and set status to verified
        setUser((prevUser) => ({
          ...prevUser,
          idVerification: {
            ...(prevUser.idVerification || {
              national: { front: null, back: null, status: null },
              student: { front: null, back: null, status: null },
            }),
            [idType]: {
              front: currentIdType.front!.url,
              back: currentIdType.back!.url,
              status: "verified",
            },
          },
        }));
      }

      setSubmitSuccess((prev) => ({
        ...prev,
        [idType]: true,
      }));

      // In a real app, you might want to update the user object with verification status
      console.log(`${idType} ID verification submitted successfully`);
    } catch (error) {
      setSubmitError((prev) => ({
        ...prev,
        [idType]:
          "An error occurred while uploading your ID. Please try again.",
      }));
      console.error("Upload error:", error);
    } finally {
      setIsSubmitting((prev) => ({
        ...prev,
        [idType]: false,
      }));
    }
  };

  const isUploadComplete = (idType: IdType) => {
    return idImages[idType].front !== null && idImages[idType].back !== null;
  };

  const getVerificationStatusBadge = (
    status: "pending" | "verified" | "rejected" | null
  ) => {
    if (!status) return null;

    switch (status) {
      case "verified":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
          >
            <ShieldCheck className="h-3 w-3" />
            {status === "verified" ? "Verified" : null}
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1"
          >
            <ShieldAlert className="h-3 w-3" />
            Rejected
          </Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>ID Verification</CardTitle>
        <CardDescription>
          Upload images of your ID cards for verification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Upload Instructions */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Upload Requirements</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 text-sm mt-2">
              <li>Upload both front and back sides of your ID</li>
              <li>Maximum file size: 5MB per image</li>
              <li>Accepted formats: JPEG, PNG</li>
              <li>Ensure all information is clearly visible</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* National ID Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">National ID</h3>
            {user.idVerification?.national.status &&
              getVerificationStatusBadge(user.idVerification.national.status)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Front Side Upload */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Front Side</h3>
              <div
                className={`border-2 border-dashed rounded-lg p-4 h-48 flex flex-col items-center justify-center relative ${
                  idImages.national.front
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRefs.national.front}
                  onChange={handleImageChange("national", "front")}
                  accept="image/jpeg,image/png"
                  className="hidden"
                />

                {idImages.national.front ? (
                  <>
                    <img
                      src={idImages.national.front.url || "/placeholder.svg"}
                      alt="National ID Front"
                      className="max-h-full max-w-full object-contain"
                    />
                    <button
                      onClick={() => handleRemoveImage("national", "front")}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </button>
                  </>
                ) : (
                  <div
                    className="text-center cursor-pointer"
                    onClick={() => handleUploadClick("national", "front")}
                  >
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm font-medium">
                      Click to upload front side
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      JPEG or PNG, max 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Back Side Upload */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Back Side</h3>
              <div
                className={`border-2 border-dashed rounded-lg p-4 h-48 flex flex-col items-center justify-center relative ${
                  idImages.national.back
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRefs.national.back}
                  onChange={handleImageChange("national", "back")}
                  accept="image/jpeg,image/png"
                  className="hidden"
                />

                {idImages.national.back ? (
                  <>
                    <img
                      src={idImages.national.back.url || "/placeholder.svg"}
                      alt="National ID Back"
                      className="max-h-full max-w-full object-contain"
                    />
                    <button
                      onClick={() => handleRemoveImage("national", "back")}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </button>
                  </>
                ) : (
                  <div
                    className="text-center cursor-pointer"
                    onClick={() => handleUploadClick("national", "back")}
                  >
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm font-medium">
                      Click to upload back side
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      JPEG or PNG, max 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Verification Status */}
          {isUploadComplete("national") && !submitSuccess.national && (
            <div className="mt-4">
              <Alert variant="default">
                <Info className="h-4 w-4" />
                <AlertTitle>Ready to Submit</AlertTitle>
                <AlertDescription>
                  Both sides of your National ID have been uploaded. Click the
                  Submit button below to complete verification.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Success Message */}
          {submitSuccess.national && (
            <div className="mt-4">
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <Check className="h-4 w-4 text-green-500" />
                <AlertTitle>National ID Verification Submitted</AlertTitle>
                <AlertDescription>
                  Your National ID verification has been submitted successfully.
                  We will review your documents and update your verification
                  status.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Error Message */}
          {submitError.national && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{submitError.national}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          {!submitSuccess.national && (
            <Button
              onClick={() => handleSubmit("national")}
              disabled={!isUploadComplete("national") || isSubmitting.national}
              className="w-full"
            >
              {isSubmitting.national
                ? "Submitting..."
                : "Submit National ID Verification"}
            </Button>
          )}
        </div>

        <Separator />

        {/* Student ID Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Student ID</h3>
            {user.idVerification?.student.status &&
              getVerificationStatusBadge(user.idVerification.student.status)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Front Side Upload */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Front Side</h3>
              <div
                className={`border-2 border-dashed rounded-lg p-4 h-48 flex flex-col items-center justify-center relative ${
                  idImages.student.front
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRefs.student.front}
                  onChange={handleImageChange("student", "front")}
                  accept="image/jpeg,image/png"
                  className="hidden"
                />

                {idImages.student.front ? (
                  <>
                    <img
                      src={idImages.student.front.url || "/placeholder.svg"}
                      alt="Student ID Front"
                      className="max-h-full max-w-full object-contain"
                    />
                    <button
                      onClick={() => handleRemoveImage("student", "front")}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </button>
                  </>
                ) : (
                  <div
                    className="text-center cursor-pointer"
                    onClick={() => handleUploadClick("student", "front")}
                  >
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm font-medium">
                      Click to upload front side
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      JPEG or PNG, max 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Back Side Upload */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Back Side</h3>
              <div
                className={`border-2 border-dashed rounded-lg p-4 h-48 flex flex-col items-center justify-center relative ${
                  idImages.student.back
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRefs.student.back}
                  onChange={handleImageChange("student", "back")}
                  accept="image/jpeg,image/png"
                  className="hidden"
                />

                {idImages.student.back ? (
                  <>
                    <img
                      src={idImages.student.back.url || "/placeholder.svg"}
                      alt="Student ID Back"
                      className="max-h-full max-w-full object-contain"
                    />
                    <button
                      onClick={() => handleRemoveImage("student", "back")}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </button>
                  </>
                ) : (
                  <div
                    className="text-center cursor-pointer"
                    onClick={() => handleUploadClick("student", "back")}
                  >
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm font-medium">
                      Click to upload back side
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      JPEG or PNG, max 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Verification Status */}
          {isUploadComplete("student") && !submitSuccess.student && (
            <div className="mt-4">
              <Alert variant="default">
                <Info className="h-4 w-4" />
                <AlertTitle>Ready to Submit</AlertTitle>
                <AlertDescription>
                  Both sides of your Student ID have been uploaded. Click the
                  Submit button below to complete verification.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Success Message */}
          {submitSuccess.student && (
            <div className="mt-4">
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <Check className="h-4 w-4 text-green-500" />
                <AlertTitle>Student ID Verification Submitted</AlertTitle>
                <AlertDescription>
                  Your Student ID verification has been submitted successfully.
                  We will review your documents and update your verification
                  status.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Error Message */}
          {submitError.student && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{submitError.student}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          {!submitSuccess.student && (
            <Button
              onClick={() => handleSubmit("student")}
              disabled={!isUploadComplete("student") || isSubmitting.student}
              className="w-full"
            >
              {isSubmitting.student
                ? "Submitting..."
                : "Submit Student ID Verification"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
