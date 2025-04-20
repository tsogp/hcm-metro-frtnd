import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { UserProfileType } from "../../../types/profile";
import { Pen, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type ProfilePreviewTabProps = {
  user: UserProfileType;
  getInitials: () => string;
  setActiveTab: (value: string) => void;
};

function ProfilePreviewTab({
  user,
  getInitials,
  setActiveTab,
}: ProfilePreviewTabProps) {
  const fullName = `${user.firstName} ${
    user.middleName ? user.middleName + " " : ""
  }${user.lastName}`;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="mb-1">Profile Information</CardTitle>
          <CardDescription>Your current profile details</CardDescription>
        </div>
        <Button
          variant={"outline"}
          onClick={() => setActiveTab("edit")}
          className="flex items-center"
        >
          <Pen className="w-4 h-4" />
          Edit Profile
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center text-center mb-6">
          <Avatar className="h-24 w-24 mb-4">
            {user.profilePicture && (
              <AvatarImage src={user.profilePicture} alt={fullName} />
            )}
            <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold">{fullName}</h2>
          <p className="text-muted-foreground">{user.email}</p>

          <div className="mt-4 flex items-center">
            <Badge
              variant="outline"
              className="px-3 py-1 bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1.5 rounded-lg"
            >
              <Wallet className="h-4 w-4" />
              <span className="font-semibold">
                ${user.balance.toFixed(2)}
              </span>
            </Badge>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
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

          <Separator className="my-4" />

          {/* Additional Details Section */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Additional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">National ID</p>
                <p className="font-medium">{user.nationalId}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Student ID</p>
                <p className="font-medium">
                  {user.studentId || "Not provided"}
                </p>
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
                  {user.revolutionaryContribution ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfilePreviewTab;
