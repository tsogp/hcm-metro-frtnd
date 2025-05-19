"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Pen,
  Wallet,
  ShieldCheck,
  FileText,
  Minus,
  Loader2,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import type { UserProfileType } from "@/types/profile";
import { useState, useEffect } from "react";
import { getCardImages } from "@/action/profile";
import { AddFundsModal } from "./_components/add-funds-modal";
import { formatCurrency } from "@/lib/utils";

type ProfilePreviewCardProps = {
  user: UserProfileType;
  setActiveTab: (value: string) => void;
};

function ProfilePreviewCard({ user, setActiveTab }: ProfilePreviewCardProps) {
  const fullName = `${user.firstName} ${user.middleName} ${user.lastName}`;
  const [cardImages, setCardImages] = useState<any>(null);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);

  const handleOpenAddFundsModal = () => {
    setIsTopUpModalOpen(true);
  };

  // Fetch card images from backend
  useEffect(() => {
    const fetchCardImages = async () => {
      try {
        setIsLoadingImages(true);
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
        console.error("Failed to fetch card images:", error);
      } finally {
        setIsLoadingImages(false);
      }
    };

    fetchCardImages();
  }, []);

  const getVerificationStatusBadge = (
    status: "verified" | null,
    type: "national" | "student"
  ) => {
    if (!status) return null;
    if (status === "verified") {
      return (
        <Badge
          variant="outline"
          className="px-3 py-1 bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1.5 rounded-lg"
        >
          <ShieldCheck className="size-4" />
          <span className="font-semibold">
            {type === "student" ? "Student Verified" : "Verified"}
          </span>
        </Badge>
      );
    }
  };

  const hasNationalIdVerification =
    cardImages?.national?.front && cardImages?.national?.back;
  const hasStudentIdVerification =
    cardImages?.student?.front && cardImages?.student?.back;
  const hasAnyVerification =
    hasNationalIdVerification || hasStudentIdVerification;

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="mb-1">Profile Preview</CardTitle>
          <CardDescription>Your current profile details</CardDescription>
        </div>
        <Button
          variant="link"
          onClick={() => setActiveTab("edit")}
          className="flex items-center text-foreground"
        >
          <Pen className="size-4" />
          Edit
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center text-center mb-4">
          <div className="relative h-32 w-32 rounded-full overflow-hidden border-1 border-gray-300">
            <Image
              src={
                typeof user.profilePicture === "string" &&
                user.profilePicture.length > 0
                  ? user.profilePicture.startsWith("data:image")
                    ? user.profilePicture
                    : `data:image/png;base64,${user.profilePicture}`
                  : "/images/default-avatar.jpg"
              }
              alt="Profile Picture"
              fill
              className="object-cover"
              sizes="size-32"
              priority
            />
          </div>

          <h2 className="text-2xl font-bold mt-2">{fullName}</h2>
          <p className="text-muted-foreground">{user.email}</p>

          <div className="mt-2 flex items-center gap-2">
            {hasNationalIdVerification &&
              getVerificationStatusBadge("verified", "national")}
            {hasStudentIdVerification &&
              getVerificationStatusBadge("verified", "student")}
            <div className="relative inline-flex">
              <Badge
                variant="outline"
                className="px-3 py-1 bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1.5 rounded-lg"
              >
                <Wallet className="size-4" />
                <span className="font-semibold">
                  {formatCurrency(user.balance)}
                </span>
              </Badge>
              <button
                className="absolute -right-1.5 -top-1.5 size-4 bg-primary/95 hover:bg-primary/70 text-primary-foreground rounded-full flex items-center justify-center shadow-sm transition-colors"
                aria-label="Add funds"
                title="Add funds"
                onClick={handleOpenAddFundsModal}
              >
                <Plus className="size-3" />
              </button>
            </div>
          </div>
        </div>

        <Separator className="my-2" />

        <div className="space-y-2">
          {/* Personal Details Section */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">First Name</p>
                <p className="font-medium">{user.firstName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Middle Name</p>
                <p className="font-medium">{user.middleName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Last Name</p>
                <p className="font-medium">{user.lastName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="font-medium">{user.dateOfBirth}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="font-medium">{user.phoneNumber}</p>
              </div>

              <div className="space-y-1 md:col-span-2">
                <p className="text-sm text-muted-foreground">
                  Residence Address
                </p>
                <p className="font-medium">{user.address}</p>
              </div>
            </div>
          </div>

          <Separator className="my-2" />

          {/* Additional Details Section */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Additional Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">National ID</p>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium break-all">{user.nationalId}</p>
                  {hasNationalIdVerification &&
                    getVerificationStatusBadge("verified", "national")}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Student ID</p>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium break-all">
                    {user.studentId || <Minus className="size-4" />}
                  </p>
                  {hasStudentIdVerification &&
                    getVerificationStatusBadge("verified", "student")}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Disability Status
                </p>
                <p className="font-medium">
                  {user.disabilityStatus ? "Yes" : "No"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Revolutionary Contribution Status
                </p>
                <p className="font-medium">
                  {user?.revolutionaryContribution ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>

          {/* ID Verification Section */}
          {isLoadingImages ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
              <p className="text-sm text-muted-foreground">
                Loading ID information...
              </p>
            </div>
          ) : hasAnyVerification ? (
            <>
              <Separator className="my-2" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">ID Verification</h3>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setActiveTab("verification")}
                    className="text-sm text-foreground"
                  >
                    <span>View Details</span>
                  </Button>
                </div>

                {/* Show thumbnails of uploaded IDs */}
                <div className="grid grid-cols-2 gap-2">
                  {hasNationalIdVerification && (
                    <>
                      <div className="border rounded p-1">
                        <p className="text-xs text-muted-foreground mb-1">
                          National ID (Front)
                        </p>
                        <img
                          src={cardImages.national.front || "/placeholder.svg"}
                          alt="National ID Front"
                          className="w-full h-auto object-cover rounded"
                          style={{ maxHeight: "80px" }}
                        />
                      </div>
                      <div className="border rounded p-1">
                        <p className="text-xs text-muted-foreground mb-1">
                          National ID (Back)
                        </p>
                        <img
                          src={cardImages.national.back || "/placeholder.svg"}
                          alt="National ID Back"
                          className="w-full h-auto object-cover rounded"
                          style={{ maxHeight: "80px" }}
                        />
                      </div>
                    </>
                  )}

                  {hasStudentIdVerification && (
                    <>
                      <div className="border rounded p-1">
                        <p className="text-xs text-muted-foreground mb-1">
                          Student ID (Front)
                        </p>
                        <img
                          src={cardImages.student.front || "/placeholder.svg"}
                          alt="Student ID Front"
                          className="w-full h-auto object-cover rounded"
                          style={{ maxHeight: "80px" }}
                        />
                      </div>
                      <div className="border rounded p-1">
                        <p className="text-xs text-muted-foreground mb-1">
                          Student ID (Back)
                        </p>
                        <img
                          src={cardImages.student.back || "/placeholder.svg"}
                          alt="Student ID Back"
                          className="w-full h-auto object-cover rounded"
                          style={{ maxHeight: "80px" }}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <Separator className="my-4" />
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <h3 className="font-medium mb-1">ID Verification Required</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Please upload images of your ID card to verify your identity
                </p>
                <Button onClick={() => setActiveTab("verification")} size="sm">
                  Verify Now
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>

      <AddFundsModal
        isModalOpen={isTopUpModalOpen}
        setIsModalOpen={setIsTopUpModalOpen}
      />
    </Card>
  );
}

export default ProfilePreviewCard;
