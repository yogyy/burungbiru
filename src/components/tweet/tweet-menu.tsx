import React from "react";
import { useRouter } from "next/router";
import { TbDots } from "react-icons/tb";
import { toast } from "sonner";
import { BiSolidUserPlus, BiTrash } from "react-icons/bi";
import { Post, User } from "@prisma/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
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

interface TweetMenuProps {
  post: Post;
  author: User;
}

export const TweetMenu = ({ post, author }: TweetMenuProps) => {
  const { data } = authClient.useSession();
  const ctx = api.useUtils();
  const router = useRouter();
  const { mutate, isLoading: deleting } = api.post.deletePost.useMutation({
    onSuccess: () => {
      if (router.query.id === `${post.id}`) {
        router.back();
      }
      if (post.parentId) {
        ctx.action.reposts.invalidate({ postId: post.parentId });
      }
      ctx.post.parentPost.reset({ parentId: post.id });
      ctx.post.detailPost.invalidate({ id: post.id });
      ctx.post.postReplies.invalidate({ postId: post.parentId || post.id });
      ctx.profile.userPosts.invalidate();
      ctx.profile.userWithReplies.invalidate();
      ctx.post.timeline
        .invalidate()
        .then(() => toast.success("Your post was deleted"));
    },
    onError: () => {
      if (post.authorId !== data?.user.id) {
        toast.error("Failed to delete, you not the author.");
      } else {
        toast.error("Post NOT_FOUND");
        console.error("Post NOT_FOUND");
      }
    },
  });

  async function deletePost(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.stopPropagation();
    e.currentTarget.disabled = true;

    if (post.imageId) cloudinaryDestroy(post.imageId);
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
          <TbDots
            size={18.75}
            className="group-focus-within:text-primary group-hover:text-primary"
          />
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
        {data?.user.id !== post.authorId ? (
          <Button
            disabled
            variant="ghost"
            className="flex h-auto w-full justify-start gap-2 rounded-xl p-2.5 text-[16px]"
            onClick={(e) => e.stopPropagation()}
          >
            <BiSolidUserPlus size={20} />
            Follow @{author?.username}
          </Button>
        ) : (
          <Dialog key={post.id}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="flex h-auto w-full justify-start gap-2 rounded-xl p-2.5 text-[16px] font-bold text-desctructive"
              >
                <BiTrash size={18} /> Delete
              </Button>
            </DialogTrigger>
            <DialogContent className="!rounded-2xl border-none p-8 text-start [&>button]:invisible">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold leading-6">
                  Delete post?
                </DialogTitle>
                <DialogDescription asChild>
                  <div className="flex flex-col gap-6">
                    <p className="text-[15px] leading-5 text-accent">
                      This can’t be undone and it will be removed from your
                      profile, the timeline of any accounts that follow you, and
                      from search results.
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
