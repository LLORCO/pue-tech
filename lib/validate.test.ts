import { it, expect } from "vitest";
import { validateEvent } from "./validate";

const ok = {
  title: "Meetup",
  description: "desc",
  communitySlug: "desarrollo-web",
  start: "2026-12-01T18:00:00-06:00",
  end: "2026-12-01T20:00:00-06:00",
  venue: "Centro",
  online: false,
  registrationUrl: "https://example.com",
  topics: [],
  submittedBy: "Ana",
};

it("input completo es válido", () => expect(validateEvent(ok)).toEqual({}));
it("falta título", () => expect(validateEvent({ ...ok, title: "  " }).title).toBeTruthy());
it("fin antes del inicio", () =>
  expect(validateEvent({ ...ok, end: "2026-12-01T17:00:00-06:00" }).end).toBeTruthy());
it("url inválida", () => expect(validateEvent({ ...ok, registrationUrl: "no-es-url" }).registrationUrl).toBeTruthy());
it("sin lugar y no en línea", () => expect(validateEvent({ ...ok, venue: "" }).venue).toBeTruthy());
