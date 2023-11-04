import React from "react";
import { Bell, Home, Message, Search } from "../icons/navbar-icon";
import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "~/lib/utils";

const mobileNavbar = [
  { name: "Home", icon: Home, link: "/" },
  { name: "Search", icon: Search, link: "/#search" },
  { name: "Notification", icon: Bell, link: "/#search" },
  { name: "Message", icon: Message, link: "/#search" },
];

export const MobileNav = () => {
  const r = useRouter();
  const arrOfRoute = r.route.split("/");
  const baseRoute = "/" + arrOfRoute[1];
  return (
    <header className="fixed bottom-0 z-30 block w-full overflow-hidden bg-background min-[555px]:hidden">
      <nav>
        <ul className="flex items-center justify-between">
          {mobileNavbar.map((nav) => (
            <li className="my-1 flex flex-1 items-center justify-center">
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
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};
