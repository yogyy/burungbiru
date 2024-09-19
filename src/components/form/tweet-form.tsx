import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";
import { z } from "zod";
import { useUser } from "@clerk/nextjs";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { createTweetActions } from "~/constant";
import { GlobeIcon, ImageIcon } from "../icons";
import { UserAvatar } from "../avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageModal } from "../modal/image-modal";
import { useUploadImage } from "~/hooks/use-upload-img";
import { cloudinarUpload } from "~/lib/cloudinary";
import { LuX } from "react-icons/lu";
import { useTweetModal } from "~/hooks/store";
import { useTextarea } from "~/hooks/use-adjust-textarea";
import { CreateTweetVariant, tweetSchema } from "./form";
import Link from "next/link";

interface CreateTweetProps {
  variant?: CreateTweetVariant;
}

const CreateTweet = ({ variant = "default" }: CreateTweetProps) => {
  const { textareaRef, adjustTextareaHeight } = useTextarea();
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [submitBtn, setSubmitBtn] = useState(false);
  const setTweetModal = useTweetModal((state) => state.setShow);
  const { image, ImagePrev, setImagePrev, handleImageChange } =
    useUploadImage();
  const { user } = useUser();
  const ctx = api.useUtils();

  const form = useForm<z.infer<typeof tweetSchema>>({
    resolver: zodResolver(tweetSchema),
    defaultValues: {
      text: "",
      image: {
        public_id: "",
        secure_url: "",
      },
    },
  });

  const { mutate, isLoading: isPosting } = api.post.createPost.useMutation({
    onSuccess: ({ id }) => {
      setImagePrev("");
      form.reset();
      ctx.profile.userPosts.invalidate();
      ctx.post.timeline.invalidate().then(() => {
        adjustTextareaHeight();
      });
      toast.success(() => <ToastPostSuccess id={id} />);
      if (variant === "modal") setTweetModal((prev) => !prev);
    },
    onError: (err) => {
      adjustTextareaHeight();
      if (err.shape?.data.zodError?.fieldErrors.content) {
        toast.error(
          err.shape?.data.zodError?.fieldErrors.content[0] || "error"
        );
      } else {
        toast.error(err.message);
      }
    },
  });

  async function onSubmit(values: z.infer<typeof tweetSchema>) {
    try {
      setSubmitBtn((prev) => !prev);
      if (ImagePrev) {
        const imagePost = toast.promise(
          cloudinarUpload(image as File),
          {
            loading: "upload your image...",
            success: "upload image success",
            error: "Uh oh, uploading image went error!",
          },
          { position: "top-right" }
        );
        values.image = await imagePost;
      }
    } catch (error) {
      console.log(error);
    } finally {
      mutate({
        content: values.text,
        image: {
          public_id: values.image?.public_id || "",
          secure_url: values.image?.secure_url || "",
        },
        type: "POST",
      });
      setSubmitBtn((prev) => !prev);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("relative flex w-full flex-col pb-2")}
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <div
              className={cn(
                "hide-scrollbar w-full overflow-y-scroll px-4",
                variant === "default"
                  ? "max-h-[calc(100dvh_-_148px)]"
                  : "max-h-[calc(100dvh_-_148px)] sm:max-h-[calc(90dvh_-_148px)]"
              )}
            >
              <div className="relative flex h-auto w-auto items-start gap-4">
                <UserAvatar
                  username={user?.username!}
                  imageUrl={user?.imageUrl!}
                  className="mt-3 flex-shrink-0"
                  onClick={(e) => {
                    variant === "modal" ? e.preventDefault() : null;
                  }}
                />
                <FormItem className="h-full w-full space-y-0">
                  <FormControl>
                    <div
                      className={cn(
                        "h-full w-full pt-1",
                        form.formState.isSubmitting && "opacity-60"
                      )}
                    >
                      <textarea
                        {...field}
                        ref={textareaRef}
                        maxLength={500}
                        placeholder="What is happening?"
                        className={cn(
                          "flex max-h-[35rem] min-h-[53px] w-full flex-1 resize-none bg-transparent",
                          "pt-3 text-xl leading-6 outline-none placeholder:font-thin",
                          isPosting && "text-accent",
                          textareaRef.current?.value.length! >= 255 &&
                            "text-desctructive",
                          ImagePrev ? "pb-1.5" : ""
                        )}
                        disabled={isPosting}
                      />
                      {ImagePrev && (
                        <div className="relative pb-2">
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className={cn(
                              "absolute right-1 top-1 rounded-full bg-background p-1",
                              "opacity-70 transition-opacity hover:bg-background hover:opacity-100"
                            )}
                            onClick={() => setImagePrev("")}
                          >
                            <LuX size={20} />
                            <span className="sr-only">close preview image</span>
                          </Button>
                          <ImageModal
                            width="600"
                            height="400"
                            src={ImagePrev}
                            className="max-h-[42.5rem] w-full rounded-2xl"
                            alt="image preview"
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className="absolute bottom-2 cursor-default select-none text-accent" />
                </FormItem>
              </div>
            </div>
          )}
        />
        <div className="mt-3 px-4">
          <div
            className={cn(
              "-mt-3 pb-3",
              variant === "default" ? "ml-11" : "-ml-1"
            )}
          >
            <span
              className={cn(
                "flex h-6 w-fit items-center rounded-full px-3 font-sans font-semibold text-primary",
                "text-[15px] leading-5 transition-colors duration-200 ease-out hover:bg-primary/10",
                "cursor-not-allowed"
              )}
            >
              <GlobeIcon className="mr-1" /> Everyone can reply
            </span>
          </div>
          <hr className={cn(variant === "default" ? "ml-12" : "ml-0")} />
          <div className="mt-2 flex justify-between">
            <div
              className={cn(
                variant === "default" ? "ml-12" : "ml-0",
                "flex gap-1.5"
              )}
            >
              <FormField
                control={form.control}
                name="image.secure_url"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="relative cursor-pointer">
                      <Button
                        size={"icon"}
                        variant={"ghost"}
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className={cn(
                          "h-8 w-8 rounded-full fill-primary p-1 text-primary hover:bg-primary/10"
                        )}
                      >
                        <span className="sr-only">add image</span>
                        <ImageIcon className="h-5 w-5 fill-current" />
                      </Button>
                    </FormLabel>
                    <FormControl ref={inputRef}>
                      <input
                        accept="image/*"
                        {...field}
                        placeholder="add image"
                        type="file"
                        onChange={handleImageChange}
                        disabled={isPosting}
                        className="hidden"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {createTweetActions.map((btn) => (
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  key={btn.name}
                  disabled={btn.name !== "Media"}
                  type="button"
                  className={cn(
                    "h-8 w-8 rounded-full fill-primary text-primary hover:bg-primary/25",
                    "relative last:hover:bg-transparent",
                    btn.name !== "Media" && "cursor-not-allowed"
                  )}
                >
                  <btn.icon size={20} className="fill-primary" />
                  <span className="sr-only">Add {btn.name}</span>
                </Button>
              ))}
            </div>
            <Button
              type="submit"
              disabled={
                isPosting ||
                submitBtn ||
                textareaRef.current?.value.length! >= 255 ||
                textareaRef.current?.value.length === 0
              }
              className={cn(
                "h-8 self-end rounded-full font-sans text-[15px] font-[600] leading-5 focus-visible:border-white disabled:opacity-60",
                variant === "modal"
                  ? "fixed right-4 top-[11px] z-20 min-[570px]:static"
                  : ""
              )}
            >
              Post
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CreateTweet;
