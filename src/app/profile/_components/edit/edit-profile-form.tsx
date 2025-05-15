"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/input/password-input";
import { Input } from "@/components/ui/input";
import { Camera, Trash } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { type ProfileFormValues } from "@/schemas/profile";

import Image from "next/image";
import { useEffect, useState } from "react";
import { UserProfileType } from "@/types/profile";

interface EditProfileFormProps {
  user: UserProfileType;
  editProfileForm: UseFormReturn<ProfileFormValues>;
  onSubmit: (data: ProfileFormValues) => void;
  hasFormChanges: () => boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleReset: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  previewUrl: string | null;
  handleUploadClick: () => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: () => void;
  showRemoveButton: boolean | "" | null;
  isSubmitting: boolean;
}

function EditProfileForm({
  user,
  editProfileForm,
  onSubmit,
  hasFormChanges,
  handleReset,
  previewUrl,
  handleUploadClick,
  handleInputChange,
  isSubmitting,
  fileInputRef,
  handleImageChange,
  handleRemoveImage,
  showRemoveButton,
}: EditProfileFormProps) {
  const [imageSrc, setImageSrc] = useState(
    previewUrl || user?.profilePicture || "/images/default-avatar.jpg"
  );

  useEffect(() => {
    setImageSrc(
      previewUrl || user?.profilePicture || "/images/default-avatar.jpg"
    );
  }, [previewUrl, user?.profilePicture]);

  return (
    <Form {...editProfileForm}>
      <form
        onSubmit={editProfileForm.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {/* Profile Picture */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Profile Picture</h3>
          <div className="flex flex-col items-center space-y-4">
            <div className="relative h-32 w-32 rounded-full overflow-hidden border-1 border-gray-300">
              {typeof imageSrc === "string" && imageSrc.startsWith("blob:") ? (
                <img
                  src={imageSrc}
                  alt="Profile Picture"
                  className="object-cover w-full h-full"
                  onError={() => setImageSrc("/images/default-avatar.jpg")}
                />
              ) : (
                <Image
                  src={
                    typeof imageSrc === "string" && imageSrc.length > 0
                      ? imageSrc.startsWith("data:image") ||
                        imageSrc.startsWith("/") ||
                        imageSrc.startsWith("http")
                        ? imageSrc
                        : `data:image/png;base64,${imageSrc}`
                      : "/images/default-avatar.jpg"
                  }
                  alt="Profile Picture"
                  fill
                  className="object-cover"
                  onError={() => setImageSrc("/images/default-avatar.jpg")}
                  sizes="128px"
                  priority={imageSrc === "/images/default-avatar.jpg"}
                />
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleUploadClick}
              >
                <Camera className="mr-2 h-4 w-4" /> Upload Photo
              </Button>
              {showRemoveButton && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveImage}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash className="mr-2 h-4 w-4" /> Remove
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Supported formats: JPG, PNG, GIF. Max size: 5MB
            </p>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Account Details */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Account Details</h3>
          <div className="space-y-4">
            {["email", "password", "confirmPassword"].map((fieldName) => (
              <FormField
                key={fieldName}
                control={editProfileForm.control}
                name={fieldName as keyof ProfileFormValues}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {fieldName === "email"
                        ? "Email Address"
                        : fieldName === "password"
                        ? "New Password"
                        : "Confirm New Password"}
                    </FormLabel>

                    <FormControl>
                      {fieldName === "email" ? (
                        <Input
                          type="email"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleInputChange(e);
                          }}
                        />
                      ) : (
                        <PasswordInput
                          placeholder={`Enter ${fieldName}`}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleInputChange(e);
                          }}
                        />
                      )}
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground">
                      {fieldName == "password" || fieldName == "confirmPassword"
                        ? "Leave this field blank to keep current password"
                        : ""}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        <Separator className="my-2" />

        {/* Personal Details */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Personal Details</h3>
          <div className="space-y-4">
            {["phoneNumber", "address"].map((fieldName) => (
              <FormField
                key={fieldName}
                control={editProfileForm.control}
                name={fieldName as keyof ProfileFormValues}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {fieldName === "phoneNumber"
                        ? "Phone Number"
                        : "Residence Address"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleInputChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <FormField
              control={editProfileForm.control}
              name={"studentId" as keyof ProfileFormValues}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student ID</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter your student ID"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleInputChange(e);
                      }}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    This field is optional
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="pt-4 flex justify-between">
          <Button
            type="button"
            variant="outline"
            className="w-[calc(50%-8px)]"
            onClick={handleReset}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-[calc(50%-8px)]"
            disabled={isSubmitting || !hasFormChanges()}
          >
            {isSubmitting ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default EditProfileForm;
