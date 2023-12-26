import { cn } from "~/lib/utils";

import { ComponentProps } from "react";

export const TweetAction: React.FC<ComponentProps<"div">> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn("relative z-10 -mr-2 flex", className)} {...props}>
      <div className="-ml-2 mt-3 flex h-5 flex-1 flex-shrink-0 flex-row border-x border-transparent xs:gap-1">
        {children}
      </div>
    </div>
  );
};
