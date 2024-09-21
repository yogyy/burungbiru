import { z } from "zod";
import { useRef } from "react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import { imagePost } from "~/lib/cloudinary";
import { useTweetModal } from "~/hooks/store";
import { createTweetActions } from "~/constant";
import { useUploadImage } from "~/hooks/use-upload-img";
import { useTextarea } from "~/hooks/use-adjust-textarea";
import { FormButtons } from "./form-buttons";
import { ImagePreview } from "./image-preview";
import { ToastPostSuccess } from "./toast-form";
import { CreateTweetVariant, tweetSchema } from "./form";
import * as Comp from "../ui/form";
import { Button } from "../ui/button";
import { UserAvatar } from "../avatar";
import { GlobeIcon, ImageIcon } from "../icons";

const CreateTweet = ({
  variant = "default",
}: {
  variant: CreateTweetVariant;
}) => {
  const { image, ImagePrev, setImagePrev, handleImageChange } =
    useUploadImage();
  const setTweetModal = useTweetModal((state) => state.setShow);
  const { textareaRef, adjustTextareaHeight } = useTextarea();
  const inputImageRef = useRef<HTMLTextAreaElement | null>(null);
  const { user, isLoaded } = useUser();
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
    }
  }

  return (
    <Comp.Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative flex w-full flex-col pb-2"
      >
        <Comp.FormField
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
                        placeholder="What is happening?"
                        className={cn(
                          "flex max-h-[35rem] min-h-[53px] w-full flex-1 resize-none bg-transparent pt-3 text-xl leading-6 outline-none placeholder:font-thin",
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
        <div className="mt-3 px-4">
          <div
            className={cn(
              "-mt-3 pb-3",
              variant === "default" ? "ml-11" : "-ml-1"
            )}
          >
            <span className="flex h-6 w-fit cursor-not-allowed items-center rounded-full px-3 font-sans text-[15px] font-semibold leading-5 text-primary transition-colors duration-200 ease-out hover:bg-primary/10">
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
            Post
          </FormButtons>
        </div>
      </form>
    </Comp.Form>
  );
};

export default CreateTweet;
