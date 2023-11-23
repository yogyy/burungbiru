import React from "react";
import { BellIcon, HomeIcon, MessageIcon, SearchIcon } from "../icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "~/lib/utils";
import { CreatePostModal } from "../modal/create-post-modal";

import { useScroll } from "~/hooks/use-scroll";
import { useAuth } from "@clerk/nextjs";

const mobileNavbar = [
  { name: "Home", icon: HomeIcon, link: "/" },
  { name: "Search", icon: SearchIcon, link: "#srch" },
  { name: "Notification", icon: BellIcon, link: "#notif" },
  { name: "Message", icon: MessageIcon, link: "#msg" },
];

export const MobileNav = () => {
  const r = useRouter();
  const arrOfRoute = r.route.split("/");
  const baseRoute = "/" + arrOfRoute[1];
  const show = useScroll();
  const { isSignedIn } = useAuth();

  return r.pathname !== "/" ? null : (
    <header
      className={cn(
        "fixed z-30 block w-full overflow-hidden border-t bg-background transition-all duration-300 min-[570px]:hidden",
        !show ? "-bottom-14 opacity-0" : "bottom-0 opacity-100"
      )}
    >
      <div className="">
        <nav className="relative">
          <ul className="flex items-center justify-between">
            {mobileNavbar.map((nav) => (
              <li
                key={nav.name}
                className="my-1 flex flex-1 items-center justify-center"
              >
                <Link
                  href={nav.link}
                  className="rounded-full p-2 hover:bg-white/5"
                >
                  <nav.icon
                    size={26.25}
                    className={cn(
                      baseRoute === nav.link && "w-6 fill-current stroke-none"
                    )}
                  />
                  <span className="sr-only">{nav.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          {isSignedIn ? (
            <CreatePostModal
              className={cn(
                "fixed right-2 z-30 transition-all duration-500 min-[570px]:hidden",
                !show ? "-bottom-16 opacity-0" : "bottom-16 opacity-100"
              )}
            />
          ) : null}
        </nav>
      </div>
    </header>
  );
};
