import { useRef, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";
import { z } from "zod";
import { useUser } from "@clerk/nextjs";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { createTweetActions } from "~/constant";
import { Globe, Media } from "../icons";
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

const tweetSchema = z.object({
  text: z.string().min(1),
  image: z
    .object({
      public_id: z.string(),
      url: z.string(),
    })
    .optional(),
});

export const CreateTweet = () => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [submitBtn, setSubmitBtn] = useState(false);

  const { image, ImagePrev, setImagePrev, handleImageChange } =
    useUploadImage();
  const { user } = useUser();
  const ctx = api.useUtils();
  if (!user) return null;

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setImagePrev("");
      form.reset();
      ctx.posts.getAll.invalidate().then(() => adjustTextareaHeight());
      if (!ImagePrev) toast.success("Your Post was sent.");
    },
    onError: (err) => {
      adjustTextareaHeight();
      if (err.shape?.data.zodError?.fieldErrors.content) {
        toast.error(err.shape?.data.zodError?.fieldErrors.content[0] as string);
      } else {
        toast.error("error sending post");
      }
    },
  });

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

  const form = useForm<z.infer<typeof tweetSchema>>({
    resolver: zodResolver(tweetSchema),
    defaultValues: {
      text: "",
      image: {
        public_id: "",
        url: "",
      },
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
          public_id: values.image?.public_id as string,
          url: values.image?.url as string,
        },
      });
      setSubmitBtn((prev) => !prev);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative flex w-full flex-col pb-2"
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <div className="px-4 pt-1.5">
              <div className="relative flex h-auto w-auto items-start gap-4">
                <UserAvatar
                  username={user.username}
                  profileImg={user.imageUrl}
                  className="flex-shrink-0 pt-3"
                />
                <FormItem className="h-full w-full space-y-0">
                  <FormControl>
                    <div className="create-post-content max-h-[84.5vh] w-full overflow-y-scroll">
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
                            "flex max-h-[35rem] min-h-[32px] w-full flex-1 resize-none bg-transparent",
                            "py-3 text-xl leading-6 outline-none placeholder:font-thin",
                            isPosting && "text-accent",
                            textareaRef.current?.value.length! >= 255 &&
                              "text-desctructive"
                          )}
                          disabled={isPosting}
                        />
                        {ImagePrev && (
                          <div className="relative">
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
                            </Button>
                            <ImageModal
                              src={ImagePrev}
                              className="max-h-[42.5rem] w-full rounded-2xl"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                  <div className="-ml-[8px] -mt-2 pb-3">
                    <span
                      className={cn(
                        "flex h-6 w-fit items-center rounded-full px-3 font-sans font-semibold text-primary",
                        "text-[15px] leading-5 transition-colors duration-200 ease-out hover:bg-primary/10",
                        "cursor-not-allowed"
                      )}
                    >
                      <Globe className="mr-1 w-4 fill-primary" /> Everyone can
                      reply
                    </span>
                  </div>
                </FormItem>
              </div>
              <hr className="ml-10" />
              <div className="mt-2 flex justify-between">
                <div className={cn("ml-10 flex gap-1.5")}>
                  <FormField
                    control={form.control}
                    name="image.url"
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
                            <Media className="h-5 w-5 fill-current" />
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
                    isPosting ||
                    submitBtn ||
                    textareaRef.current?.value.length! >= 255
                    // textareaRef.current?.value.length === 0
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