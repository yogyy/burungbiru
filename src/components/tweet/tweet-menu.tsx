import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import { BiSolidUserPlus, BiTrash } from "react-icons/bi";
import { TbDots } from "react-icons/tb";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { RouterOutputs, api } from "~/utils/api";
import { toast } from "react-hot-toast";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import axios from "axios";

type TMenu = {
  post: RouterOutputs["posts"]["deleteById"];
} & RouterOutputs["posts"]["getById"];

export const TweetMenu = ({ post, author }: TMenu) => {
  const { user } = useUser();
  const ctx = api.useUtils();
  const [modal, setModal] = useState(false);
  const [menu, setMenu] = useState(false);

  const { mutate, isLoading: deleting } = api.posts.deleteById.useMutation({
    onSuccess: () => {
      ctx.posts.getAll
        .invalidate()
        .then(() => toast.success("Your post was deleted"));
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to delete, you not the author.");
      }
    },
  });

  const deletePost = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setModal((prev) => !prev);
    setMenu((prev) => !prev);
    e.stopPropagation();
    e.currentTarget.disabled = true;
    mutate({ id: post.id });
    if (post.image)
      axios.post("/api/delete", {
        publicId: post.imageId,
      });
  };

  return (
    <Popover open={menu} onOpenChange={setMenu}>
      <PopoverTrigger
        asChild
        onClick={(e) => e.stopPropagation()}
        className="inline-flex items-center justify-center rounded-full focus-within:bg-primary/5 hover:bg-primary/5"
      >
        <Button
          type="button"
          size={"icon"}
          variant="ghost"
          disabled={deleting}
          className="group -mr-2 h-[34.75px] w-[34.75px] text-accent"
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
        className="overflow-hidden p-0"
      >
        {user?.id !== post.authorId ? (
          <Button
            type="button"
            variant="ghost"
            className="flex h-auto w-full justify-start gap-2 rounded-none p-3 text-[16px]"
            disabled={deleting}
          >
            <BiSolidUserPlus size={20} />
            Follow @{author.username}
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
                className="flex h-auto w-full justify-start gap-2 rounded-none p-3 text-[16px] font-bold text-desctructive"
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
