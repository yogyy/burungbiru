import React from "react";
import { RouterOutputs } from "~/utils/api";
import { BalloonIcon, CalendarIcon, LocationIcon } from "../icons";
import { RiLinkM } from "react-icons/ri";
import { getUserFollower } from "~/hooks/query";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from "~/components/ui/dialog";
import Image from "next/image";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import Link from "next/link";
import { FollowButton } from "../button-follow";
import { UserResource } from "@clerk/types/dist";
import { toast } from "react-hot-toast";
import { TweetText as Website } from "../tweet";
import { renderText } from "~/lib/tweet";
import { Badge } from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

interface UserDetailProps {
  user: RouterOutputs["profile"]["getUserByUsernameDB"];
  currentUser: UserResource | null | undefined;
  isLoaded: boolean;
}

export const UserDetails: React.FC<UserDetailProps> = ({
  user,
  currentUser,
  isLoaded,
}) => {
  const [showModal, setShowModal] = React.useState(false);
  const { data: follow, isLoading: LoadingFollow } = getUserFollower({
    userId: user.id,
  });
  const joined = user.createdAt.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const birthDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="px-4 pb-3 pt-3">
      <div className="relative flex w-full flex-wrap justify-between">
        <div className="-mt-[15%] mb-3 h-auto w-1/4 min-w-[48px]">
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogTrigger className="rounded-full">
              <Image
                src={user?.imageUrl}
                alt={`${user?.username ?? user?.name}'s profile pic`}
                width="140"
                height="140"
                className={cn(
                  "aspect-square cursor-pointer rounded-full border-background bg-background object-cover p-1"
                )}
                draggable={false}
              />
            </DialogTrigger>
            <DialogOverlay
              className="bg-background/90 duration-75"
              onClick={() => setShowModal((prev) => !prev)}
            />
            <DialogContent
              className="h-full max-w-md items-center overflow-hidden rounded-md border-none border-transparent bg-transparent shadow-none outline-none md:h-auto"
              overlayClassName="bg-background/40"
            >
              <Image
                src={user?.imageUrl}
                alt={`${user?.name}'s profile pic`}
                width="370"
                height="370"
                className="aspect-square w-full rounded-full bg-background/60"
              />
            </DialogContent>
          </Dialog>
        </div>
        {isLoaded && currentUser?.id === user.id && (
          <Button
            variant="outline"
            className="focus-visible:border-1 rounded-full border-border py-4 hover:bg-[rgba(239,243,244,0.1)] focus-visible:bg-[rgba(239,243,244,0.1)]"
            type="button"
            onClick={() =>
              toast.error(
                "Sorry, this feature is currently under development and will be available soon.",
                { id: "router", position: "top-center" }
              )
            }
          >
            Edit Profile
          </Button>
        )}
        {isLoaded && currentUser?.id !== user.id && (
          <FollowButton user={user} />
        )}
      </div>
      <div className="-mt-1 mb-1 flex flex-col">
        <div className="inline-flex items-end text-xl font-extrabold leading-6">
          <h2>{user.name}</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="relative flex">
                <Badge variant={user.type} />
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="flex max-w-[360px] flex-col gap-3 border-none bg-background p-5 font-normal text-white shadow-x"
              >
                <h1 className="text-[21px] font-bold leading-7 text-[rgb(231,233,234)]">
                  Verified account
                </h1>
                <p className="inline-flex gap-3 text-[15px] leading-5 text-accent">
                  <Badge variant={user.type} />
                  <span>
                    {user.type === "developer" &&
                      "This account is verified because it's an official organization on burbir."}
                    {user.type === "verified" && "This account is verified."}
                  </span>
                </p>
                <p className="inline-flex gap-3 text-[15px] leading-5 text-accent">
                  <CalendarIcon size={20} fill="white" /> Verified since
                  undefined undefined
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => console.info("not available")}
                >
                  Upgrade to get verified
                </Button>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="flex text-[15px] leading-6 text-accent">
          @{user.username}
        </p>
      </div>
      {user.bio && <div className="mb-3">{user.bio}</div>}
      <div className="mb-3 flex w-full flex-wrap items-center justify-start gap-x-2.5 break-words text-base leading-3 text-accent">
        {user.location && (
          <span className="flex items-center gap-1">
            <LocationIcon size="1.25em" />
            {user.location}
          </span>
        )}
        {user.website && (
          <span className="flex items-center gap-1">
            <RiLinkM size="1.25em" />
            <Website
              className="text-base leading-3"
              content={renderText(user.website)}
            />
          </span>
        )}

        {user.birthDate && (
          <span
            className="flex items-center gap-1"
            onClick={() => console.log(user.createdAt)}
          >
            <BalloonIcon size="1.25em" />
            {`Born ${birthDate(user.birthDate)}`}
          </span>
        )}
        <span className="flex items-center gap-1">
          <CalendarIcon size="1.25em" />
          Joined {joined}
        </span>
      </div>
      <div className="flex flex-wrap text-base leading-5 text-accent">
        <Link
          href="/#follow"
          className="mr-5 break-words text-[15px] leading-4 hover:underline"
        >
          <span className="font-bold text-[rgb(231,233,234)]">
            {LoadingFollow ? user.following.length : follow?.following.length}
            &nbsp;
          </span>
          Following
        </Link>
        <Link
          href="/#follow"
          className="break-words text-[15px] leading-4 hover:underline"
        >
          <span className="font-bold text-[rgb(231,233,234)]">
            {LoadingFollow ? user.followers.length : follow?.followers.length}
            &nbsp;
          </span>
          Follower
        </Link>
      </div>
    </div>
  );
};
