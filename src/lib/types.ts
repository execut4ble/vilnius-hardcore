export type VenueEvent = {
    date: Date;
    title: string;
    slug: string;
    description: string;
    detailed: boolean;
    image: string;
};

export type EventArray = Array<VenueEvent>;