import React from "react";
import {
  LuBell,
  LuHome,
  LuLeaf,
  LuLogOut,
  LuMail,
  LuSearch,
  LuTwitter,
} from "react-icons/lu";
import { UserButton, SignIn, SignedOut, useUser } from "@clerk/nextjs";
import { useClerk } from "@clerk/clerk-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "~/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import Image from "next/image";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { Button } from "../button";
import { Button as BtnShadcn } from "../ui/button";
import { DropdownMenuDemo } from "./dropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useMediaQuery } from "~/hooks/use-media-q";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const navLinks = [
  { id: 1, title: "Home", icon: LuBell, link: "/" },
  { id: 2, title: "Explore", icon: LuSearch, link: "#explore" },
  { id: 3, title: "Notifications", icon: LuBell, link: "#notifications" },
  { id: 4, title: "Messages", icon: LuMail, link: "#messages" },
];

const Navbar = () => {
  const { user } = useUser();
  const { signOut } = useClerk();

  let r = useRouter();
  const matches = useMediaQuery("(min-width: 1280px)");

  return (
    <div className="navbar">
      <nav className="side-nav">
        <div className="flex w-full flex-col items-center px-2">
          <ul className="">
            <li>
              <div>
                <Link href="/" className="nav-links">
                  <LuTwitter className=" w-7 fill-[#D6D9DB] text-3xl" />
                </Link>
              </div>
            </li>
            {navLinks.map((link) => (
              <li key={link.id}>
                <div>
                  <Link className="nav-links" href={link.link}>
                    <span className="text-2xl">
                      <link.icon
                        className={cn(
                          r.asPath === link.link && "fill-[#F1F5F9]"
                        )}
                      />
                    </span>
                    <span className="mx-3 hidden text-xl xl:block">
                      <p>{link.title}</p>
                    </span>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex w-full justify-center">
            {matches ? (
              <Button className="mt-3 w-10/12">Tweet</Button>
            ) : (
              <BtnShadcn className="mt-3 flex h-auto w-fit items-center rounded-full bg-[#1D9BF0] p-3 transition-all duration-300 hover:bg-[#1D9BF0]/80 focus-visible:bg-[#1D9BF0]/80">
                <LuLeaf className="text-xl" />
              </BtnShadcn>
            )}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex w-fit items-center p-3 transition-all duration-300 hover:cursor-pointer hover:rounded-full hover:bg-border/30 lg:w-full">
              {user && (
                <div className="flex h-full w-full justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10">
                      <Image
                        src={user?.profileImageUrl}
                        alt={user.firstName || user.username || user.fullName!}
                        height={40}
                        width={40}
                        className="rounded-full"
                      />
                    </div>
                    <div className="hidden xl:flex">
                      <div className="mx-3 flex flex-col text-[15px]">
                        <span className="font-semibold">{user?.fullName}</span>
                        <span className="font-thin">@{user?.username}</span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden place-items-end items-center xl:flex">
                    <BiDotsHorizontalRounded className="place-content-end text-xl" />
                  </div>
                </div>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-dark">
            <DropdownMenuLabel>Add an existing account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LuLogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </div>
  );
};

export default Navbar;
