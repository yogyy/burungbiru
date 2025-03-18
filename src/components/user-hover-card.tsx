import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import Image from "next/image";
import Link from "next/link";
import { useMediaQuery } from "usehooks-ts";
import { Badge } from "./ui/badge";
import { User } from "@prisma/client";

interface UserCardProps {
  user: Pick<User, "username" | "name" | "image" | "type">;
  children: React.ReactNode;
  align?: "center" | "end" | "start";
}
export const UserCard = ({ children, user, align = "start" }: UserCardProps) => {
  const onDekstop = useMediaQuery("(min-width: 768px)");

  return onDekstop ? (
    <HoverCard openDelay={250} closeDelay={250}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>

      <HoverCardContent
        align={align}
        onClick={(e) => e.stopPropagation()}
        className="flex cursor-default flex-col gap-2 rounded-2xl border-none shadow-x"
      >
        <div className="flex w-full items-start justify-between">
          <Link href={`/p/${user?.username}`}>
            <Image
              src={user?.image!}
              alt={`${user?.username} profile pic`}
              width={60}
              height={60}
              draggable="false"
              className="aspect-square rounded-full"
            />
          </Link>
        </div>
        <div>
          <Link href={`/p/${user?.username}`}>
            <h1 className="inline-flex text-lg font-bold leading-5">
              {user?.name} <Badge variant={user?.type} />
            </h1>
          </Link>
          <Link href={`/p/${user?.username}`}>
            <h2 className="leading-5 text-accent">@{user?.username}</h2>
          </Link>
        </div>
        <p className="text-[15px] font-medium leading-5">Lorem ipsum dolor sit. 😎</p>
        <div className="flex gap-2 text-[14px] font-medium leading-5 text-foreground">
          <p>
            ??
            <span className="font-normal text-accent"> Following</span>
          </p>
          <p>
            ??
            <span className="font-normal text-accent"> Followers</span>
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  ) : (
    <>{children}</>
  );
};
