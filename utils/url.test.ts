import { assertStrictEquals, assertThrows } from "../deps_test.ts";
import { resolveURL } from "./url.ts";

Deno.test("resolveURL", () => {
  const patterns = [
    [
      resolveURL("https://api.twitter.com/2/tweets"),
      "https://api.twitter.com/2/tweets",
    ],
    [resolveURL("/2/tweets"), "https://api.twitter.com/2/tweets"],
    [resolveURL("2/tweets"), "https://api.twitter.com/2/tweets"],
    [
      resolveURL(new Request("https://api.twitter.com/2/tweets")),
      "https://api.twitter.com/2/tweets",
    ],
  ] as const;

  for (const [url, expected] of patterns) {
    assertStrictEquals(url.toString(), expected);
  }
});

Deno.test("Throws an error if hostname is not api.twitter.com", () => {
  assertThrows(() => resolveURL("https://api.example.com/2/tweets"));
});

Deno.test("Throws an error if protocol is not https", () => {
  assertThrows(() => resolveURL("http://api.twitter.com/2/tweets"));
});
