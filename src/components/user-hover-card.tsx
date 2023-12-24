import React from "react";
import { HoverCardTriggerProps } from "@radix-ui/react-hover-card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { FollowButton } from "./button-follow";
import { getUserbyUsername } from "~/hooks/query";
import { useIsClient, useMediaQuery } from "usehooks-ts";

export const UserCard: React.FC<
  HoverCardTriggerProps & { username: string }
> = ({ children, username, className, ...props }) => {
  const { user: currentUser } = useUser();
  const { data: user } = getUserbyUsername({
    username,
  });

  const isClient = useIsClient();
  const onDekstop = useMediaQuery("(min-width: 768px)");

  return isClient && onDekstop ? (
    <HoverCard>
      <HoverCardTrigger asChild {...props}>
        {children}
      </HoverCardTrigger>
      <HoverCardContent
        onClick={(e) => e.stopPropagation()}
        className="flex cursor-default flex-col gap-2 rounded-2xl border-none shadow-x"
      >
        <div className="flex w-full items-start justify-between">
          <Link href={`/@${user?.username}`}>
            <Image
              src={user?.imageUrl ?? ""}
              alt={`${user?.username} profile pic`}
              width={60}
              height={60}
              draggable="false"
              className="rounded-full"
            />
          </Link>
          {currentUser?.id !== user?.id && <FollowButton user={user!} />}
        </div>
        <div>
          <Link href={`/@${user?.username}`}>
            <h1 className="text-lg font-bold leading-5">{user?.name}</h1>
          </Link>
          <Link href={`/@${user?.username}`}>
            <h2 className="leading-5 text-accent">@{user?.username}</h2>
          </Link>
        </div>
        {user?.bio && <p>{user?.bio}</p>}
        <div className="flex gap-2 text-[14px] font-medium leading-5 text-foreground">
          <p>
            {user?.following.length}&nbsp;
            <span className="font-normal text-accent">Following</span>
          </p>
          <p>
            {user?.followers.length}&nbsp;
            <span className="font-normal text-accent">Followers</span>
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  ) : (
    <>{children}</>
  );
};
