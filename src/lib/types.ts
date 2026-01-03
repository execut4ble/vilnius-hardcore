import type { ActionData as BlogActionData } from "../routes/blog/$types";
import type { ActionData as EventActionData } from "../routes/events/$types";
import type {
  Comment,
  Event,
  Post as PostObject,
  BannedIp,
} from "./server/db/schema";

export type EventsArray = Array<Event>;

export type CommentsArray = Array<Comment>;

export type BannedIpsArray = Array<BannedIp>;

export type Post = Omit<PostObject, "disable_comments" | "author"> &
  // Make "author" and "disable_comments" optional to handle some cases
  // where "author" is missing/anonymous or "disable_comments" is not required in query
  Partial<Pick<PostObject, "disable_comments" | "author">>;

export type PostsArray = Array<Post>;

export type EventComponent = Event & {
  events?: EventsArray | undefined;
  comments?: number | null | undefined;
} & {
  detailed?: boolean;
} & { form?: EventActionData };

export type CommentComponent = Comment & {
  comments?: CommentsArray | undefined;
} & { isIpBanned?: boolean | undefined };

export type PostComponent = Post & {
  posts?: PostsArray | undefined;
  authorUsername?: string | null;
  comments?: number | null | undefined;
} & {
  preview?: boolean;
} & { form?: BlogActionData };

export type UserInfoData = {
  id: string;
  username: string;
} | null;

export type RecentComment = {
  id: number;
  author: string;
  date: Date | string;
  event_name?: string;
  event_slug?: string;
  post_title?: string;
  post_slug?: string;
};

export type RecentCommentsData = Array<RecentComment>;
