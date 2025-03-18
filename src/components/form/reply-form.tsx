import { z } from "zod";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { ImageIcon } from "../icons/twitter-icons";
import { Button } from "../ui/button";
import { UserAvatar } from "../avatar";
import { TweetProps } from "../tweet/types";
import { authClient } from "~/lib/auth-client";

interface CommentFormProps {
  variant?: CreateTweetVariant;
  setShowReplyModal?: React.Dispatch<React.SetStateAction<boolean>>;
  post: TweetProps;
}

const CreateReply = ({ variant = "default", setShowReplyModal, post }: CommentFormProps) => {
  const postId = post.type === "REPOST" ? post.parentId! : post.id;
  const { image, ImagePrev, setImagePrev, handleImageChange } = useUploadImage();
  const { textareaRef, adjustTextareaHeight } = useTextarea();
  const inputImageRef = useRef<HTMLTextAreaElement | null>(null);

  const { data } = authClient.useSession();
  const utils = api.useUtils();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (!e.shiftKey && e.key === "Enter") {
        if (
          textareaRef.current?.value.length! > 4 &&
          textareaRef.current?.value.trim().length !== 0
        ) {
          e.preventDefault();
          form.handleSubmit(onSubmit)();
        }
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== textareaRef.current) {
        e.preventDefault();
        textareaRef.current?.focus();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const form = useForm<z.infer<typeof replySchema>>({
    resolver: zodResolver(replySchema),
    defaultValues: { text: "", image: { public_id: "", secure_url: "" } },
  });

  const { mutate, isLoading: isPosting } = api.action.replyPost.useMutation({
    onSuccess: ({ id }) => {
      setImagePrev("");
      form.reset();
      utils.feed.postReplies.invalidate({ postId });
      utils.post.replies.invalidate({ postId });
      utils.post.detailPost.invalidate({ id: postId }).then(() => {
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
        toast.error(err.shape?.data.zodError?.fieldErrors.content[0] || "error", {
          position: "top-center",
          style: { backgroundColor: "hsl(var(--desctructive))" },
        });
      } else {
        toast.error(err.message, {
          position: "top-center",
          style: { backgroundColor: "hsl(var(--desctructive))" },
        });
      }
    },
  });

  async function onSubmit(values: z.infer<typeof replySchema>) {
    if (ImagePrev) values.image = await imagePost(image);
    mutate({
      content: values.text,
      image: {
        public_id: values.image?.public_id || "",
        secure_url: values.image?.secure_url || "",
      },
      type: "COMMENT",
      postId,
    });
  }

  useEffect(() => {
    if (variant == "modal") {
      textareaRef.current?.focus();
    }
  }, [textareaRef, variant]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="group relative flex w-full flex-col pb-2"
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <div className="hide-scrollbar w-full overflow-y-scroll">
              <div className="relative flex h-auto w-auto items-start gap-4 px-4 pt-1">
                <UserAvatar
                  username={data?.user.username!}
                  image={data?.user.image!}
                  className="flex-shrink-0"
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
                        placeholder="Post your reply"
                        className={cn(
                          "flex max-h-[35rem] min-h-[53px] w-full flex-1 resize-none bg-transparent text-base leading-6 outline-none placeholder:text-base placeholder:font-thin",
                          isPosting && "text-accent",
                          textareaRef.current?.value.length! >= 255 && "text-desctructive",
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
                  </FormControl>
                  <FormMessage className="absolute bottom-2 cursor-default select-none text-accent" />
                </FormItem>
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
                      onClick={() => inputImageRef.current?.click()}
                      disabled={isPosting || form.formState.isSubmitting}
                      className="h-8 w-8 rounded-full fill-primary p-1 text-primary hover:bg-primary/10"
                    >
                      <span className="sr-only">add image</span>
                      <ImageIcon className="h-5 w-5 fill-current" />
                    </Button>
                  </FormLabel>
                  <FormControl ref={inputImageRef}>
                    <input
                      accept="image/*"
                      {...field}
                      placeholder="add image"
                      type="file"
                      onChange={handleImageChange}
                      disabled={isPosting || form.formState.isSubmitting}
                      className="hidden"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          }
        >
          Reply
        </FormButtons>
      </form>
    </Form>
  );
};

export default CreateReply;
