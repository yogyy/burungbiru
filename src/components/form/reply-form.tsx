import { z } from "zod";
import { toast } from "react-hot-toast";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import { cn } from "~/lib/utils";
import { imagePost } from "~/lib/cloudinary";
import { replyTweetActions } from "~/constant";
import { useUploadImage } from "~/hooks/use-upload-img";
import { useTextarea } from "~/hooks/use-adjust-textarea";
import { FormButtons } from "./form-buttons";
import { ImagePreview } from "./image-preview";
import { ToastReplySuccess } from "./toast-form";
import { CreateTweetVariant, replySchema } from "./form";
import * as Comp from "../ui/form";
import { ImageIcon } from "../icons";
import { Button } from "../ui/button";
import { UserAvatar } from "../avatar";
import { TweetProps } from "../tweet/types";

interface CommentFormProps extends Pick<TweetProps, "post"> {
  variant?: CreateTweetVariant;
  setShowReplyModal?: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateReply = ({
  variant = "default",
  setShowReplyModal,
  post,
}: CommentFormProps) => {
  const postId = post.type === "REPOST" ? post.parentId ?? "" : post.id;
  const { image, ImagePrev, setImagePrev, handleImageChange } =
    useUploadImage();
  const { textareaRef, adjustTextareaHeight } = useTextarea();
  const inputImageRef = useRef<HTMLTextAreaElement | null>(null);

  const { user } = useUser();
  const ctx = api.useUtils();

  const form = useForm<z.infer<typeof replySchema>>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      text: "",
      image: {
        public_id: "",
        secure_url: "",
      },
    },
  });

  const { mutate, isLoading: isPosting } = api.action.replyPost.useMutation({
    onSuccess: ({ id }) => {
      setImagePrev("");
      form.reset();
      ctx.action.replies
        .invalidate({ postId })
        .then(() => ctx.post.postReplies.invalidate({ postId }));
      ctx.post.detailPost.invalidate({ id: postId }).then(() => {
        adjustTextareaHeight();
      });
      toast.success(() => <ToastReplySuccess id={id} />);
      if (variant === "modal") {
        setShowReplyModal?.((prev) => !prev);
      }
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

  async function onSubmit(values: z.infer<typeof replySchema>) {
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
        type: "COMMENT",
        postId,
        authorParentId: post.authorId,
      });
    }
  }

  useEffect(() => {
    if (variant == "modal") {
      textareaRef.current?.focus();
    }
  }, [textareaRef, variant]);

  return (
    <Comp.Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="group relative flex w-full flex-col pb-2"
      >
        <Comp.FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <div className="hide-scrollbar w-full overflow-y-scroll">
              <div className="relative flex h-auto w-auto items-start gap-4 px-4 pt-1">
                <UserAvatar
                  username={user?.username!}
                  imageUrl={user?.imageUrl!}
                  className="flex-shrink-0"
                  onModal={variant === "modal"}
                />
                <Comp.FormItem className="h-full w-full space-y-0">
                  <Comp.FormControl>
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
                          "flex max-h-[35rem] min-h-[53px] w-full flex-1 resize-none bg-transparent text-xl leading-6 outline-none placeholder:font-thin",
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
                      )}
                    </div>
                  </Comp.FormControl>
                  <Comp.FormMessage className="absolute bottom-2 cursor-default select-none text-accent" />
                </Comp.FormItem>
              </div>
            </div>
          )}
        />
        <FormButtons
          type="reply"
          variant={variant}
          actions={replyTweetActions}
          submitButtonDisabled={
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
                <Comp.FormItem className="space-y-0">
                  <Comp.FormLabel className="relative cursor-pointer">
                    <Button
                      size={"icon"}
                      variant={"ghost"}
                      type="button"
                      onClick={() => inputImageRef.current?.click()}
                      disabled={isPosting || form.formState.isSubmitting}
                      className="h-8 w-8 rounded-full fill-primary p-1 text-primary hover:bg-primary/10"
                    >
                      <span className="sr-only">add image</span>
                      <ImageIcon className="h-5 w-5 fill-current" />
                    </Button>
                  </Comp.FormLabel>
                  <Comp.FormControl ref={inputImageRef}>
                    <input
                      accept="image/*"
                      {...field}
                      placeholder="add image"
                      type="file"
                      onChange={handleImageChange}
                      disabled={isPosting || form.formState.isSubmitting}
                      className="hidden"
                    />
                  </Comp.FormControl>
                </Comp.FormItem>
              )}
            />
          }
        >
          Reply
        </FormButtons>
      </form>
    </Comp.Form>
  );
};

export default CreateReply;
