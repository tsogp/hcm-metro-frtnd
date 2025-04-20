import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import React, { useRef } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/input/password-input";
import { Input } from "@/components/ui/input";
import { Camera, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserProfileType } from "../../../types/profile";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { profileFormSchema, ProfileFormValues } from "../../../schema/profile";

interface EditProfileTabProps {
  user: UserProfileType;
  handleSubmit: (e: React.FormEvent) => void;
  previewUrl: string | null;
  getInitials: () => string;
  formData: ProfileFormValues;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  setFormData: (value: any) => void;
  setSelectedImage: (selectedImage: File | null) => void;
  setPreviewUrl: (previewUrl: string | null) => void;
  setActiveTab: (value: string) => void;
  isSubmitting: boolean;
}

function EditProfileTab({
  user,
  handleSubmit: onSubmitForm,
  previewUrl,
  getInitials,
  formData,
  handleInputChange,
  setFormData,
  setSelectedImage,
  setPreviewUrl,
  setActiveTab,
  isSubmitting,
}: EditProfileTabProps) {
  const fullName = `${user.firstName} ${
    user.middleName ? user.middleName + " " : ""
  }${user.lastName}`;

  const defaultFormValues = {
    email: user.email,
    password: "",
    confirmPassword: "",
    phoneNumber: user.phoneNumber,
    address: user.address,
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const editProfileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: defaultFormValues,
  });

  const onSubmit = (data: ProfileFormValues) => {
    // Update form data
    setFormData({
      ...formData,
      ...data,
    });

    // Call the original submit handler
    const event = { preventDefault: () => {} } as React.FormEvent;
    onSubmitForm(event);
  };

  // Check if any form values have changed from the default values
  const hasFormChanges = () => {
    const currentValues = editProfileForm.getValues();

    // Check if any editable field has changed
    return (
      currentValues.email !== defaultFormValues.email ||
      currentValues.phoneNumber !== defaultFormValues.phoneNumber ||
      currentValues.address !== defaultFormValues.address ||
      currentValues.password !== "" ||
      currentValues.confirmPassword !== "" ||
      previewUrl !== user.profilePicture
    );
  };

  const handleReset = () => {
    editProfileForm.reset(defaultFormValues);

    setFormData({
      ...formData,
      ...defaultFormValues,
    });

    setSelectedImage(null);
    setPreviewUrl(user.profilePicture);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setActiveTab("preview");
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      setSelectedImage(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Determine if we should show the remove button
  // Only show it if there's a preview URL that's different from the user's profile picture
  const showRemoveButton = previewUrl && previewUrl !== user.profilePicture;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>Update your profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...editProfileForm}>
          <form
            onSubmit={editProfileForm.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div>
              <h3 className="font-semibold text-lg mb-4">Profile Picture</h3>
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    {previewUrl ? (
                      <AvatarImage src={previewUrl} alt="Profile preview" />
                    ) : user.profilePicture ? (
                      <AvatarImage src={user.profilePicture} alt={fullName} />
                    ) : (
                      <AvatarImage
                        src="/placeholder.svg?height=128&width=128"
                        alt="Default avatar"
                      />
                    )}
                    <AvatarFallback className="text-2xl">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
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
                    className="flex items-center"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Upload Photo
                  </Button>

                  {showRemoveButton && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveImage}
                      className="flex items-center text-red-500 hover:text-red-600"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  )}
                </div>

                <p className="text-xs text-muted-foreground">
                  Supported formats: JPG, PNG, GIF. Max size: 5MB
                </p>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Account Details Section */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Account Details</h3>
              <div className="space-y-4">
                <FormField
                  control={editProfileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
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

                <FormField
                  control={editProfileForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        New Password (leave blank to keep current)
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          {...field}
                          placeholder="Enter new password"
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

                <FormField
                  control={editProfileForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          {...field}
                          placeholder="Confirm new password"
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
              </div>
            </div>

            <Separator className="my-4" />

            {/* Personal Details Section */}
            <div className="my-4">
              <h3 className="font-semibold text-lg mb-4">Personal Details</h3>
              <div className="space-y-4">
                <FormField
                  control={editProfileForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
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

                <FormField
                  control={editProfileForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Residence Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
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
      </CardContent>
    </Card>
  );
}

export default EditProfileTab;
