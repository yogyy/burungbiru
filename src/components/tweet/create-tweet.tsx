import Image from "next/image";
import { LoadingSpinner } from "../loading";
import { toast } from "react-hot-toast";
import { useRef, useState, useEffect } from "react";
import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";

export const CreateTweet = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState("");
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
          <textarea
            ref={textareaRef}
            placeholder="What's happening?"
            className={cn(
              "flex h-10 max-h-[35rem] w-full flex-1 resize-none bg-transparent text-xl outline-none",
              isSuccess && "h-min",
              textareaRef.current?.value.length === 300 && "bg-red-500/80"
            )}
            maxLength={300}
            onInput={adjustTextareaHeight}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            // onKeyDown={(e) => {
            //   if (e.key === "Enter") {
            //     e.preventDefault();
            //     if (input !== "") {
            //       mutate({ content: input });
            //     }
            //   }
            // }}
            disabled={isPosting}
          />
        </div>
      </div>
      <Button
        disabled={
          isPosting || input === "" || textareaRef.current?.value.length === 300
        }
        onClick={(e) => {
          e.preventDefault();
          mutate({ content: input });
        }}
        className="self-end rounded-full bg-primary text-[15px] font-[600] leading-5"
      >
        {isPosting ? <LoadingSpinner size={20} /> : "Post"}
      </Button>
    </div>
  );
};
