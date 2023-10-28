import Image from "next/image";
import { toast } from "react-hot-toast";
import { useRef, useState, useEffect } from "react";
import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { LuChevronDown } from "react-icons/lu";
import { Emoji, Gif, Globe, Location, Media, Poll, Schedule } from "../icons";

export const CreateTweet = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState("");
  const [showBadge, setShowBadge] = useState(false);

  const { user } = useUser();
  const ctx = api.useUtils();
  const {
    mutate,
    isLoading: isPosting,
    isSuccess,
  } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post! Please try again later.");
      }
    },
  });

  if (!user) return null;

  useEffect(() => {
    const { current } = textareaRef;
    if (!current) return;
    current.addEventListener("input", adjustTextareaHeight);
    adjustTextareaHeight();

    return () => {
      current.removeEventListener("input", adjustTextareaHeight);
    };
  }, [textareaRef.current]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  return (
    <div className="flex w-full flex-col py-2">
      <div className="relative flex h-auto w-auto items-start gap-4">
        <Link href={user.username!} className="flex-shrink-0">
          <Image
            width={40}
            height={40}
            src={user.imageUrl}
            alt="Profile Image"
            className="rounded-full"
            draggable={false}
          />
        </Link>
        <div className="h-full w-full">
          <div className={cn("w-full pb-3", showBadge ? "block" : "hidden")}>
            <Badge
              variant="outline"
              className={cn(
                "flex h-[24px] w-fit min-w-[24px] items-center rounded-full border-accent bg-background font-sans text-sm text-primary hover:bg-primary/25"
              )}
            >
              Everyone <LuChevronDown size={20} className="ml-1" />
            </Badge>
          </div>
          <textarea
            ref={textareaRef}
            placeholder="What's happening?"
            className={cn(
              "flex h-10 max-h-[35rem] w-full flex-1 resize-none bg-transparent pt-3 text-xl leading-6 text-fuchsia-50 outline-none placeholder:font-thin",
              isSuccess && "h-min",
              textareaRef.current?.value.length === 300 && "bg-red-500/80"
            )}
            maxLength={300}
            onInput={adjustTextareaHeight}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            onMouseDown={() => setShowBadge(true)}
            // onKeyDown={(e) => {
            //   if (e.key === "Enter") {
            //     e.preventDefault();
            //     if (input !== "") {
            //       mutate({ content: input });
            //     }
            //   }
            // }}
            disabled={isPosting}
          >
            adasd
          </textarea>
          <div className="-ml-[8px] -mt-2 pb-3">
            <span className="flex h-6 w-fit items-center rounded-full px-3 font-sans font-semibold text-primary hover:bg-primary/10 [&>svg>path]:fill-primary [&>svg]:mr-1 [&>svg]:w-4">
              <Globe /> Everyone can reply
            </span>
          </div>
        </div>
      </div>
      <hr className="ml-10" />
      <div className="mt-2 flex justify-between">
        <div className={cn("ml-10 flex gap-1.5")}>
          <CreateTweetAction />
        </div>
        <Button
          type="submit"
          disabled={
            isPosting ||
            input.length <= 0 ||
            textareaRef.current?.value.length === 300
          }
          onClick={(e) => {
            if (input.length >= 1) {
              e.preventDefault();
              mutate({ content: input });
            } else {
              return null;
            }
          }}
          className={cn(
            "h-9 self-end rounded-full font-sans text-[15px] font-[600] leading-5 disabled:opacity-60"
          )}
        >
          Post
        </Button>
      </div>
    </div>
  );
};

const ButtonAction = [
  { name: "Media", icon: Media },
  { name: "GIF", icon: Gif },
  { name: "Poll", icon: Poll },
  { name: "Emoji", icon: Emoji },
  { name: "Schedule", icon: Schedule },
  { name: "Location", icon: Location },
];

const CreateTweetAction = () => {
  return (
    <>
      {ButtonAction.map((btn) => (
        <button
          key={btn.name}
          type="button"
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-full fill-primary text-primary transition-colors duration-200 hover:bg-primary/25",
            "last:opacity-60 last:hover:bg-transparent"
          )}
        >
          <span className="w-5 fill-primary">
            <btn.icon />
          </span>
        </button>
      ))}
    </>
  );
};
