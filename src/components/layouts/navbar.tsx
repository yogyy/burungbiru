import React from "react";

import { useUser, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "~/lib/utils";

import { Button } from "../ui/button";
import { Tweet } from "../icons";
import { navbarLink } from "~/constant";
import Logo from "../icons/navbar-icon/logo.svg";
import { NavbarLogout } from "../nav-logout";

const Navbar = () => {
  const { user, isSignedIn } = useUser();

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
                className={cn(
                  "flex w-full justify-center py-0.5 xl:justify-start",
                  link.title === "Lists" && "hidden md:flex",
                  link.title === "Communities" && "hidden lg:flex",
                  link.title === "Premium" && "hidden xl:flex"
                )}
              >
                <Link
                  className={cn(
                    "-ml-0.5 flex w-fit items-center rounded-full border-2 border-transparent p-3 outline-none transition duration-200 ease-in-out",
                    "hover:bg-border/30 focus-visible:border-foreground focus-visible:hover:bg-background"
                  )}
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
      <NavbarLogout user={user} />
    </div>
  );
};

export default Navbar;
