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
};

export default function IdVerificationTab({
  user,
  setUser,
}: IdVerificationTabProps) {
  const [cardImages, setCardImages] = useState<CardImagesList>({
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

  useEffect(() => {
    const fetchCardImages = async () => {
      try {
        setIsLoading(true);
        const response = await getCardImages();
        const images = response.data;

        console.log(images);

        if (images) {
          const processedImages: any = {
            national: {
              front: `data:${images?.nationalIdPictures[0].mimeType};base64,${images?.nationalIdPictures[0].base64}`,
              back: `data:${images?.nationalIdPictures[1].mimeType};base64,${images?.nationalIdPictures[1].base64}`,
              status: images?.nationalIdPictures[0] ? "verified" : null,
            },
            student: {
              front: `data:${images?.studentIdPictures[0].mimeType};base64,${images?.studentIdPictures[0].base64}`,
              back: `data:${images?.studentIdPictures[1].mimeType};base64,${images?.studentIdPictures[1].base64}`,
              status: images?.studentIdPictures[0] ? "verified" : null,
            },
          };

          setCardImages(processedImages);
        }
      } catch (error) {
        console.error("Failed to fetch card images:", error);
        toast.error("Failed to load ID card images");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCardImages();
  }, []);

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
        <NationalIdUploadForm setUser={setUser} />

        <Separator />

        {/* Student ID Section */}
        <StudentIdUploadForm setUser={setUser} />
      </CardContent>
    </Card>
  );
}
