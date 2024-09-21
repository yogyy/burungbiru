import { GoGear } from "react-icons/go";
import * as icon from "~/components/icons";
import {
  BookmarkLink,
  HomeLink,
  ProfileLink,
} from "~/components/navbar/navlink";

const navbarLink = [
  { name: "Home", icon: HomeLink, link: "/home" },
  { name: "Explore", icon: icon.SearchIcon, link: "#explore" },
  { name: "Notifications", icon: icon.BellIcon, link: "#notification" },
  { name: "Messages", icon: icon.MessageIcon, link: "#messages" },
  { name: "Lists", icon: icon.ListIcon, link: "#list" },
  { name: "Bookmarks", icon: BookmarkLink, link: "/i/bookmarks" },
  { name: "Communities", icon: icon.GroupIcon, link: "#group" },
  { name: "Premium", icon: icon.LogoIcon, link: "#premium" },
  { name: "Profile", icon: ProfileLink, link: "/profile" },
  // { name: "More", icon: icon.MenuIcon, link: "/#more" },
];

const hamburgerNavbarLink = [
  { name: "Profile", icon: icon.PersonIcon, link: "/profile" },
  { name: "Premium", icon: icon.LogoIcon, link: "#premium" },
  { name: "Lists", icon: icon.ListIcon, link: "#list" },
  { name: "Bookmarks", icon: icon.BookmarkIcon, link: "#bookmark" },
  { name: "Communities", icon: icon.GroupIcon, link: "#group" },
  { name: "Monetization", icon: icon.MonetIcon, link: "#monetization" },
];

const SettingsAndSupport = [
  { name: "Settings and privacy", icon: GoGear },
  { name: "Help Center", icon: icon.HelpIcon },
  { name: "Data Saver", icon: icon.DataSaverIcon },
  { name: "Display", icon: icon.DisplayIcon },
  { name: "Keyboard shortcuts", icon: icon.ShortcutIcon },
];

const userMenu = [
  { name: "Posts", href: "" },
  { name: "Replies", href: "/with_replies" },
  { name: "Highlights", href: "/highlights" },
  { name: "Media", href: "/media" },
  { name: "Likes", href: "/likes" },
];

const TweetButton = [
  { name: "Reply", icon: icon.CommentIcon, action: null },
  { name: "Repost", icon: icon.RetweetIcon, action: null },
  { name: "Like", icon: icon.LikeIcon, action: null },
  { name: "Analytic", icon: icon.AnalyticIcon, action: null },
  { name: "Bookmark", icon: icon.BookmarkIcon, action: null },
  { name: "Share", icon: icon.ShareIcon, action: null },
];

const createTweetActions = [
  { name: "GIF", icon: icon.GifIcon },
  { name: "Poll", icon: icon.PollIcon },
  { name: "Emoji", icon: icon.EmojiIcon },
  { name: "Schedule", icon: icon.ScheduleIcon },
  { name: "Location", icon: icon.LocationIcon },
];

const replyTweetActions = [...createTweetActions].filter(
  (item) => item.name != "Schedule" && item.name != "Poll"
);

export {
  navbarLink,
  TweetButton,
  createTweetActions,
  replyTweetActions,
  userMenu,
  hamburgerNavbarLink,
  SettingsAndSupport,
};
