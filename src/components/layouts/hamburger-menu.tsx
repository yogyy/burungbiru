import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { GoGear } from "react-icons/go";
import { UserAvatar } from "../avatar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { useBurgerMenu } from "~/hooks/store";
import { hamburgerNavbarLink } from "~/constant";
import { MoreNavbar } from "../navbar/more";
import { api } from "~/utils/api";
import { authClient } from "~/lib/auth-client";

interface BurgerMenuProps extends React.HTMLAttributes<HTMLDivElement> {}
export const BurgerMenu = ({ className, ...props }: BurgerMenuProps) => {
  const { show, setShow } = useBurgerMenu();
  const { data, isPending } = authClient.useSession();
  const { data: follow, isSuccess } = api.profile.userFollow.useQuery(
    {
      userId: data?.user.id!,
    },
    { enabled: !!isPending }
  );

  if (!data) return null;

  return (
    <div
      className={cn("sticky top-0 z-30 flex h-[53px] items-center justify-between px-4", className)}
      {...props}
    >
      <Sheet open={show} onOpenChange={setShow}>
        <SheetTrigger className="rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={data?.user.image!} alt={`@${data?.user.username}`} />
            <AvatarFallback className="bg-background text-primary">
              {data?.user.username.slice(0, 4)}
            </AvatarFallback>
          </Avatar>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="hide-scrollbar min-w-[280px] max-w-[70%] overflow-y-scroll border-r-0 p-0 shadow-sm duration-100 [&>button]:hidden"
        >
          <SheetHeader className="text-left">
            <SheetTitle className="p-4 text-base leading-5  ">
              <div className="w-fit">
                <UserAvatar image={data?.user.image!} username={data?.user.username} />
              </div>
              <div className="mt-2">
                <Link
                  className="flex items-start break-words text-base font-bold outline-none focus-within:underline hover:underline"
                  href={`/${data?.user.username}`}
                >
                  {data?.user.name}
                </Link>
                <Link
                  className="flex font-thin text-accent outline-none"
                  href={`/${data?.user.username}`}
                >
                  {`@${data?.user.username}`}
                </Link>
              </div>
              <div className="mt-3 flex justify-start gap-2 text-[14px] text-base font-medium leading-4 text-accent">
                <p>
                  <span className="font-bold text-[rgb(231,233,234)]">
                    {isSuccess && follow.total_following}
                    &nbsp;
                  </span>
                  Following
                </p>
                <p>
                  <span className="font-bold text-[rgb(231,233,234)]">
                    {isSuccess && follow.total_follower}
                    &nbsp;
                  </span>
                  Follower
                </p>
              </div>
            </SheetTitle>
            <SheetDescription asChild>
              <>
                <ul className="flex w-full flex-col">
                  {hamburgerNavbarLink.map((link) => (
                    <li key={link.name} className={cn("flex w-full justify-start py-0.5")}>
                      <Link
                        className={cn(
                          "flex w-full items-center border-2 border-transparent p-3 outline-none transition duration-200 ease-in-out",
                          "hover:bg-border/30 focus-visible:border-primary focus-visible:bg-white/[.03]"
                        )}
                        href={link.link === "/profile" ? `/p/${data?.user.username}` : link.link}
                      >
                        <link.icon className={cn("fill-current stroke-none")} size="24" />
                        <span
                          className={cn("ml-5 mr-4 text-xl font-semibold leading-6 tracking-wide")}
                        >
                          <p>{link.name}</p>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <MoreNavbar type="mobile" />
              </>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 focus-visible:bg-white/10">
              <GoGear className="h-5 w-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            className="rounded-none border-none bg-[#495A69] p-1 text-xs text-white"
          >
            Timeline Settings
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
