import { assertStrictEquals } from "@std/assert";
import * as percent from "./percent.ts";

Deno.test("encode", () => {
  assertStrictEquals(
    percent.encode("Ladies + Gentlemen"),
    "Ladies%20%2B%20Gentlemen",
  );
  assertStrictEquals(
    percent.encode("An encoded string!"),
    "An%20encoded%20string%21",
  );
  assertStrictEquals(
    percent.encode("Dogs, Cats & Mice"),
    "Dogs%2C%20Cats%20%26%20Mice",
  );
  assertStrictEquals(percent.encode("☃"), "%E2%98%83");
});
