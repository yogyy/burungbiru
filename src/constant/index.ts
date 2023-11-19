import {
  Analytic,
  Bookmark,
  Comment,
  Like,
  Retweet,
  Share,
} from "~/components/icons/post-icon";
import * as icon from "~/components/icons/navbar-icon";
import { Emoji, Gif, Location, Poll, Schedule } from "~/components/icons";

const navbarLink = [
  { name: "Home", icon: icon.Home, link: "/" },
  { name: "Explore", icon: icon.Search, link: "#explore" },
  { name: "Notifications", icon: icon.Bell, link: "/#notification" },
  { name: "Messages", icon: icon.Message, link: "#messages" },
  { name: "Lists", icon: icon.List, link: "/#list" },
  { name: "Bookmarks", icon: icon.Bookmark, link: "#bookmark" },
  { name: "Communities", icon: icon.Group, link: "/#group" },
  { name: "Premium", icon: icon.Logo, link: "/#premium" },
  { name: "Profile", icon: icon.Person, link: "/profile" },
  { name: "More", icon: icon.Menu, link: "/#more" },
];

const hamburgerNavbarLink = [
  { name: "Profile", icon: icon.Person, link: "/profile" },
  { name: "Premium", icon: icon.Logo, link: "#premium" },
  { name: "Lists", icon: icon.List, link: "#list" },
  { name: "Bookmarks", icon: icon.Bookmark, link: "#bookmark" },
  { name: "Communities", icon: icon.Group, link: "#group" },
  { name: "Monetization", icon: icon.Monet, link: "#monetization" },
];

const userMenu = [
  { name: "Posts", href: "" },
  { name: "Replies", href: "/with_replies" },
  { name: "Highlights", href: "/hightlights" },
  { name: "Media", href: "/media" },
  { name: "Likes", href: "/likes" },
];

const TweetButton = [
  { name: "Reply", icon: Comment, action: null },
  { name: "Repost", icon: Retweet, action: null },
  { name: "Like", icon: Like, action: null },
  { name: "Analytic", icon: Analytic, action: null },
  { name: "Bookmark", icon: Bookmark, action: null },
  { name: "Share", icon: Share, action: null },
];

const createTweetActions = [
  { name: "GIF", icon: Gif },
  { name: "Poll", icon: Poll },
  { name: "Emoji", icon: Emoji },
  { name: "Schedule", icon: Schedule },
  { name: "Location", icon: Location },
];

export {
  navbarLink,
  TweetButton,
  createTweetActions,
  userMenu,
  hamburgerNavbarLink,
};
