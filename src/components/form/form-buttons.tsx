import { ReactNode, useRef } from "react";
import { cn } from "~/lib/utils";
import { CreateTweetVariant } from "./form";
import { Button } from "../ui/button";
import { IconBaseProps } from "../icons/type";

interface FormButtonsProps {
  field: ReactNode;
  children: ReactNode;
  type?: "post" | "reply";
  variant: CreateTweetVariant;
  submitButtonDisabled: boolean;
  actions: {
    name: string;
    icon: (props: IconBaseProps) => JSX.Element;
  }[];
}

export const FormButtons = ({
  variant,
  actions,
  children,
  type = "post",
  submitButtonDisabled,
  field,
}: FormButtonsProps) => {
  const submitRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div
      className={cn(type === "post" ? "mt-2" : "px-4", "flex justify-between")}
    >
      <div
        className={cn(variant === "default" ? "ml-12" : "ml-0", "flex gap-1.5")}
      >
        {field}
        {actions.map((btn) => (
          <Button
            size={"icon"}
            variant={"ghost"}
            key={btn.name}
            disabled
            type="button"
            className="relative h-8 w-8 cursor-not-allowed rounded-full"
          >
            <btn.icon size={20} className="fill-primary" />
            <span className="sr-only">Add {btn.name}</span>
          </Button>
        ))}
      </div>
      <Button
        ref={submitRef}
        type="submit"
        disabled={submitButtonDisabled}
        className={cn(
          "h-8 self-end rounded-full font-sans text-[15px] font-[600] leading-5 focus-visible:border-white disabled:opacity-60",
          variant === "modal"
            ? "fixed right-4 top-[11px] z-20 min-[570px]:static"
            : ""
        )}
      >
        {children}
      </Button>
    </div>
  );
};
