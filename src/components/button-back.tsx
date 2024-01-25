import { useRouter } from "next/router";
import React from "react";
import { LuArrowLeft } from "react-icons/lu";
import { cn } from "~/lib/utils";

interface ButtonBackProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const ButtonBack = ({ className, ...props }: ButtonBackProps) => {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        router.back();
      }}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full hover:bg-border",
        className
      )}
      {...props}
    >
      <LuArrowLeft size={24} />
      <span className="sr-only">back</span>
    </button>
  );
};
