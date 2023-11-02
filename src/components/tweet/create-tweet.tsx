import Image from "next/image";
import { toast } from "react-hot-toast";
import { useRef, useState, useEffect } from "react";
import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { createTweetActions } from "~/constant";
import { Globe } from "../icons";
import { UserAvatar } from "../avatar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
    onMutate() {
      toast("creating your post...", {
        position: "top-center",
      });
    },
    onSuccess: () => {
      setInput("");
      ctx.posts.getAll.invalidate();
      toast.success(`Your post was sent.`);
      adjustTextareaHeight();
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

  const formSchema = z.object({
    post: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
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
  }, [textareaRef]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight + 5}px`;
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      post: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    mutate({ content: values.post });
    console.log(values);
    form.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative flex w-full flex-col pb-2"
      >
        <FormField
          control={form.control}
          name="post"
          render={({ field }) => (
            <div className="px-4 pt-1.5">
              <div className="relative flex h-auto w-auto items-start gap-4">
                <UserAvatar
                  username={user.username}
                  profileImg={user.imageUrl}
                  className="mt-1.5 flex-shrink-0"
                />
                <FormItem className="h-full w-full space-y-0">
                  {/* <div
                    className={cn(
                      "w-full cursor-pointer pb-3",
                      showBadge ? "block" : "hidden"
                    )}
                  >
                    <Badge
                      variant="outline"
                      className={cn(
                        "flex h-[24px] w-fit min-w-[24px] cursor-not-allowed items-center rounded-full border-accent bg-background font-sans text-sm text-primary hover:bg-primary/25"
                      )}
                    >
                      Everyone <LuChevronDown size={20} className="ml-1" />
                    </Badge>
                  </div> */}
                  <FormControl>
                    <textarea
                      {...field}
                      ref={textareaRef}
                      placeholder="What's happening?"
                      className={cn(
                        "flex max-h-[35rem] min-h-[52px] w-full flex-1 resize-none bg-transparent pt-3 text-xl leading-6 text-fuchsia-50 outline-none placeholder:font-thin",
                        isPosting && "text-accent",
                        isSuccess && "h-min",
                        textareaRef.current?.value.length! >= 255 &&
                          "text-desctructive"
                      )}
                      disabled={isPosting}
                    />
                  </FormControl>
                  <div className="-ml-[8px] -mt-2 pb-3">
                    <span
                      className={cn(
                        "flex h-6 w-fit items-center rounded-full px-3 font-sans font-semibold text-primary",
                        "text-[15px] leading-5 transition-colors duration-200 ease-out hover:bg-primary/10",
                        "cursor-not-allowed [&>svg>path]:fill-primary [&>svg]:mr-1 [&>svg]:w-4"
                      )}
                    >
                      <Globe /> Everyone can reply
                    </span>
                  </div>
                </FormItem>
              </div>
              <hr className="ml-10" />
              <div className="mt-2 flex justify-between">
                <div className={cn("ml-10 flex gap-1.5")}>
                  {createTweetActions.map((btn) => (
                    <Button
                      size={"icon"}
                      variant={"ghost"}
                      key={btn.name}
                      disabled={btn.name !== "Media"}
                      type="button"
                      className={cn(
                        "h-8 w-8 rounded-full fill-primary text-primary hover:bg-primary/25",
                        "relative last:opacity-60 last:hover:bg-transparent",
                        btn.name !== "Media" && "cursor-not-allowed"
                      )}
                    >
                      <span className="w-5 fill-primary">
                        <btn.icon />
                      </span>
                    </Button>
                  ))}
                </div>
                <Button
                  type="submit"
                  disabled={
                    isPosting || textareaRef.current?.value.length! >= 255
                  }
                  className={cn(
                    "h-9 self-end rounded-full font-sans text-[15px] font-[600] leading-5 focus-visible:border-white disabled:opacity-60"
                  )}
                >
                  Post
                </Button>
              </div>
            </div>
          )}
        />
      </form>
    </Form>
  );
};
