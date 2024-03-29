import React from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { BiSolidUserPlus, BiTrash } from "react-icons/bi";
import { TbDots } from "react-icons/tb";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { RouterOutputs, api } from "~/utils/api";
import { toast } from "react-hot-toast";
import { Button, ButtonProps } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useRouter } from "next/router";
import { cn } from "~/lib/utils";
import { cloudinaryDestroy } from "~/lib/cloudinary";

type TweetMenuType = ButtonProps & RouterOutputs["post"]["detailPost"];
interface TweetMenuProps extends Omit<TweetMenuType, "repostAuthor"> {}
export const TweetMenu = (props: TweetMenuProps) => {
  const { post, author, className, ...rest } = props;
  const [modal, setModal] = React.useState(false);
  const [menu, setMenu] = React.useState(false);
  const { user } = useUser();
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
      if (post.authorId !== user?.id) {
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
    try {
      if (post.imageId) cloudinaryDestroy(post.imageId);
      mutate({ id: post.id });
    } catch (error) {
      console.log(error);
    } finally {
      setModal((prev) => !prev);
      setMenu((prev) => !prev);
    }
  }

  return (
    <Popover open={menu} onOpenChange={setMenu}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          disabled={deleting}
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={cn(
            "group -mr-2 -mt-1.5 inline-flex aspect-square h-[34.75px] w-[34.75px] items-center justify-center rounded-full text-accent focus-within:bg-primary/5 hover:bg-primary/5",
            className
          )}
          {...rest}
        >
          <TbDots
            size={18.75}
            className="group-focus-within:text-primary group-hover:text-primary"
          />
          <span className="sr-only">menu</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        onClick={(e) => e.stopPropagation()}
        side="left"
        sideOffset={-30}
        alignOffset={8}
        align="start"
        className="z-20 overflow-hidden rounded-xl p-0 shadow-x"
      >
        {user?.id !== post.authorId ? (
          <Button
            type="button"
            variant="ghost"
            className="flex h-auto w-full justify-start gap-2 rounded-xl p-2.5 text-[16px]"
            disabled
          >
            <BiSolidUserPlus size={20} />
            Follow @{author?.username}
          </Button>
        ) : (
          <Dialog open={modal} onOpenChange={setModal}>
            <DialogTrigger
              asChild
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Button
                variant="ghost"
                className="flex h-auto w-full justify-start gap-2 rounded-xl p-2.5 text-[16px] font-bold text-desctructive"
              >
                <BiTrash size={18} /> Delete
              </Button>
            </DialogTrigger>
            <DialogContent
              close={false}
              className="!rounded-2xl border-none p-8 text-start [&>button]:invisible"
            >
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
                      <Button
                        variant="destructive"
                        onClick={deletePost}
                        disabled={deleting}
                        className="mb-3 min-h-[44px] min-w-[44px] text-[15px]"
                      >
                        Delete
                      </Button>
                      <Button
                        variant="outline"
                        className="min-h-[44px] min-w-[44px] border-border text-[15px]"
                        onClick={() => setModal((prev) => !prev)}
                      >
                        Cancel
                      </Button>
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
