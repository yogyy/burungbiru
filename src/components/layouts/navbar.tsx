import React from "react";

import { useUser, SignInButton } from "@clerk/nextjs";
import { useClerk } from "@clerk/clerk-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "~/lib/utils";

import Image from "next/image";

import {
  PopoverArrow,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { useMediaQuery } from "~/hooks/use-media-q";
import { Button } from "../ui/button";
import { Tweet } from "../icons";
import { navbarLink } from "~/constant";
import Logo from "../icons/navbar-icon/logo.svg";
import { TbDots } from "react-icons/tb";

const Navbar = () => {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();

  let r = useRouter();
  const arrOfRoute = r.route.split("/");
  const baseRoute = "/" + arrOfRoute[1];

  return (
    <div className="sticky top-0 flex h-screen w-[68px] flex-col items-start justify-between px-2 md:w-[88px] xl:w-[275px]">
      <div className="flex w-full flex-col">
        <div className="my-0.5 flex h-fit w-full justify-center self-stretch xl:w-fit">
          <Link
            href="/"
            className="rounded-full border border-transparent p-2.5 transition-colors duration-300 hover:bg-border/30"
          >
            <Logo width="30" height="30" className="fill-current" />
            <span className="sr-only">logo</span>
          </Link>
        </div>
        <nav className="mb-1 mt-0.5 flex w-full flex-col items-center">
          <ul className="flex w-full flex-col">
            {navbarLink.map((link) => (
              <li
                key={link.title}
                className="flex w-full justify-center py-0.5 xl:justify-start"
              >
                <Link
                  className="-ml-0.5 flex w-fit items-center rounded-full border-2 border-transparent p-3 outline-none transition duration-200 ease-in-out hover:bg-border/30 focus-visible:border-foreground focus-visible:hover:bg-background"
                  href={
                    link.link === "/profile" ? `/@${user?.username}` : link.link
                  }
                >
                  <link.icon
                    className={cn(
                      baseRoute === link.link && "w-6 fill-current stroke-none"
                    )}
                  />
                  <span
                    className={cn(
                      "ml-5 mr-4 hidden text-xl leading-6 tracking-wide xl:block",
                      baseRoute === link.link && "font-bold"
                    )}
                  >
                    <p>{link.title}</p>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="my-1 flex w-full items-center justify-center xl:w-[90%] 2xl:my-4">
          {!isSignedIn ? (
            <Button
              asChild
              className="h-[50px] w-[50px] rounded-full p-0 font-semibold xl:min-h-[52px] xl:w-full xl:min-w-[52px]"
            >
              <SignInButton mode="modal" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="default"
              className="h-[50px] w-[50px] rounded-full p-0 font-semibold xl:min-h-[52px] xl:w-full xl:min-w-[52px]"
            >
              <Tweet className="block w-6 fill-foreground xl:hidden" />
              <span className="hidden text-[17px] xl:block">Post</span>
            </Button>
          )}
        </div>
      </div>
      <div className="my-3 flex w-full items-center justify-center place-self-end">
        <Popover>
          <PopoverTrigger className="w-full">
            <div className="flex w-fit items-center p-2.5 transition-all duration-300 hover:cursor-pointer hover:rounded-full hover:bg-border/30 xl:w-full">
              {user && (
                <div className="flex h-full w-full justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10">
                      <Image
                        src={user?.imageUrl}
                        alt={user.username!}
                        height={40}
                        width={40}
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
                    <TbDots
                      size={18.75}
                      className="place-content-end text-xl"
                    />
                  </div>
                </div>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent
            align="center"
            alignOffset={-20}
            className="data-[side=bottom] sm:data-[align=center] relative px-0 py-1 font-sans text-[15px] leading-5 text-foreground/90"
          >
            <Button
              variant="ghost"
              onClick={() => signOut()}
              className="h-full w-full justify-normal rounded-md hover:bg-[rgb(22,24,28)]"
            >
              Log Out @{user?.username}
            </Button>
            <PopoverArrow className="h-2 stroke-neutral-100" />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Navbar;
