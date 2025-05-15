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
import { Pen, Wallet, ShieldCheck, FileText, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { UserProfileType } from "@/types/profile";

type ProfilePreviewCardProps = {
  user: UserProfileType;
  setActiveTab: (value: string) => void;
};

function ProfilePreviewCard({ user, setActiveTab }: ProfilePreviewCardProps) {
  const fullName = `${user.firstName} ${user.middleName} ${user.lastName}`;
  
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
            Verified
          </Badge>
        );
      default:
        return null;
    }
  };

  const hasNationalIdVerification =
    user.idVerification?.national.front && user.idVerification?.national.back;
  const hasStudentIdVerification =
    user.idVerification?.student.front && user.idVerification?.student.back;

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
          variant={"outline"}
          onClick={() => setActiveTab("edit")}
          className="flex items-center"
        >
          <Pen className="w-4 h-4 mr-2" />
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
            />
          </div>

          <h2 className="text-2xl font-bold mt-2">{fullName}</h2>
          <p className="text-muted-foreground">{user.email}</p>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            <Badge
              variant="outline"
              className="px-3 py-1 bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1.5 rounded-lg"
            >
              <Wallet className="h-4 w-4" />
              <span className="font-semibold">${user.balance.toFixed(2)}</span>
            </Badge>

            {/* Show verification status badges if available */}
            {hasNationalIdVerification &&
              getVerificationStatusBadge(
                user.idVerification?.national.status || null
              )}
            {hasStudentIdVerification &&
              getVerificationStatusBadge(
                user.idVerification?.student.status || null
              )}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">National ID</p>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{user.nationalId}</p>
                  {hasNationalIdVerification &&
                    getVerificationStatusBadge(
                      user.idVerification?.national.status || null
                    )}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Student ID</p>
                <div className="flex items-center gap-2">
                  <p className="font-medium">
                    {user.studentId || <Minus className="size-4" />}
                  </p>
                  {hasStudentIdVerification &&
                    getVerificationStatusBadge(
                      user.idVerification?.student.status || null
                    )}
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
          {hasAnyVerification && (
            <>
              <Separator className="my-4" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">ID Verification</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab("verification")}
                    className="text-sm"
                  >
                    View Details
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
                          src={user.idVerification?.national.front || ""}
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
                          src={user.idVerification?.national.back || ""}
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
                          src={user.idVerification?.student.front || ""}
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
                          src={user.idVerification?.student.back || ""}
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
          )}

          {/* ID Verification CTA if no verification */}
          {!hasAnyVerification && (
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
    </Card>
  );
}

export default ProfilePreviewCard;
