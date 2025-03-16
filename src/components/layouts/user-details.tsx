import { BalloonIcon, CalendarIcon, LocationIcon } from "../icons/twitter-icons";
import { RiLinkM } from "react-icons/ri";
import { Dialog, DialogContent, DialogOverlay, DialogTrigger } from "~/components/ui/dialog";
import Image from "next/image";
import { Button } from "../ui/button";
import { FollowButton } from "../button-follow";
import { TweetText as Website } from "../tweet/tweet-text";
import { renderText } from "~/lib/tweet";
import { Badge } from "../ui/badge";
import { EditUserModal } from "../modal/edit-profile-modal";
import { authClient } from "~/lib/auth-client";
import { featureNotReady } from "~/lib/utils";
import { api } from "~/utils/api";
import { useProfileContext } from "~/context";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export const UserDetails = () => {
  const user = useProfileContext();

  const { data, isPending } = authClient.useSession();
  const { data: follow } = api.profile.userFollow.useQuery({ userId: user.id });

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
          <FollowButton userId={user.id} />
        )}
      </div>
      <div className="-mt-1 mb-1 flex flex-col">
        <div className="inline-flex items-end text-xl font-extrabold leading-6">
          <h2>{user.name}</h2>
          <Popover>
            <PopoverTrigger className="relative flex">
              <Badge variant={user.type} />
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              className="flex w-full max-w-[360px] flex-col gap-3 border-none bg-background p-5 font-normal text-white duration-100"
            >
              <h1 className="text-[21px] font-bold leading-7 text-[rgb(231,233,234)]">
                {user.type === "developer" ? "Developer Account" : "Verified Account"}
              </h1>
              <p className="inline-flex gap-3 text-[15px] leading-5 text-accent">
                <Badge variant={user.type} />
                <span>
                  {user.type === "developer" &&
                    "This account is verified because it's an official developer on burbir."}
                  {user.type === "verified" && "This account is verified."}
                </span>
              </p>
              <p className="inline-flex gap-3 text-[15px] leading-5 text-accent">
                <CalendarIcon size={20} fill="white" /> Verified since undefined undefined
              </p>
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  featureNotReady("switch-to-pro", "This feature won't be implemented")
                }
              >
                Upgrade to get verified
              </Button>
            </PopoverContent>
          </Popover>
        </div>
        <p className="flex text-[15px] leading-6 text-accent">@{user.username}</p>
      </div>
      <div className="mb-3">{user.bio}</div>
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
            <Website className="text-base leading-3" content={renderText(user.website)} />
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
        <button
          onClick={() => featureNotReady("following-route")}
          className="mr-5 break-words text-[15px] leading-4 hover:underline"
        >
          <span className="font-bold text-[rgb(231,233,234)]">
            {follow?.total_following}
            &nbsp;
          </span>
          Following
        </button>
        <button
          onClick={() => featureNotReady("follower-route")}
          className="break-words text-[15px] leading-4 hover:underline"
        >
          <span className="font-bold text-[rgb(231,233,234)]">
            {follow?.total_follower}
            &nbsp;
          </span>
          Follower
        </button>
      </div>
    </div>
  );
};
