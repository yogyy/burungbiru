import React from "react";
import {
  PopoverArrow,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import { UserResource } from "@clerk/types/dist";
import Image from "next/image";
import { TbDots } from "react-icons/tb";
import { Button } from "./ui/button";
import { BsTwitterX } from "react-icons/bs";
import { useClerk } from "@clerk/nextjs";
import { cn } from "~/lib/utils";

type NavbarLogoutType = React.HTMLAttributes<HTMLDivElement> & {
  user: UserResource | null | undefined;
};

export const NavbarLogout: React.FC<NavbarLogoutType> = ({
  user,
  className,
  ...props
}) => {
  const [modalSignOut, setModalSignOut] = React.useState(false);
  const [popoverSignOut, setPopoverSignOut] = React.useState(false);
  const { signOut } = useClerk();

  return (
    <div
      className={cn(
        "my-3 flex w-full items-center justify-center place-self-end",
        className
      )}
      {...props}
    >
      <Popover open={popoverSignOut} onOpenChange={setPopoverSignOut}>
        <PopoverTrigger className="flex w-full justify-center">
          <div className="flex w-fit items-center p-2.5 transition-all duration-300 hover:cursor-pointer hover:rounded-full hover:bg-border/30 xl:w-full">
            {user && (
              <div className="flex h-full w-full justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10">
                    <Image
                      src={user?.imageUrl}
                      alt={user.username!}
                      height="40"
                      width="40"
                      className="rounded-full"
                    />
                  </div>
                  <div className="hidden h-[41.06px] xl:flex">
                    <div className="mx-3 flex flex-col items-start">
                      <span className="text-base font-semibold leading-5">
                        {user?.fullName}
                      </span>
                      <span className="font-thin leading-5 text-accent">
                        @{user?.username}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="hidden place-items-end items-center xl:flex">
                  <TbDots size={18.75} className="place-content-end text-xl" />
                </div>
              </div>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="center"
          alignOffset={-20}
          className="data-[side=bottom] sm:data-[align=center] relative px-0 py-3.5 font-sans text-[15px] leading-5 text-foreground/90"
        >
          <Dialog open={modalSignOut} onOpenChange={setModalSignOut}>
            <DialogTrigger
              asChild
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Button
                variant="ghost"
                className="h-full w-full justify-normal rounded-md hover:bg-[rgb(22,24,28)]"
              >
                Log Out @{user?.username}
              </Button>
            </DialogTrigger>
            <DialogContent
              close={false}
              className="!rounded-2xl border-none p-8 text-start [&>button]:invisible"
              overlayClassName="bg-background/90"
            >
              <DialogHeader className="space-y-0">
                <BsTwitterX className="mb-4 h-9 w-full text-3xl" />
                <DialogTitle className="!mb-2 text-xl font-semibold tracking-normal">
                  Log out of @{user?.username}
                </DialogTitle>
                <DialogDescription asChild>
                  <div className="flex flex-col gap-6">
                    <p className="break-words font-twitter-chirp text-[15px] text-accent">
                      This will only apply to this account, and you’ll still be
                      logged in to your other accounts.
                    </p>
                    <div className="flex flex-col text-[17px] font-bold">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          signOut();
                          setModalSignOut((prev) => !prev);
                          setPopoverSignOut((prev) => !prev);
                        }}
                        className="mb-3 min-h-[44px] min-w-[44px] text-[15px]"
                      >
                        Log out
                      </Button>
                      <Button
                        variant="outline"
                        className="min-h-[44px] min-w-[44px] border-border text-[15px]"
                        onClick={() => setModalSignOut((prev) => !prev)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <PopoverArrow className="h-2 stroke-neutral-100" />
        </PopoverContent>
      </Popover>
    </div>
  );
};
