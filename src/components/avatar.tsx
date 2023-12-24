import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { RouterOutputs } from "~/utils/api";
import Link from "next/link";
import { cn } from "~/lib/utils";

type AvatarType = Pick<
  RouterOutputs["profile"]["getUserByUsernameDB"],
  "username" | "imageUrl"
> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;

export const UserAvatar: React.FC<AvatarType> = ({
  className,
  username,
  imageUrl,
  ...props
}) => {
  return (
    <Link
      href={`/@${username}`}
      className={cn(
        "rounded-full outline-none outline-offset-0 focus-visible:outline-2 focus-visible:outline-primary",
        className
      )}
      {...props}
    >
      <Avatar>
        <AvatarImage src={imageUrl} alt={`@${username}`} />
        <AvatarFallback className="bg-background text-primary">
          {username?.slice(0, 2)}
        </AvatarFallback>
      </Avatar>
    </Link>
  );
};
