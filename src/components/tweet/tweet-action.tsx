import { cn } from "~/lib/utils";

export const TweetAction = ({ children, className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div className={cn("relative z-10 -mr-2 flex", className)} {...props}>
      <div
        className="-ml-2 mt-3 flex h-5 flex-1 flex-shrink-0 flex-row border-x border-transparent xs:gap-1"
        aria-label="tweet action"
      >
        {children}
      </div>
    </div>
  );
};
