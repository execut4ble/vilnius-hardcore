export type VenueEvent = {
    date: string;
    title: string;
    slug: string;
    description: string;
    detailed: boolean;
    image: string;
};

export type EventArray = Array<VenueEvent>;