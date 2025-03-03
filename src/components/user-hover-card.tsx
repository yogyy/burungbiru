import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import Image from "next/image";
import Link from "next/link";
import { FollowButton } from "./button-follow";
import { getUserbyUsername } from "~/hooks/queries";
import { useIsClient, useMediaQuery } from "usehooks-ts";
import { Badge } from "./ui/badge";
import { authClient } from "~/lib/auth-client";
import { LoadingItem } from "./loading";
interface UserCardProps {
  username: string;
  children: React.ReactNode;
}
export const UserCard = ({ children, username }: UserCardProps) => {
  const { data } = authClient.useSession();
  const { data: user, isLoading } = getUserbyUsername({ username });

  const isClient = useIsClient();
  const onDekstop = useMediaQuery("(min-width: 768px)");

  return isClient && onDekstop ? (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      {isLoading ? (
        <HoverCardContent>
          <LoadingItem />
        </HoverCardContent>
      ) : (
        <HoverCardContent
          onClick={(e) => e.stopPropagation()}
          className="flex cursor-default flex-col gap-2 rounded-2xl border-none shadow-x"
        >
          <div className="flex w-full items-start justify-between">
            <Link href={`/p/${user?.username}`}>
              <Image
                src={user?.image ?? ""}
                alt={`${user?.username} profile pic`}
                width={60}
                height={60}
                draggable="false"
                className="aspect-square rounded-full"
              />
            </Link>
            {data?.user.id !== user?.id && <FollowButton user={user!} />}
          </div>
          <div>
            <Link href={`/p/${user?.username}`}>
              <h1 className="inline-flex text-lg font-bold leading-5">
                {user?.name} <Badge variant={user?.type!} />
              </h1>
            </Link>
            <Link href={`/p/${user?.username}`}>
              <h2 className="leading-5 text-accent">@{user?.username}</h2>
            </Link>
          </div>
          {user?.bio && <p className="text-[15px] leading-5">{user?.bio}</p>}
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
      )}
    </HoverCard>
  ) : (
    <>{children}</>
  );
};
