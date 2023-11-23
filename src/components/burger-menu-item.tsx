import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { hamburgerNavbarLink } from "~/constant";
import { cn } from "~/lib/utils";
import Link from "next/link";
import { AdsIcon, LogOutIcon, AnalyticIcon } from "./icons";
import { UserResource } from "@clerk/types/dist";
import { LogoutModal } from "./modal/logout-modal";
import { GoGear } from "react-icons/go";

export const BurgerMenuItem: React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    user: UserResource | null | undefined;
  }
> = ({ user, ...props }) => {
  return (
    <div {...props}>
      <ul className="flex w-full flex-col">
        {hamburgerNavbarLink.map((link) => (
          <li
            key={link.name}
            className={cn("flex w-full justify-start py-0.5")}
          >
            <Link
              className={cn(
                "flex w-full items-center border-2 border-transparent p-3 outline-none transition duration-200 ease-in-out",
                "hover:bg-border/30 focus-visible:border-primary focus-visible:bg-white/[.03]"
              )}
              href={
                link.link === "/profile" ? `/@${user?.username}` : link.link
              }
            >
              <link.icon
                className={cn("w-6 fill-current stroke-none")}
                title={link.name}
              />
              <span
                className={cn(
                  "ml-5 mr-4 text-xl font-semibold leading-6 tracking-wide"
                )}
              >
                <p>{link.name}</p>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Accordion
        type="multiple"
        className="text-[18px] font-semibold leading-5"
      >
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger className="p-4">Creator Studio</AccordionTrigger>
          <AccordionContent asChild className="pb-0">
            <button className="flex w-full items-center p-4 hover:bg-border/30 focus-visible:border-primary focus-visible:bg-white/[.03]">
              <AnalyticIcon size="18.75" className="mr-3 fill-current" />
              Analytic
            </button>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" className="border-none">
          <AccordionTrigger className="p-4">
            Professional Tools
          </AccordionTrigger>
          <AccordionContent className="p-0">
            <button className="flex w-full items-center p-4 hover:bg-border/30 focus-visible:border-primary focus-visible:bg-white/[.03]">
              <AdsIcon className="mr-3 fill-current" size="18.75" />
              Ads
            </button>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3" className="border-none">
          <AccordionTrigger className="p-4">
            Settings and Support
          </AccordionTrigger>
          <AccordionContent className="p-0 duration-0">
            <button className="flex w-full p-4 hover:bg-border/30 focus-visible:border-primary focus-visible:bg-white/[.03]">
              <GoGear size="18.75" className="mr-3" />
              Settings and privacy
            </button>
            <LogoutModal user={user}>
              <button className="flex w-full p-4 hover:bg-border/30 focus-visible:border-primary focus-visible:bg-white/[.03]">
                <LogOutIcon size="18.75" className="mr-3" />
                Log Out @{user?.username}
              </button>
            </LogoutModal>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
