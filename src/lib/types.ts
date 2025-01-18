export type EventObject = {
  id: number;
  date: Date | string;
  title: string | null;
  slug: string | null;
  description: string | null;
  image: string | null;
  comments?: number | null;
};

export type CommentObject = {
  id: number;
  date: Date | string;
  author: string;
  content: string | null;
};

export type EventsArray = Array<EventObject>;

export type CommentsArray = Array<CommentObject>;

export type EventComponent = EventObject & {
  events?: EventsArray | undefined;
} & {
  detailed?: boolean;
};

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
