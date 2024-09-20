import React from "react";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { RouterOutputs } from "~/utils/api";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface AvatarType
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    Pick<
      RouterOutputs["profile"]["getUserByUsernameDB"],
      "username" | "imageUrl"
    > {
  onModal?: boolean;
}

export const UserAvatar = (props: AvatarType) => {
  const { className, username, imageUrl, onModal = false, ...rest } = props;
  return !onModal ? (
    <Link
      href={`/@${username}`}
      className={cn(
        "rounded-full outline-none outline-offset-0 focus-visible:outline-2 focus-visible:outline-primary",
        className
      )}
      {...rest}
    >
      <Avatar>
        <AvatarImage src={imageUrl} alt={`@${username}`} />
        <AvatarFallback className="bg-background font-semibold text-primary">
          {username?.slice(0, 2)}
        </AvatarFallback>
      </Avatar>
    </Link>
  ) : (
    <Avatar className={className}>
      <AvatarImage src={imageUrl} alt={`@${username}`} />
      <AvatarFallback className="bg-background font-semibold text-primary">
        {username?.slice(0, 2)}
      </AvatarFallback>
    </Avatar>
  );
};
