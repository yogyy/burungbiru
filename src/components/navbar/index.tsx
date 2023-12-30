import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "~/lib/utils";
import { BsTwitterX } from "react-icons/bs";
import { navbarLink } from "~/constant";
import { NavbarLogout } from "../nav-logout";
import { CreatePostModal } from "../modal";
import { MenuNavbarButton } from "../menu-button";
import { getCurrentUser } from "~/hooks/query";

export const Navbar = () => {
  const { data: user } = getCurrentUser();

  let r = useRouter();
  const arrOfRoute = r.route.split("/");
  const baseRoute = "/" + arrOfRoute[1];

  return (
    <header className="relative hidden min-[570px]:flex">
      <div className="sticky top-0 flex h-screen w-[68px] flex-col items-start justify-between px-2 md:w-[88px] xl:w-[275px]">
        <div className="flex w-full flex-col">
          <div className="mt-1 flex h-fit w-full justify-center self-stretch xl:w-fit">
            <Link
              href="/"
              className="rounded-full border border-transparent p-2.5 transition-colors duration-300 hover:bg-border/30"
            >
              <BsTwitterX size={27} className="fill-current" />
              <span className="sr-only">logo</span>
            </Link>
          </div>
          <nav className="mb-1 mt-0.5 flex w-full flex-col items-center">
            <ul className="flex w-full flex-col">
              {navbarLink.map((link) => (
                <li
                  key={link.name}
                  className={cn(
                    "flex w-full justify-center py-0.5 xl:justify-start",
                    link.name === "Lists" && "hidden md:flex",
                    link.name === "Communities" && "hidden lg:flex",
                    link.name === "Premium" && "hidden xl:flex"
                  )}
                >
                  <Link
                    className={cn(
                      "-ml-0.5 flex w-fit items-center rounded-full border-2 border-transparent p-3 outline-none transition duration-200 ease-in-out",
                      "hover:bg-border/30 focus-visible:border-foreground focus-visible:hover:bg-background"
                    )}
                    onClick={(e) => (!user ? e.preventDefault() : null)}
                    href={
                      link.link === "/profile"
                        ? `/@${user?.username}`
                        : link.link
                    }
                  >
                    <link.icon size={26.25} />
                    <span
                      className={cn(
                        "ml-5 mr-4 hidden text-xl leading-6 tracking-wide xl:block",
                        baseRoute === link.link && "font-bold"
                      )}
                    >
                      <p>{link.name}</p>
                    </span>
                  </Link>
                </li>
              ))}
              <li className="flex w-full justify-center py-0.5 xl:justify-start">
                <MenuNavbarButton />
              </li>
            </ul>
          </nav>
          <div className="my-1 flex w-full items-center justify-center xl:w-[90%] 2xl:my-4">
            {user && <CreatePostModal />}
          </div>
        </div>
        <NavbarLogout />
      </div>
    </header>
  );
};
