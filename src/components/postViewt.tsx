import Image from "next/image";
import Link from "next/link";
import { RouterOutputs } from "~/utils/api";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div key={post.id} className=" flex gap-3 border-b border-slate-400 p-4">
      <Image
        width={56}
        height={56}
        src={author.profileImg}
        alt={`@${author.username || author.lastName}'s profile picture`}
        className="first-letter h-14 w-14 rounded-full"
      />
      <div className="flex flex-col">
        <div className="flex font-semibold text-slate-300">
          <Link href={`/@${author.username}`}>
            <span>
              {`@${
                author.username
                  ? author.username
                  : `${author.firstName}-${author.lastName}`
              }`}
            </span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span>{` · ${dayjs(post.createdAt).fromNow()}`}</span>
          </Link>
        </div>
        <span className="text-base">{post.content}</span>
      </div>
    </div>
  );
};
