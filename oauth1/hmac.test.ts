import * as hmac from "./hmac.ts";
import { assertStrictEquals } from "../deps_test.ts";

const credentials = {
  secretAccessToken: "LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE",
  secretConsumerKey: "kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw",
} as const;

Deno.test("combineKeys", () => {
  const key = hmac.combineKeys(credentials);

  assertStrictEquals(
    key,
    "kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw&LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE",
  );
});

Deno.test("createSigningKey", async () => {
  const key = await hmac.createSigningKey(credentials);

  assertStrictEquals(key.algorithm.name, "HMAC");
  assertStrictEquals(key.type, "secret");
  assertStrictEquals(key.extractable, false);
});
