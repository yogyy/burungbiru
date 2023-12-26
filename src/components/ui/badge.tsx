import * as React from "react";
import { cn } from "~/lib/utils";
import { DevIcon, UserVerified } from "../icons";
import { User } from "@prisma/client";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant: User["type"];
}

function Badge({ className, variant, ...props }: BadgeProps) {
  if (variant === "user") return null;
  return (
    <span className={cn("ml-0.5", className)} {...props}>
      {variant === "verified" && (
        <UserVerified size={20} fill="rgba(29,155,240,1.00)" />
      )}
      {variant === "developer" && <DevIcon size={22} />}
    </span>
  );
}

export { Badge };
