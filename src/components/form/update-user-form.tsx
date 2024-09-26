import { z } from "zod";
import axios from "axios";
import Image from "next/image";
import { useRef } from "react";
import { IoClose } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TbCameraPlus } from "react-icons/tb";
import { api, RouterOutputs } from "~/utils/api";
import * as Comp from "~/components/ui/form";
import { featureNotReady } from "~/lib/utils";
import { updateUserSchema } from "./form";
import { Input } from "../ui/input";
import { useUpdateUserModal } from "~/hooks/store";

interface FormProps {
  user: RouterOutputs["profile"]["getCurrentUser"] | undefined;
}

export const UpdateUserForm = ({ user }: FormProps) => {
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

  const { mutate } = api.profile.updateUserInfo.useMutation({
    onSuccess: () => {
      console.log(`update user ${user?.username} success`);
      ctx.profile.getUserByUsernameDB
        .invalidate({ username: user?.username })
        .then(() => closeUpdateuserModal(false));
    },
  });

  function onSubmit(values: z.infer<typeof updateUserSchema>) {
    try {
      mutate(values);
    } catch (error) {
      console.log(error);
    }
  }

  const editUserField = [
    { type: "input", name: "name", ref: nameFieldRef },
    { type: "textarea", name: "bio", ref: bioFieldRef },
    { type: "input", name: "location", ref: locationFieldRef },
    { type: "input", name: "website", ref: websiteFieldRef },
  ];

  return (
    <Comp.Form {...form}>
      <div className="relative">
        <div className="relative flex aspect-[3/1] w-full items-center justify-center">
          <Image
            alt={`banner @${user?.username}`}
            src={user?.bannerUrl || ""}
            width="585"
            height="195"
            priority
            className="h-full max-h-[12.3rem] w-full border-2 border-transparent bg-no-repeat object-cover opacity-70"
          />
          <div className="absolute flex h-11 w-full justify-center">
            <div className="flex items-center justify-center">
              <button
                className="button-edit-picture rounded-full border backdrop-blur-sm transition-colors duration-200"
                title="Add photo"
                onClick={() => featureNotReady("change-user-banner")}
              >
                <TbCameraPlus className="text-white" size={22} />
              </button>
              <button
                className="button-edit-picture ml-5 rounded-full backdrop-blur-sm transition-colors duration-200"
                title="Remove photo"
                onClick={() => featureNotReady("delete-user-banner")}
              >
                <IoClose className="text-white" size={24} />
              </button>
            </div>
          </div>
        </div>
        <div className="relative -mt-12 ml-4 flex h-auto w-fit items-center justify-center overflow-hidden rounded-full bg-background">
          <Image
            src={user?.imageUrl || ""}
            alt={`${user?.username ?? user?.name}'s profile pic`}
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
            <TbCameraPlus className="text-white" size={22} />
          </button>
        </div>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} id="edit_user_form">
        {editUserField.map((item) => (
          <div className="group/item px-4 py-3" key={item.name}>
            <Comp.FormField
              control={form.control}
              name={item.name as any}
              render={({ field }) => (
                <Comp.FormItem
                  className="space-y-0 rounded-[4px] border p-2 focus-within:border-primary"
                  onClick={() => item.ref.current?.focus()}
                >
                  <Comp.FormLabel className="text-[small] capitalize text-accent group-focus-within/item:text-primary">
                    {item.name}
                  </Comp.FormLabel>
                  <Comp.FormControl ref={item.ref}>
                    {item.type === "input" ? (
                      <Input
                        className="h-5 border-none p-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                        {...field}
                      />
                    ) : (
                      <textarea
                        className="hide-scrollbar w-full flex-1 resize-none bg-transparent leading-6 outline-none"
                        {...field}
                        maxLength={160}
                      />
                    )}
                  </Comp.FormControl>
                  <Comp.FormMessage className="absolute" />
                </Comp.FormItem>
              )}
            />
            <div className="pt-1"></div>
          </div>
        ))}
      </form>
    </Comp.Form>
  );
};
