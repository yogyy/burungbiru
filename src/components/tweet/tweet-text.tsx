import Link from "next/link";
import React from "react";
import { URL_REGEX } from "~/lib/tweet";
import { cn, convertToHttps } from "~/lib/utils";

type TweetTextType = React.HTMLAttributes<HTMLParagraphElement> & {
  content: string;
};

export const TweetText = ({ content, className }: TweetTextType) => {
  const words = content.split(" ");
  return (
    <p className={cn("content-post whitespace-pre-wrap", className)}>
      {words.map((word: string) => {
        return word.match(URL_REGEX) ? (
          <React.Fragment key={word + new Date()}>
            <Link
              href={convertToHttps(word)?.href!}
              onClick={(e) => e.stopPropagation()}
              target="_blank"
              className="text-primary hover:underline"
            >
              {convertToHttps(word)?.title}
            </Link>
          </React.Fragment>
        ) : (
          word + " "
        );
      })}
    </p>
  );
};
