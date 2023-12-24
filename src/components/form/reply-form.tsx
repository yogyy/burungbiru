import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";
import { z } from "zod";
import { useUser } from "@clerk/nextjs";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { createTweetActions } from "~/constant";
import { ImageIcon } from "../icons";
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
import { uploadImage } from "~/lib/cloudinary";
import { LuX } from "react-icons/lu";
import { TweetProps } from "../tweet";
import { useTextarea } from "~/hooks/use-adjust-textarea";
import { CreateTweetVariant, tweetSchema } from ".";

type CommentForm = Pick<TweetProps, "post"> &
  React.FormHTMLAttributes<HTMLFormElement> & {
    variant?: CreateTweetVariant;
  } & { setShowReplyModal?: React.Dispatch<React.SetStateAction<boolean>> };

const CreateReply: React.FC<CommentForm> = ({
  variant = "default",
  className,
  setShowReplyModal,
  post,
  ...props
}) => {
  const { textareaRef, adjustTextareaHeight } = useTextarea();
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [submitBtn, setSubmitBtn] = useState(false);
  const postId = post.type === "REPOST" ? post.parentId ?? "" : post.id;
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

  const { mutate, isLoading: isPosting } = api.action.replyPost.useMutation({
    onSuccess: () => {
      setImagePrev("");
      form.reset();
      ctx.action.replies
        .invalidate({ postId })
        .then(() => ctx.post.postReplies.invalidate({ postId }));
      ctx.post.detailPost.invalidate({ id: postId }).then(() => {
        adjustTextareaHeight();
      });
      if (!ImagePrev) toast.success("Your Post was sent.");
      if (variant === "modal" && setShowReplyModal)
        setShowReplyModal((prev) => !prev);
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
          uploadImage(image as File),
          {
            loading: "sending your post...",
            success: "Your post was sent.",
            error: "Uh oh, sending post went error!",
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
        type: "COMMENT",
        postId,
      });
      setSubmitBtn((prev) => !prev);
    }
  }

  if (!user) return null;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("relative flex w-full flex-col pb-2", className)}
        {...props}
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <div
              className={cn(
                "hide-scrollbar w-full overflow-y-scroll",
                variant === "default"
                  ? "max-h-[calc(100dvh_-_148px)]"
                  : "max-h-[calc(100dvh_-_148px)] sm:max-h-[calc(90dvh_-_148px)]"
              )}
            >
              <div
                className={cn(
                  "relative flex h-auto w-auto items-start gap-4",
                  "px-4 pt-1"
                )}
              >
                <UserAvatar
                  username={user.username}
                  imageUrl={user.imageUrl}
                  className="flex-shrink-0"
                  // tabIndex={variant === "modal" ? -1 : 0}
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
                        placeholder="Post your reply"
                        className={cn(
                          "flex max-h-[35rem] min-h-[53px] w-full flex-1 resize-none bg-transparent",
                          "text-xl leading-6 outline-none placeholder:font-thin",
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
        <>
          <div className="flex justify-between px-4">
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
              {createTweetActions.map(
                (btn) =>
                  btn.name !== "Schedule" &&
                  btn.name !== "Poll" && (
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
                  )
              )}
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
              Reply
            </Button>
          </div>
        </>
      </form>
    </Form>
  );
};

export default CreateReply;
