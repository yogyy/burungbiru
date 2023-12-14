import React from "react";
import { HoverCardTriggerProps } from "@radix-ui/react-hover-card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { RouterOutputs } from "~/utils/api";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

type UserCardT = HoverCardTriggerProps & {
  author: RouterOutputs["profile"]["getUserByUsername"];
};

export const UserCard = ({ children, author, ...props }: UserCardT) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild {...props}>
        {children}
      </HoverCardTrigger>
      <HoverCardContent
        onClick={(e) => e.stopPropagation()}
        className="flex cursor-default flex-col gap-2 rounded-2xl border-none shadow-x"
      >
        <div className="flex w-full items-start justify-between">
          <Link href={`/@${author.username}`}>
            <Image
              src={author.profileImg}
              alt={`${author.username} profile pic`}
              width={60}
              height={60}
              draggable="false"
              className="rounded-full"
            />
          </Link>
          <Button variant="secondary" className="">
            Follow
          </Button>
        </div>
        <div>
          <Link href={`/@${author.username}`}>
            <h1 className="text-lg font-bold leading-5">{`${author.firstName} ${
              author.lastName || ""
            }`}</h1>
          </Link>
          <Link href={`/@${author.username}`}>
            <h2 className="leading-5 text-accent">@{author.username}</h2>
          </Link>
        </div>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel aliquam
          excepturi
        </p>
        <div className="flex gap-2 text-base font-medium leading-5 text-foreground">
          <p>
            ? <span className="font-normal text-accent">Following</span>
          </p>
          <p>
            ?? <span className="font-normal text-accent">Followers</span>
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
