import { TbDots } from "react-icons/tb";
import { useMediaQuery } from "usehooks-ts";
import { useUserPopover } from "~/hooks/store";
import { PopoverArrow, Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { LogoutModal } from "./modal/logout-modal";
import { authClient } from "~/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const NavbarLogout = () => {
  const { data, isPending } = authClient.useSession();
  const { show, setShow } = useUserPopover();
  const showUserPopover = useMediaQuery("(min-width: 570px)");

  if (isPending || !showUserPopover) return null;

  return (
    <div className="my-3 flex w-full items-center justify-center place-self-end overflow-hidden">
      <Popover open={show && showUserPopover} onOpenChange={setShow}>
        <PopoverTrigger className="flex w-full justify-center">
          <div className="flex w-fit items-center p-2.5 transition-all duration-300 hover:cursor-pointer hover:rounded-full hover:bg-border/30 xl:w-full">
            <div className="flex h-full w-full justify-between">
              <div className="flex items-center overflow-hidden">
                <div className="h-10 w-10 flex-shrink-0">
                  <Avatar>
                    <AvatarImage
                      src={data?.user.image!}
                      alt={`${data?.user.username}'s profile pic`}
                    />
                    <AvatarFallback className="bg-secondary font-semibold text-primary">
                      {data?.user.username?.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="hidden h-[41.06px] w-max overflow-hidden xl:flex">
                  <div className="mx-3 flex flex-col items-start overflow-hidden">
                    <span className="relative flex w-max break-words text-base font-semibold leading-5">
                      {data?.user.name}
                    </span>
                    <span className="font-thin leading-5 text-accent">
                      {`@${data?.user.username}`}
                    </span>
                  </div>
                </div>
              </div>
              <div className="hidden place-items-end items-center xl:flex">
                <TbDots size={18.75} className="place-content-end text-xl" />
              </div>
            </div>
          </div>
          <span className="sr-only">user menu</span>
        </PopoverTrigger>
        <PopoverContent
          align="center"
          alignOffset={-20}
          className="data-[side=bottom] sm:data-[align=center] relative z-10 px-0 py-3.5 font-sans text-[15px] leading-5 text-foreground/90 shadow-x"
        >
          <LogoutModal>
            <Button
              variant="ghost"
              className="h-full w-full justify-normal rounded-none hover:bg-[rgb(22,24,28)]"
            >
              {`Log Out @${data?.user.username}`}
            </Button>
          </LogoutModal>
          <PopoverArrow className="h-2" />
        </PopoverContent>
      </Popover>
    </div>
  );
};
