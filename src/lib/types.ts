import type { PageData } from "../routes/$types";

export type EventObject = {
  id: number;
  date: Date | string;
  title: string | null;
  slug: string | null;
  description: string | null;
  image: string | null;
};

export type EventsArray = Array<EventObject>;

export type EventComponent = EventObject & {
  events?: EventsArray | undefined;
} & {
  detailed?: boolean;
};

export type MenuData = {
  user: { id: string; username: string } | null;
  events?: EventsArray; // Optional
};
