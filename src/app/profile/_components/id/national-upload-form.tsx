"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { updateCardImages } from "@/action/profile";
import { toast } from "sonner";

type NationalIdUploadFormProps = {
  setUser?: React.Dispatch<React.SetStateAction<any>>;
  onRefetch?: () => Promise<void>;
};

export default function NationalIdUploadForm({
  setUser,
  onRefetch,
}: NationalIdUploadFormProps) {
  const [frontImage, setFrontImage] = useState<{
    url: string;
    file: File;
  } | null>(null);
  const [backImage, setBackImage] = useState<{
    url: string;
    file: File;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = (side: "front" | "back") => {
    if (side === "front") {
      frontInputRef.current?.click();
    } else {
      backInputRef.current?.click();
    }
  };

  const validateFile = (file: File): string | null => {
    if (file.size > 5 * 1024 * 1024) {
      return "File size must be less than 5MB";
    }

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      return "Only JPEG and PNG formats are allowed";
    }

    return null;
  };

  const handleFrontImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const validationError = validateFile(file);
      if (validationError) {
        toast.error(validationError);
        return;
      }

      const url = URL.createObjectURL(file);
      setFrontImage({ url, file });
    }
  };

  const handleBackImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const validationError = validateFile(file);
      if (validationError) {
        toast.error(validationError);
        return;
      }

      const url = URL.createObjectURL(file);
      setBackImage({ url, file });
    }
  };

  const handleRemoveImage = (side: "front" | "back") => {
    if (side === "front") {
      if (frontImage?.url) {
        URL.revokeObjectURL(frontImage.url);
      }
      setFrontImage(null);
      if (frontInputRef.current) {
        frontInputRef.current.value = "";
      }
    } else {
      if (backImage?.url) {
        URL.revokeObjectURL(backImage.url);
      }
      setBackImage(null);
      if (backInputRef.current) {
        backInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async () => {
    if (!frontImage?.file || !backImage?.file) {
      setError("Please upload both sides of your National ID");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const uploadAction = updateCardImages({
        frontImageType: "NATIONAL_ID_FRONT",
        backImageType: "NATIONAL_ID_BACK",
        frontFile: frontImage.file,
        backFile: backImage.file,
      });

      toast.promise(uploadAction, {
        loading: "Uploading National ID...",
        success: async () => {
          // Update user state if setUser is provided
          if (setUser) {
            setUser((prevUser: any) => {
              const updatedIdVerification = {
                ...(prevUser.idVerification || {
                  national: { front: null, back: null, status: null },
                  student: { front: null, back: null, status: null },
                }),
              };

              // Only update the national ID
              updatedIdVerification.national = {
                front: frontImage.url,
                back: backImage.url,
                status: "verified",
              };

              return {
                ...prevUser,
                idVerification: updatedIdVerification,
              };
            });
          }

          // Reset form after successful upload
          handleRemoveImage("front");
          handleRemoveImage("back");

          // Refetch data if onRefetch is provided
          if (onRefetch) {
            await onRefetch();
          }

          return "National ID uploaded successfully!";
        },
        error: (error) => {
          console.error("Upload error:", error);
          setError("Failed to upload ID. Please try again.");
          return "Failed to upload ID. Please try again.";
        },
      });

      await uploadAction;
    } catch (error) {
      console.error("Upload error:", error);
      setError("An error occurred while uploading your ID. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">National ID</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Front Side Upload */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Front Side</p>
          <div
            className={`border-2 border-dashed rounded-lg p-4 h-48 flex flex-col items-center justify-center relative ${
              frontImage
                ? "border-green-500 bg-green-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input
              type="file"
              ref={frontInputRef}
              onChange={handleFrontImageChange}
              accept="image/jpeg,image/png"
              className="hidden"
            />

            {frontImage ? (
              <>
                <img
                  src={frontImage.url || "/placeholder.svg"}
                  alt="National ID Front"
                  className="max-h-full max-w-full object-contain"
                />
                <button
                  onClick={() => handleRemoveImage("front")}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-500"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </>
            ) : (
              <div
                className="text-center cursor-pointer"
                onClick={() => handleUploadClick("front")}
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
          <p className="text-sm font-medium">Back Side</p>
          <div
            className={`border-2 border-dashed rounded-lg p-4 h-48 flex flex-col items-center justify-center relative ${
              backImage
                ? "border-green-500 bg-green-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input
              type="file"
              ref={backInputRef}
              onChange={handleBackImageChange}
              accept="image/jpeg,image/png"
              className="hidden"
            />

            {backImage ? (
              <>
                <img
                  src={backImage.url || "/placeholder.svg"}
                  alt="National ID Back"
                  className="max-h-full max-w-full object-contain"
                />
                <button
                  onClick={() => handleRemoveImage("back")}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-500"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </>
            ) : (
              <div
                className="text-center cursor-pointer"
                onClick={() => handleUploadClick("back")}
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

      {/* Error Message */}
      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={!frontImage || !backImage || isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit National ID Verification"
        )}
      </Button>
    </div>
  );
}
