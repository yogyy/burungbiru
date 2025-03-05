import React from "react";
import { UserDetail } from "~/types";
import { FollowButton } from "./button-follow";
import { authClient } from "~/lib/auth-client";

export const FollowUser = ({ user }: UserDetail) => {
  const [showFollow, setShowFollow] = React.useState(false);
  const { data, isPending } = authClient.useSession();

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 250) {
        setShowFollow(true);
      } else {
        setShowFollow(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (isPending || data?.session.userId === user.id) {
    return null;
  }

  return showFollow ? (
    <FollowButton user={user} className="sticky ml-auto" />
  ) : null;
};
