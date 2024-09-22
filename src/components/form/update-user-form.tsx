import { useRef } from "react";
import * as Comp from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateUserSchema } from "./form";
import { Input } from "../ui/input";
import axios from "axios";
import { RouterOutputs } from "~/utils/api";

interface FormProps {
  user: RouterOutputs["profile"]["getCurrentUser"] | undefined;
}

export const UpdateUserForm = ({ user }: FormProps) => {
  const nameFieldRef = useRef<HTMLInputElement | null>(null);
  const bioFieldRef = useRef<HTMLTextAreaElement | null>(null);
  const locationFieldRef = useRef<HTMLInputElement | null>(null);
  const websiteFieldRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user?.name,
      bio: user?.bio || "",
      location: user?.location || "",
      website: user?.website || "",
    },
  });

  function onSubmit(values: z.infer<typeof updateUserSchema>) {
    axios.post("/api/updateuser", values).then((res) => console.log(res.data));
  }

  const editUserField = [
    { type: "input", name: "name", ref: nameFieldRef },
    { type: "textarea", name: "bio", ref: bioFieldRef },
    { type: "input", name: "location", ref: locationFieldRef },
    { type: "input", name: "website", ref: websiteFieldRef },
  ];

  return (
    <Comp.Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} id="edit_user_form">
        {editUserField.map((item) => (
          <div className="group/item p-4" key={item.name}>
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
                        className="w-full flex-1 resize-none bg-transparent leading-6 outline-none"
                        {...field}
                        maxLength={160}
                      />
                    )}
                  </Comp.FormControl>
                  <Comp.FormMessage className="absolute" />
                </Comp.FormItem>
              )}
            />
          </div>
        ))}
      </form>
    </Comp.Form>
  );
};
