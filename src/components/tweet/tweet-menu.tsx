import React from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { api } from "~/utils/api";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { cn } from "~/lib/utils";
import { cloudinaryDestroy } from "~/lib/cloudinary";
import { Button, buttonVariants } from "../ui/button";
import { authClient } from "~/lib/auth-client";
import { TweetProps } from "./types";
import { Dots, Trash, UserPlus } from "../icons";

interface MenuProps extends Pick<TweetProps, "author"> {
  post: Pick<TweetProps, "id" | "imageId">;
}

export const TweetMenu = ({ post, author }: MenuProps) => {
  const { data } = authClient.useSession();
  const ctx = api.useUtils();
  const { back, query, pathname } = useRouter();
  const { mutate, isLoading: deleting } = api.post.deletePost.useMutation({
    onSuccess: () => {
      if (pathname === "/post/[id]") {
        if (query.id === `${post.id}`) {
          back();
        } else {
          ctx.feed.postReplies.invalidate({ postId: query.id as string });
        }
      }

      if (pathname === "/home") {
        ctx.feed.home.invalidate();
      }
      if (pathname === "/p/[slug]") {
        ctx.feed.userPosts.invalidate();
      }

      toast.success("Your post was deleted");
    },
  });

  async function deletePost(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    e.currentTarget.disabled = true;

    if (post.imageId) void cloudinaryDestroy(post.imageId);
    mutate({ id: post.id });
  }

  return (
    <Popover key={post.id}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          disabled={deleting}
          onClick={(e) => e.stopPropagation()}
          className="group -mr-2 -mt-1.5 inline-flex aspect-square h-[34.75px] w-[34.75px] items-center justify-center rounded-full text-accent focus-within:bg-primary/5 hover:bg-primary/5"
        >
          <Dots size={18.75} className="group-focus-within:text-primary group-hover:text-primary" />
          <span className="sr-only">menu</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="left"
        align="start"
        sideOffset={-30}
        alignOffset={8}
        onClick={(e) => e.stopPropagation()}
        className="z-20 overflow-hidden rounded-xl p-0 shadow-x"
      >
        {author.username !== data?.user.username ? (
          <Button
            disabled
            variant="ghost"
            className="flex h-auto w-full justify-start gap-2 rounded-xl p-2.5 text-[16px]"
            onClick={(e) => e.stopPropagation()}
          >
            <UserPlus size={20} />
            Follow @{author?.username}
          </Button>
        ) : (
          <Dialog key={post.id}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="flex h-auto w-full justify-start gap-2 rounded-xl p-2.5 text-[16px] font-bold text-desctructive"
              >
                <Trash size={18} /> Delete
              </Button>
            </DialogTrigger>
            <DialogContent className="!rounded-2xl border-none p-8 text-start [&>button]:invisible">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold leading-6">Delete post?</DialogTitle>
                <DialogDescription asChild>
                  <div className="flex flex-col gap-6">
                    <p className="text-[15px] leading-5 text-accent">
                      This can’t be undone and it will be removed from your profile, the timeline of
                      any accounts that follow you, and from search results.
                    </p>
                    <div className="flex flex-col text-[17px] font-bold">
                      <DialogClose
                        className={cn(
                          buttonVariants({ variant: "destructive" }),
                          "mb-3 min-h-[44px] min-w-[44px] text-[15px]"
                        )}
                        onClick={deletePost}
                        disabled={deleting}
                      >
                        Delete
                      </DialogClose>
                      <DialogClose
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "min-h-[44px] min-w-[44px] border-border text-[15px]"
                        )}
                      >
                        Cancel
                      </DialogClose>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
      </PopoverContent>
    </Popover>
  );
};
