import React from "react";
import { cn } from "~/lib/utils";
import Link from "next/link";
import { MenuIcon, MonetIcon } from "./icons";
import { UserResource } from "@clerk/types/dist";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { MoreNavbar } from "./navbar/more";
import * as PopoverPrimitive from "@radix-ui/react-popover";

export const MenuNavbarButton: React.FC<
  PopoverPrimitive.PopoverProps & {
    user: UserResource | null | undefined;
  }
> = ({ user, ...props }) => {
  return (
    <Popover {...props}>
      <PopoverTrigger
        className={cn(
          "-ml-0.5 flex w-fit items-center rounded-full border-2 border-transparent p-3 outline-none transition duration-200 ease-in-out",
          "hover:bg-border/30 focus-visible:border-foreground focus-visible:hover:bg-background"
        )}
      >
        <MenuIcon size={26.25} />
        <span className="ml-5 mr-4 hidden text-xl leading-6 tracking-wide xl:block">
          More
        </span>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        sideOffset={-220}
        align="start"
        className="hidden flex-col p-0 duration-0 md:flex"
      >
        <Link
          href="/#monet"
          className={cn(
            "flex w-full items-center border-2 border-transparent p-3 outline-none transition duration-200 ease-in-out",
            "hover:bg-border/30 focus-visible:border-primary focus-visible:bg-white/[.03]"
          )}
        >
          <MonetIcon className="fill-current stroke-none" size="24" />
          <span className="ml-5 mr-4 text-xl font-semibold leading-6 tracking-wide">
            Monetization
          </span>
        </Link>
        <hr className="my-0.5 w-[89%] place-items-center self-center" />
        <MoreNavbar user={user} type="dekstop" />
      </PopoverContent>
    </Popover>
  );
};
