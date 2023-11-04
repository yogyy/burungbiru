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
  { title: "Home", icon: icon.Home, link: "/" },
  { title: "Explore", icon: icon.Search, link: "#explore" },
  { title: "Notifications", icon: icon.Bell, link: "/#notification" },
  { title: "Messages", icon: icon.Message, link: "#messages" },
  { title: "Lists", icon: icon.List, link: "/#list" },
  { title: "Bookmarks", icon: icon.Bookmark, link: "#bookmark" },
  { title: "Communities", icon: icon.Group, link: "/#group" },
  { title: "Premium", icon: icon.Logo, link: "/#premium" },
  { title: "Profile", icon: icon.Person, link: "/profile" },
  { title: "More", icon: icon.Menu, link: "/#more" },
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

export { navbarLink, TweetButton, createTweetActions };
