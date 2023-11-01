import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { RouterOutputs } from "~/utils/api";
import Link from "next/link";

type AvatarType = Pick<
  RouterOutputs["profile"]["getUserByUsername"],
  "username" | "profileImg"
> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;

export const UserAvatar: React.FC<AvatarType> = ({
  className,
  username,
  profileImg,
  ...props
}) => {
  return (
    <Link href={`/@${username}`} className={className} {...props}>
      <Avatar>
        <AvatarImage src={profileImg} alt={`@${username}`} />
        <AvatarFallback className="bg-background text-primary">
          {username?.slice(0, 2)}
        </AvatarFallback>
      </Avatar>
    </Link>
  );
};
