import React from "react";
import { useUser } from "@clerk/nextjs";
import { UserDetail } from "~/types";
import { FollowButton } from "./button-follow";

export const FollowUser = ({ user }: UserDetail) => {
  const [showFollow, setShowFollow] = React.useState(false);
  const { user: currentUser, isLoaded } = useUser();

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

  if (!isLoaded || currentUser?.id === user.id) {
    return null;
  }

  return showFollow ? (
    <FollowButton user={user} className="sticky ml-auto" />
  ) : null;
};
