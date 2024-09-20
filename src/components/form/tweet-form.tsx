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
      if (ImagePrev) URL.revokeObjectURL(ImagePrev);
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
      if (ImagePrev) values.image = await imagePost(image);
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
                  onModal={variant === "modal"}
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
                        <ImagePreview
                          image={ImagePrev}
                          onClick={() => {
                            URL.revokeObjectURL(ImagePrev);
                            setImagePrev("");
                          }}
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
          <FormButtons
            variant={variant}
            actions={createTweetActions}
            submitButtonDisabled={
              !isLoaded ||
              isPosting ||
              form.formState.isSubmitting ||
              textareaRef.current?.value.length! >= 255 ||
              textareaRef.current?.value.trim().length === 0
            }
            field={
              <Comp.FormField
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
