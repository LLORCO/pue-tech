import { it, expect } from "vitest";
import { slugify, uniqueSlug } from "./slug";

it("slugify quita acentos y signos", () => {
  expect(slugify("Meetup de IA ¡Puebla!")).toBe("meetup-de-ia-puebla");
});
it("uniqueSlug agrega sufijo", () => {
  expect(uniqueSlug("a", ["a", "a-2"])).toBe("a-3");
  expect(uniqueSlug("b", ["a"])).toBe("b");
});
