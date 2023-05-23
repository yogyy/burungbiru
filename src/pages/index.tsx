import { type NextPage } from "next";
import Head from "next/head";
import { useUser, SignInButton, UserButton, SignedOut } from "@clerk/nextjs";

import { RouterOutputs, api } from "~/utils/api";
import Image from "next/image";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postViewt";

const CreateWizzardPost = () => {
  const [input, setInput] = useState("");
  const { user } = useUser();
  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
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
  if (!user) return null;

  return (
    <div className="flex w-full items-center gap-4">
      <Image
        width={56}
        height={56}
        src={user.profileImageUrl}
        alt="Profile Image"
        className="first-letter: h-14 w-14 rounded-full"
      />
      {/* <div className="flex h-14 w-14 items-center justify-center">
        <UserButton />
      </div> */}
      <input
        type="text"
        placeholder="type something..."
        className="grow bg-transparent outline-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input !== "") {
              mutate({ content: input });
            }
          }
        }}
        disabled={isPosting}
      />
      {input !== "" && !isPosting && (
        <button
          disabled={isPosting}
          onClick={() => mutate({ content: input })}
          className="h-fit w-fit px-2.5 py-1"
        >
          Post
        </button>
      )}
      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={20} />
        </div>
      )}
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postLoading } = api.posts.getAll.useQuery();
  if (postLoading) return <LoadingPage />;
  if (!data) return <div>Something went wrong! </div>;

  return (
    <div className="">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const { user, isLoaded: userLoaded, isSignedIn } = useUser();
  api.posts.getAll.useQuery();

  if (!userLoaded) return <div />;

  return (
    <PageLayout>
      <div className="flex border-b border-slate-400 p-4">
        {!isSignedIn && <SignInButton />}
        {isSignedIn && <CreateWizzardPost />}
      </div>
      <Feed />
    </PageLayout>
  );
};

export default Home;
