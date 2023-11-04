import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-[15px] font-bold transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 border-2 border-transparent outline-none transition duration-200 focus-visible:border-primary",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-neutral-50 hover:bg-primary/90 focus-visible:border-white",
        destructive:
          "bg-desctructive text-neutral-50 hover:bg-desctructive/80 focus-visible:border-white",
        outline:
          "border border-foreground bg-transparant hover:bg-card/20 focus-visible:border-white focus-visible:border-2",
        secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80",
        ghost: "hover:bg-card/20",
        link: "text-neutral-900 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 px-4 py-2.5",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
