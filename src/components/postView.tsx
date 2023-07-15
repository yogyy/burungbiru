import Image from "next/image";
import Link from "next/link";
import { RouterOutputs, api } from "~/utils/api";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import clsx from "clsx";
import { ToolTip } from "./tooltip";
import { DotMenu } from "./icons/dotmenu";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import type { MouseEventHandler } from "react";
dayjs.extend(LocalizedFormat);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  const router = useRouter();
  const checkUrl = router.pathname.startsWith("/post");

  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.posts.deleteById.useMutation({
    onSuccess: () => {
      ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post! Please try again later.");
      }
    },
  });

  const deletePost = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    mutate({ id: post.id });
  };
  const routeToPost = () => {
    if (checkUrl) {
      null;
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
        <PostViewAll onClick={deletePost} author={author} post={post} />
      ) : (
        <PostViewDetail author={author} post={post} />
      )}
    </div>
  );
};

interface PostViewAllProps extends PostWithUser {
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const PostViewAll: React.FC<PostViewAllProps> = ({ author, post, onClick }) => {
  const { user } = useUser();

  return (
    <div className="relative flex w-full py-3">
      <div className="mr-3 h-auto min-h-[3.5rem] min-w-[3.5rem] ">
        <Image
          width={56}
          height={56}
          draggable={false}
          src={author.profileImg}
          alt={`@${author.username || author.lastName}'s profile picture`}
          className="first-letter flex basis-12 rounded-full"
        />
      </div>
      <div className="w-full flex-col">
        <div className="flex w-full flex-wrap font-semibold text-accent">
          <Link
            className="custom-underline focus:groupd-focus:bg-red-500 truncate font-semibold text-gray-200"
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
            href={`/@${author.username ? author.username : author.id}`}
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

          <div className="z-[2] ml-auto flex items-center justify-center rounded-full p-1 hover:bg-blue-600">
            <button
              onClick={
                user?.id === author.id
                  ? onClick
                  : () => console.log("bukan author")
              }
            >
              <DotMenu />
            </button>
          </div>
        </div>
        <div className="flex w-fit justify-start">
          <p className="whitespace-pre-line break-words text-base">
            {post.content}
          </p>
        </div>
      </div>
    </div>
  );
};

const PostViewDetail = ({ author, post }: PostWithUser) => {
  return (
    <div className="w-full sm:max-w-[672px]">
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
