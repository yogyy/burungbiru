import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { GoGear } from "react-icons/go";

import { UserResource } from "@clerk/types/dist";
import { UserAvatar } from "../avatar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { cn } from "~/lib/utils";

import { SignInButton } from "@clerk/nextjs";

import { Button } from "../ui/button";
import { BurgerMenuItem } from "../burger-menu-item";
import { useBurgerMenu } from "~/hooks/store";

export const BurgerMenu: React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    user: UserResource | null | undefined;
    isSignedIn: boolean | undefined;
  }
> = ({ user, isSignedIn, className, ...props }) => {
  const { show, setShow } = useBurgerMenu();

  if (!user) return null;

  return (
    <div
      className={cn(
        "sticky top-0 z-[25] flex h-[53px] items-center justify-between px-4",
        className
      )}
      {...props}
    >
      {isSignedIn ? (
        <Sheet open={show} onOpenChange={setShow}>
          <SheetTrigger className="rounded-full" disabled={!isSignedIn}>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.imageUrl} alt={`@${user?.username}`} />
              <AvatarFallback className="bg-background text-primary">
                {user?.username?.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="hide-scrollbar min-w-[280px] max-w-[70%] overflow-y-scroll border-r-0 p-0 shadow-sm duration-100 [&>button]:hidden"
          >
            <SheetHeader className="text-left">
              <SheetTitle className="p-4 text-base leading-5  ">
                <div className="w-fit">
                  <UserAvatar
                    profileImg={user?.imageUrl}
                    username={user?.username}
                  />
                </div>
                <div className="mt-2">
                  <Link
                    className="flex items-start break-words text-base font-bold outline-none focus-within:underline hover:underline"
                    href={`/${user?.username}`}
                  >
                    {`${user?.firstName} ${
                      user?.lastName !== null ? user?.lastName : ""
                    }`}
                  </Link>
                  <Link
                    className="flex font-thin text-accent outline-none"
                    href={`/${user?.username}`}
                  >
                    {" "}
                    {`@${user?.username}`}
                  </Link>
                </div>
                <div className="mt-3 flex justify-start gap-2 text-[14px] text-base font-medium leading-4 text-foreground">
                  <p>
                    ? <span className="font-normal text-accent">Following</span>
                  </p>
                  <p>
                    ??{" "}
                    <span className="font-normal text-accent">Followers</span>
                  </p>
                </div>
              </SheetTitle>
              <SheetDescription asChild>
                <BurgerMenuItem user={user} />
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ) : (
        <Button
          asChild
          className="p-2 text-xs font-semibold xl:min-h-[52px] xl:w-full xl:min-w-[52px] xl:text-base"
        >
          <SignInButton mode="modal" />
        </Button>
      )}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 focus-visible:bg-white/10">
              <GoGear className="h-5 w-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            className="rounded-none border-none bg-[#495A69] p-1 text-xs text-white"
          >
            Timeline Settings
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
