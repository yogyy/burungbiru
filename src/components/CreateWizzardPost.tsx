import Image from "next/image";
import { Button } from "./button";
import { LoadingSpinner } from "./loading";
import { toast } from "react-hot-toast";
import { useRef, useState } from "react";
import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export const CreateWizzardPost = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState("");
  const { user } = useUser();
  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
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
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  return (
    <div className="flex w-full flex-col gap-2 px-4 py-2">
      <div className="relative flex h-auto w-auto items-start gap-4">
        <Link href={user.username!}>
          <Image
            width={40}
            height={40}
            src={user.profileImageUrl}
            alt="Profile Image"
            className="rounded-full"
            draggable={false}
          />
        </Link>
        <textarea
          ref={textareaRef}
          placeholder="type something..."
          className="flex h-auto w-full flex-1 resize-none bg-transparent text-xl outline-none"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          onInput={adjustTextareaHeight}
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
      <Button
        disabled={isPosting || input === ""}
        onClick={() => mutate({ content: input })}
        className="self-end"
      >
        {isPosting ? <LoadingSpinner size={20} /> : "Tweet"}
      </Button>
    </div>
  );
};
