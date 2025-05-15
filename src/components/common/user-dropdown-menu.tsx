"use client";

import { useEffect, useState } from "react";
import {
  User,
  LogOut,
  Pen,
  Wallet,
  SquareUserRound,
  UserPen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/store/user-store";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes";
import Image from "next/image";
import { useCartStore } from "@/store/cart-store";

export function UserDropdownMenu() {
  const { currentUser, logout } = useUserStore();
  const { clearCart } = useCartStore();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const fullName = `${currentUser?.passengerFirstName} ${currentUser?.passengerMiddleName} ${currentUser?.passengerLastName}`;

  const handleLogoutClicked = () => {
    logout();
    clearCart();
    setOpen(false);
    router.push(ROUTES.LANDING);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full overflow-hidden border-1 border-gray-300"
        >
          <Image
            src={
              typeof currentUser?.profilePicture === "string" &&
              currentUser?.profilePicture.length > 0
                ? currentUser?.profilePicture.startsWith("data:image")
                  ? currentUser?.profilePicture
                  : `data:image/png;base64,${currentUser?.profilePicture}`
                : "/images/default-avatar.jpg"
            }
            alt="Profile Picture"
            fill
            priority
            sizes="size-8"
            className="object-cover"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {fullName ?? "GUEST"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentUser?.passengerEmail ?? ""}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer hover:text-white [&_svg]:!text-black hover:[&_svg]:!text-white"
          onClick={() => {
            router.push(ROUTES.PROFILE.ROOT);
          }}
        >
          <UserPen className="mr-2 h-4 w-4" />
          <span>My Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer hover:text-white [&_svg]:!text-black hover:[&_svg]:!text-white"
          onClick={() => {
            window.location.href = "/wallet";
          }}
        >
          <Wallet className="mr-2 h-4 w-4" />
          <span>Wallet</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer hover:text-white [&_svg]:!text-black hover:[&_svg]:!text-white"
          onClick={() => {
            handleLogoutClicked();
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
