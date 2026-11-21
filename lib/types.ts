export type Community = {
  slug: string;
  name: string;
  description: string;
  topics: string[];
  links: { label: string; url: string }[];
};

export type EventStatus = "pendiente" | "aprobado" | "rechazado";

export type TechEvent = {
  slug: string;
  title: string;
  description: string;
  communitySlug: string;
  start: string; // ISO con offset -06:00
  end: string;
  venue: string;
  online: boolean;
  registrationUrl: string;
  topics: string[];
  status: EventStatus;
  submittedBy: string;
};

export type Subscription = {
  email: string;
  communitySlugs: string[] | "todas";
  createdAt: string;
};

export type NewEventInput = Omit<TechEvent, "slug" | "status">;
