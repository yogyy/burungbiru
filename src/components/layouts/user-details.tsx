import React from "react";
import { BalloonIcon, CalendarIcon, LocationIcon } from "../icons";
import { RiLinkM } from "react-icons/ri";
import { getUserFollower } from "~/hooks/queries";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from "~/components/ui/dialog";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { FollowButton } from "../button-follow";
import { TweetText as Website } from "../tweet";
import { renderText } from "~/lib/tweet";
import { Badge } from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { EditUserModal } from "../modal/edit-profile-modal";
import { UserDetail } from "~/types";
import { authClient } from "~/lib/auth-client";
import { featureNotReady } from "~/lib/utils";

// TODO: change badge from Tooltip to Popover

export const UserDetails = ({ user }: UserDetail) => {
  const { data, isPending } = authClient.useSession();
  const { data: follow, isLoading: LoadingFollow } = getUserFollower({
    userId: user.id,
  });

  return (
    <div className="px-4 pb-3 pt-3">
      <div className="relative flex w-full flex-wrap justify-between">
        <div className="-mt-[15%] mb-3 h-auto w-1/4 min-w-[48px]">
          <Dialog>
            <DialogTrigger className="rounded-full">
              <Image
                src={user?.image!}
                alt={`${user?.username ?? user?.name}'s profile pic`}
                width="140"
                height="140"
                className="aspect-square cursor-pointer rounded-full border-background bg-background object-cover p-1"
                draggable={false}
              />
            </DialogTrigger>
            <DialogOverlay className="bg-background/90 duration-75" />
            <DialogContent
              className="h-full max-w-md items-center overflow-hidden rounded-md border-none border-transparent bg-transparent shadow-none outline-none md:h-auto"
              overlayClassName="bg-background/40"
            >
              <Image
                src={user?.image!}
                alt={`${user?.name}'s profile pic`}
                width="370"
                height="370"
                className="aspect-square w-full rounded-full bg-background/60 object-cover"
              />
            </DialogContent>
          </Dialog>
        </div>
        {isPending ? null : data?.user.id === user.id ? (
          <EditUserModal />
        ) : (
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
                className="flex max-w-[360px] flex-col gap-3 border-none bg-background p-5 font-normal text-white shadow-x duration-100"
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
          <span className="flex items-center gap-1">
            <BalloonIcon size="1.25em" />
            {`Born ${user.birthDate.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}`}
          </span>
        )}
        <span className="flex items-center gap-1">
          <CalendarIcon size="1.25em" />
          {`Joined
          ${user.createdAt.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}`}
        </span>
      </div>
      <div className="flex flex-wrap text-base leading-5 text-accent">
        <Link
          href={`/p/${user.username}#following`}
          onClick={() => featureNotReady("following-route")}
          className="mr-5 break-words text-[15px] leading-4 hover:underline"
        >
          <span className="font-bold text-[rgb(231,233,234)]">
            {LoadingFollow ? user.following.length : follow?.following.length}
            &nbsp;
          </span>
          Following
        </Link>
        <Link
          href={`/p/${user.username}#follower`}
          onClick={() => featureNotReady("follower-route")}
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
