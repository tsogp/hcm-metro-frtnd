"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Info } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import type { UserProfileType } from "@/types/profile";
import { getCardImages } from "@/action/profile";
import { toast } from "sonner";
import type { CardImagesList } from "@/types/id-verification";
import NationalIdUploadForm from "./national-upload-form";
import StudentIdUploadForm from "./student-upload-form";

type IdVerificationTabProps = {
  user: UserProfileType;
  setUser?: React.Dispatch<React.SetStateAction<UserProfileType>>;
  onRefetch?: () => Promise<void>;
};

export default function IdVerificationTab({
  user,
  setUser,
  onRefetch,
}: IdVerificationTabProps) {
  const [cardImages, setCardImages] = useState({
    national: {
      front: null,
      back: null,
    },
    student: {
      front: null,
      back: null,
    },
  });

  const [isLoading, setIsLoading] = useState(true);

  const fetchCardImages = async () => {
    try {
      setIsLoading(true);
      const response = await getCardImages();
      const images = response.data;

      if (images) {
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

        setCardImages(processedImages);
      }
    } catch (error) {
      console.error(
        "Failed to fetch card images (User does not have any): ",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCardImages();
    }
  }, [user]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-10">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Loading ID information...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
        <NationalIdUploadForm setUser={setUser} onRefetch={onRefetch} />

        <Separator />

        {/* Student ID Section */}
        <StudentIdUploadForm setUser={setUser} onRefetch={onRefetch} />
      </CardContent>
    </Card>
  );
}
