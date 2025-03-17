import Link from "next/link";
import { useRouter } from "next/router";
import { cn, featureNotReady } from "~/lib/utils";
import { navbarLink } from "~/constant";
import { NavbarLogout } from "../nav-logout";
import { CreatePostModal } from "../modal/create-post-modal";
import { MenuNavbarButton } from "../menu-button";
import { authClient } from "~/lib/auth-client";
import { Logo } from "../icons/logo";

export const Navbar = () => {
  const { data } = authClient.useSession();
  let r = useRouter();
  const arrOfRoute = r.route.split("/");
  const baseRoute = "/" + arrOfRoute[1];

  return (
    <header className="relative hidden min-[570px]:flex">
      <div className="sticky top-0 flex h-screen w-[68px] flex-col items-start justify-between px-2 md:w-[88px] xl:w-[275px]">
        <div className="flex w-full flex-col">
          <div className="mt-1 flex h-fit w-full justify-center self-stretch xl:w-fit">
            <Link
              href="/home"
              className="rounded-full border border-transparent p-2.5 transition-colors duration-300 hover:bg-border/30"
            >
              <Logo size={27} />
              <span className="sr-only">logo</span>
            </Link>
          </div>
          {data && (
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
                    {!link.link ? (
                      <button
                        onClick={() =>
                          featureNotReady("navbar-menu", "This feature won't be implemented")
                        }
                        className={cn(
                          "-ml-0.5 flex w-fit items-center rounded-full border-2 border-transparent p-3 outline-none transition duration-200 ease-in-out",
                          "grayscale hover:bg-border/30 focus-visible:border-foreground focus-visible:hover:bg-background"
                        )}
                      >
                        <link.icon size={26.25} />
                        <p className="ml-5 mr-4 hidden text-xl leading-6 tracking-wide xl:block">
                          {link.name}
                        </p>
                      </button>
                    ) : (
                      <Link
                        className={cn(
                          "-ml-0.5 flex w-fit items-center rounded-full border-2 border-transparent p-3 outline-none transition duration-200 ease-in-out",
                          "hover:bg-border/30 focus-visible:border-foreground focus-visible:hover:bg-background"
                        )}
                        onClick={(e) => (!data?.user ? e.preventDefault() : null)}
                        href={link.link === "/profile" ? `/p/${data?.user.username}` : link.link}
                      >
                        <link.icon size={26.25} />
                        <p
                          className={cn(
                            "ml-5 mr-4 hidden text-xl leading-6 tracking-wide xl:block",
                            baseRoute === link.link && "font-bold"
                          )}
                        >
                          {link.name}
                        </p>
                      </Link>
                    )}
                  </li>
                ))}
                <li className="flex w-full justify-center py-0.5 xl:justify-start">
                  <MenuNavbarButton />
                </li>
              </ul>
            </nav>
          )}
          {data && (
            <div className="my-1 flex w-full items-center justify-center xl:w-[90%] 2xl:my-4">
              {data.user && <CreatePostModal />}
            </div>
          )}
        </div>
        {data ? <NavbarLogout /> : null}
      </div>
    </header>
  );
};
