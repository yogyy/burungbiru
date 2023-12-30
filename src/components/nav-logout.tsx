import React from "react";
import {
  PopoverArrow,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import Image from "next/image";
import { TbDots } from "react-icons/tb";
import { Button } from "./ui/button";
import { cn } from "~/lib/utils";
import { LogoutModal } from "./modal/logout-modal";
import { useUserPopover } from "~/hooks/store";
import { getCurrentUser } from "~/hooks/query";

export const NavbarLogout: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  const { show, setShow } = useUserPopover();
  const { data: user } = getCurrentUser();

  return (
    <div
      className={cn(
        "my-3 flex w-full items-center justify-center place-self-end",
        className
      )}
      {...props}
    >
      <Popover open={show} onOpenChange={setShow}>
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
                        {user?.name}
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
          <span className="sr-only">user menu</span>
        </PopoverTrigger>
        <PopoverContent
          align="center"
          alignOffset={-20}
          className="data-[side=bottom] sm:data-[align=center] relative z-10 px-0 py-3.5 font-sans text-[15px] leading-5 text-foreground/90 shadow-x"
        >
          {user && (
            <LogoutModal>
              <Button
                variant="ghost"
                className={cn(
                  "h-full w-full justify-normal rounded-none hover:bg-[rgb(22,24,28)]"
                )}
              >
                Log Out @{user?.username}
              </Button>
            </LogoutModal>
          )}
          <PopoverArrow className="h-2" />
        </PopoverContent>
      </Popover>
    </div>
  );
};
