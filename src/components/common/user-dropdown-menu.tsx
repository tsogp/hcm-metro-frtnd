"use client";

import { useState } from "react";
import { User, LogOut, Pen, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserStore } from "@/store/user-store";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes";

export function UserDropdownMenu() {
  const { logout } = useUserStore();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/images/default-avatar.jpg" alt="User" />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">User</p>
            <p className="text-xs leading-none text-muted-foreground">
              user@example.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer hover:text-white [&_svg]:!text-black hover:[&_svg]:!text-white"
          onClick={() => {
            window.location.href = "/profile";
          }}
        >
          <Pen className="mr-2 h-4 w-4" />
          <span>Edit Profile</span>
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
            logout();
            setOpen(false);
            router.push(ROUTES.LANDING);
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
