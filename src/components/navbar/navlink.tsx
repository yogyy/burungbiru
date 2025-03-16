import { useRouter } from "next/router";
import {
  BookmarkIcon,
  BookmarkIconFill,
  HomeIcon,
  HomeIconFill,
  PersonIcon,
  PersonIconFill,
} from "~/components/icons/twitter-icons";
import { IconBaseProps } from "../icons/type";
import { authClient } from "~/lib/auth-client";

const ProfileLink = (props: IconBaseProps) => {
  const { asPath } = useRouter();
  const { data } = authClient.useSession();

  const arrOfRoute = asPath.split("/");
  return arrOfRoute[1] === `@${data?.user.username}` ? (
    <PersonIconFill size={26.25} {...props} />
  ) : (
    <PersonIcon size={26.25} {...props} />
  );
};

const HomeLink = (props: IconBaseProps) => {
  const { route } = useRouter();
  return route === "/home" ? (
    <HomeIconFill size={26.25} {...props} />
  ) : (
    <HomeIcon size={26.25} {...props} />
  );
};

const BookmarkLink = (props: IconBaseProps) => {
  const { pathname } = useRouter();
  return pathname === "/i/bookmarks" ? (
    <BookmarkIconFill size={26.25} {...props} />
  ) : (
    <BookmarkIcon size={26.25} {...props} />
  );
};

export { ProfileLink, HomeLink, BookmarkLink };
