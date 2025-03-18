import React from "react";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "@prisma/client";

interface AvatarType
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    Pick<User, "username" | "image"> {
  onModal?: boolean;
}

export const UserAvatar = ({ className, username, image, onModal = false }: AvatarType) => {
  return !onModal ? (
    <Link
      href={`/p/${username}`}
      className={cn(
        "rounded-full outline-none outline-offset-0 focus-visible:outline-2 focus-visible:outline-primary",
        className
      )}
    >
      <Avatar>
        <AvatarImage src={image!} alt={`@${username}`} />
        <AvatarFallback className="bg-secondary font-semibold text-primary">
          {username?.slice(0, 4)}
        </AvatarFallback>
      </Avatar>
    </Link>
  ) : (
    <Avatar className={className}>
      <AvatarImage src={image!} alt={`@${username}`} />
      <AvatarFallback className="bg-secondary font-semibold text-primary">
        {username?.slice(0, 4)}
      </AvatarFallback>
    </Avatar>
  );
};
