import Image from "next/image";
import Link from "next/link";
import { RouterOutputs } from "~/utils/api";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { useState } from "react";
import { useRouter } from "next/router";
import clsx from "clsx";
import { ToolTip } from "./tooltip";
dayjs.extend(LocalizedFormat);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  const router = useRouter();
  const checkUrl = router.pathname.startsWith("/post");
  const routeToPost = () => {
    if (checkUrl) {
      console.log(author);
    } else {
      router.push(`/post/${post.id}`);
    }
  };
  return (
    <div
      tabIndex={0}
      key={post.id}
      className={clsx(
        checkUrl ? "" : "cursor-pointer hover:bg-white/5 focus:bg-white/5",
        "w-full border-b border-border px-4 outline-none transition-colors duration-200 ease-in-out"
      )}
      onClick={routeToPost}
    >
      {!checkUrl ? (
        <PostViewAll author={author} post={post} />
      ) : (
        <PostViewDetail author={author} post={post} />
      )}
    </div>
  );
};

const PostViewAll = ({ author, post }: PostWithUser) => {
  return (
    <div className="flex w-auto py-3">
      <Image
        width={56}
        height={56}
        draggable={false}
        src={author.profileImg}
        alt={`@${author.username || author.lastName}'s profile picture`}
        className="first-letter mr-3 flex h-14 w-14 basis-12 flex-nowrap rounded-full"
      />
      <div className="w-full flex-col">
        <div className="flex w-full font-semibold text-accent">
          <Link
            className="custom-underline focus:groupd-focus:bg-red-500 truncate font-semibold text-gray-200 "
            href={`/@${
              author.username
                ? author.username
                : `${author.firstName}-${author.lastName}`
            }`}
          >
            {`${author.firstName} ${
              author.lastName !== null ? author.lastName : ""
            }`}
          </Link>
          <Link
            className="ml-2 truncate font-thin text-accent outline-none"
            href={`/@${
              author.username
                ? author.username
                : `${author.firstName}-${author.lastName}`
            }`}
          >
            <span>
              {`@${
                author.username
                  ? author.username
                  : `${author.firstName}-${author.lastName}`
              }`}
            </span>
          </Link>
          <span className="px-1">·</span>
          <Link
            href={`/post/${post.id}`}
            className="custom-underline group relative w-max font-thin"
            aria-label={dayjs(post.createdAt).format("LL LT")}
          >
            <time dateTime={post.createdAt.toISOString()}>{`${dayjs(
              post.createdAt
            ).format("DD MMM")}`}</time>
            <ToolTip tip={dayjs(post.createdAt).format("LT LL")} />
          </Link>
        </div>
        <div className="flex w-fit justify-start">
          <p className="text-base">{post.content}</p>
        </div>
      </div>
    </div>
  );
};

const PostViewDetail = ({ author, post }: PostWithUser) => {
  return (
    <div className="">
      <div className="flex items-center gap-3">
        <Image
          width={56}
          height={56}
          src={author.profileImg}
          alt={`@${author.username || author.lastName}'s profile picture`}
          className="first-letter h-14 w-14 rounded-full"
        />
        <div className="flex flex-col content-center">
          <Link
            className="custom-underline font-semibold"
            href={`/@${
              author.username
                ? author.username
                : `${author.firstName}-${author.lastName}`
            }`}
          >
            <span>{`${author.firstName} ${
              author.lastName !== null ? author.lastName : ""
            }`}</span>
          </Link>
          <Link
            className="font-thin text-accent outline-none"
            href={`/@${
              author.username
                ? author.username
                : `${author.firstName}-${author.lastName}`
            }`}
          >
            <span>
              {`@${
                author.username
                  ? author.username
                  : `${author.firstName}-${author.lastName}`
              }`}
            </span>
          </Link>
        </div>
      </div>
      <div className="relative mt-3 flex">
        <p className="overflow-hidden break-words text-base">{post.content}</p>
      </div>
      <Link
        href={`/post/${post.id}`}
        className="custom-underline group relative w-max font-extralight text-accent hover:underline focus-visible:underline"
        aria-label={dayjs(post.createdAt).format("LL LT")}
      >
        <time dateTime={post.createdAt.toISOString()}>{`${dayjs(
          post.createdAt
        ).format("LT · LL")}`}</time>
        <ToolTip tip={dayjs(post.createdAt).format("LT LL")} />
      </Link>
      <div className="pb-4" />
    </div>
  );
};
