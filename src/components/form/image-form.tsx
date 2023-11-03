import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { FormControl, FormItem, FormLabel } from "../ui/form";
import { Media } from "../icons";
import { ChangeEventHandler, useRef } from "react";
import { ControllerRenderProps } from "react-hook-form";

type ImageFormType = {
  onChange: ChangeEventHandler<HTMLInputElement>;
} & ControllerRenderProps;

export const ImageForm = ({ onChange, ...field }: ImageFormType) => {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  return (
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
          onChange={onChange}
          className="hidden"
        />
      </FormControl>
    </FormItem>
  );
};
