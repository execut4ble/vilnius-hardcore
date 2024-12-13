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
