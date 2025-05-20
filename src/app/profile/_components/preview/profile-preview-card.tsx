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
import { AddFundsModal } from "./add-funds-modal";
import { formatCurrency } from "@/lib/utils";
import { getGoogleAuthLink, googleAuth, isGoogleLinked } from "@/action/auth";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useUserStore } from "@/store/user-store";
import router from "next/router";
import { ROUTES } from "@/config/routes";

type ProfilePreviewCardProps = {
  user: UserProfileType;
  setActiveTab: (value: string) => void;
};

function ProfilePreviewCard({ user, setActiveTab }: ProfilePreviewCardProps) {
  const fullName = `${user.firstName} ${user.middleName} ${user.lastName}`;
  const [cardImages, setCardImages] = useState<any>(null);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [googleLinked, setGoogleLinked] = useState(false);
  const { login, loginGoogle } = useUserStore();

  const handleOpenAddFundsModal = () => {
    setIsTopUpModalOpen(true);
  };

  const searchParams = useSearchParams();

  const code = searchParams.get("code");
  const state = searchParams.get("state");

  useEffect(() => {
    if (!code || !state) return;

    const onGoogleLoginAction = loginGoogle(code, state);

    toast.promise(onGoogleLoginAction, {
      loading: "Linking Google Account…",

      success: (res) => {
        window.history.replaceState(null, "", window.location.pathname);
        router.push(ROUTES.PROFILE.ROOT);
        return "Google account link success";
      },

      error: (e) => {
        switch (e.response?.status) {
          case 401:
            return e.response.data?.message || "Invalid Google credentials";
          case 403:
            return e.response.data?.message || "Google access denied";
          case 500:
            return e.response.data?.message || "Google auth server error";
          default:
            return e.response?.data?.message || "Google authentication failed";
        }
      },
    });
  }, [code, loginGoogle, router]);

  const handleLinkGoogle = async () => {
    try {
      const onGotLinkAction = getGoogleAuthLink();

      toast.promise(onGotLinkAction, {
        loading: "Redirecting to Google...",
        success: (url: string) => {
          window.location.replace(url);
          return "Redirecting...";
        },
        error: (e) => {
          switch (e.response.status) {
            case 401:
              return e.response.data?.message || "Invalid credentials";
            case 403:
              return e.response.data?.message || "Access denied";
            case 500:
              return e.response.data?.message || "Internal server error";
            default:
              return (
                e.response.data?.message || "Getting link from Google failed"
              );
          }
        },
      });
    } catch (e) {
      console.log(e);
    }
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

  useEffect(() => {
    const checkGoogleLinked = async () => {
      const resp = await isGoogleLinked();
      setGoogleLinked(resp.data.data.linked);
    };

    checkGoogleLinked();
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
            <button
              onClick={handleLinkGoogle}
              disabled={googleLinked}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-sm font-medium transition-colors ${
                !googleLinked
                  ? "bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
                  : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-4"
                aria-hidden="true"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              {!googleLinked ? `Link Google account` : `Google account linked`}
            </button>
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
              <div className="rounded-lg p-4 text-center">
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
