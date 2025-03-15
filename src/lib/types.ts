import type { ActionData } from "../routes/blog/$types";
import type { Comment, Event, Post } from "./server/db/schema";

export type EventsArray = Array<Event>;

export type CommentsArray = Array<Comment>;

export type PostsArray = Array<Post>;

export type EventComponent = Event & {
  events?: EventsArray | undefined;
  comments?: number | null | undefined;
} & {
  detailed?: boolean;
};

export type CommentComponent = Comment & {
  comments?: CommentsArray | undefined;
};

export type PostComponent = Post & {
  posts?: PostsArray | undefined;
  authorName: string;
} & {
  preview?: boolean;
} & { form: ActionData };

export type LayoutData = {
  user: UserInfoData;
  recentComments: RecentCommentsData;
};

export type UserInfoData = {
  id: string;
  username: string;
} | null;

export type RecentCommentsData = Array<{
  id: number;
  author: string;
  date: Date;
  event_name: string;
  event_slug: string;
}>;
