import { z } from "zod";
import Image from "next/image";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import {
  Form,
  FormControl,
  FormLabel,
  FormMessage,
  FormField,
  FormItem,
} from "~/components/ui/form";
import { featureNotReady } from "~/lib/utils";
import { updateUserSchema } from "./form";
import { Input } from "../ui/input";
import { useUpdateUserModal } from "~/hooks/store";
import { CameraPlus, X } from "../icons";
import { toast } from "sonner";

export const UpdateUserForm = ({ username }: { username: string }) => {
  const { data: user } = api.profile.getUserByUsername.useQuery({ username });

  const nameFieldRef = useRef<HTMLInputElement | null>(null);
  const bioFieldRef = useRef<HTMLTextAreaElement | null>(null);
  const locationFieldRef = useRef<HTMLInputElement | null>(null);
  const websiteFieldRef = useRef<HTMLInputElement | null>(null);
  const closeUpdateuserModal = useUpdateUserModal((state) => state.setShow);
  const ctx = api.useUtils();

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user?.name,
      bio: user?.bio || "",
      location: user?.location || "",
      website: user?.website || "",
    },
  });

  const { mutate, isLoading } = api.profile.updateUserProfile.useMutation({
    onSuccess: () => {
      ctx.profile.getUserByUsername
        .invalidate({ username: user?.username })
        .then(() => closeUpdateuserModal(false));
    },
    onError(err) {
      toast.error(err.message, {
        position: "top-center",
        style: { backgroundColor: "hsl(var(--desctructive))" },
      });
    },
  });

  function onSubmit(values: z.infer<typeof updateUserSchema>) {
    try {
      mutate(values);
    } catch (error) {
      console.log("Something went wrong");
    }
  }

  const editUserField = [
    { type: "input", name: "name", ref: nameFieldRef },
    { type: "textarea", name: "bio", ref: bioFieldRef },
    { type: "input", name: "location", ref: locationFieldRef },
    { type: "input", name: "website", ref: websiteFieldRef },
  ];

  return (
    <Form {...form}>
      <div className="relative">
        <div className="relative flex aspect-[3/1] w-full items-center justify-center">
          {user?.banner ? (
            <Image
              alt={`banner @${user?.username}`}
              src={user?.banner}
              width="585"
              height="195"
              priority
              className="h-full max-h-[12.3rem] w-full border-2 border-transparent bg-no-repeat object-cover opacity-70"
            />
          ) : (
            <div className="h-full w-full border-2 border-black bg-border"></div>
          )}
          <div className="absolute flex h-11 w-full justify-center">
            <div className="flex items-center justify-center">
              <button
                className="button-edit-picture rounded-full border backdrop-blur-sm transition-colors duration-200"
                title="Add photo"
                onClick={() => featureNotReady("change-user-banner")}
              >
                <CameraPlus className="text-white" size={22} />
              </button>
              <button
                className="button-edit-picture ml-5 rounded-full border backdrop-blur-sm transition-colors duration-200"
                title="Remove photo"
                onClick={() => featureNotReady("delete-user-banner")}
              >
                <X className="text-white" size={22} />
              </button>
            </div>
          </div>
        </div>
        <div className="relative -mt-12 ml-4 flex h-auto w-fit items-center justify-center overflow-hidden rounded-full bg-background">
          <Image
            src={user?.image!}
            alt={`${user?.username}'s profile pic`}
            width="120"
            height="120"
            className="aspect-square rounded-full object-cover p-1 opacity-75"
            draggable={false}
          />
          <button
            className="button-edit-picture absolute rounded-full backdrop-blur-sm transition-colors duration-200"
            title="Add photo"
            onClick={() => featureNotReady("change-user-picture")}
          >
            <CameraPlus className="text-white" size={22} />
          </button>
        </div>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} id="edit_user_form">
        {editUserField.map((item) => (
          <div className="group/item px-4 py-3" key={item.name}>
            <FormField
              control={form.control}
              name={item.name as any}
              render={({ field }) => (
                <FormItem
                  className="space-y-0 rounded-[4px] border p-2 focus-within:border-primary"
                  onClick={() => item.ref.current?.focus()}
                >
                  <FormLabel className="text-[small] capitalize text-accent group-focus-within/item:text-primary">
                    {item.name}
                  </FormLabel>
                  <FormControl ref={item.ref}>
                    {item.type === "input" ? (
                      <Input
                        {...field}
                        className="h-5 border-none p-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                        disabled={isLoading}
                      />
                    ) : (
                      <textarea
                        {...field}
                        disabled={isLoading}
                        className="hide-scrollbar w-full flex-1 resize-none bg-transparent leading-6 outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        maxLength={160}
                      />
                    )}
                  </FormControl>
                  <FormMessage className="absolute" />
                </FormItem>
              )}
            />
            <div className="pt-1"></div>
          </div>
        ))}
      </form>
    </Form>
  );
};
