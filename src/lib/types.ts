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

export type MenuData = {
  user: { id: string; username: string } | null;
  events?: EventsArray; // Optional
};
