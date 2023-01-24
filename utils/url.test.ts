import {
  assertInstanceOf,
  assertStrictEquals,
  assertThrows,
} from "../deps_test.ts";
import { resolveURL } from "./url.ts";

Deno.test("Returns URL (string) when a Request object is passed", () => {
  const request = new Request("https://data-api.twitter.com", {
    method: "POST",
  });
  const url = resolveURL(request);

  assertInstanceOf(url, URL);
  assertStrictEquals(url.protocol, "https:");
  assertStrictEquals(url.hostname, "data-api.twitter.com");
  assertStrictEquals(url.toString(), "https://data-api.twitter.com/");
});

Deno.test('Resolve to "https://api.twitter.com" if there is no origin by default.', () => {
  const urls = [
    resolveURL("/2/tweets"),
    resolveURL("2/tweets"),
  ] as const;

  for (const url of urls) {
    assertInstanceOf(url, URL);
    assertStrictEquals(url.protocol, "https:");
    assertStrictEquals(url.hostname, "api.twitter.com");
    assertStrictEquals(url.toString(), "https://api.twitter.com/2/tweets");
  }
});

Deno.test("Throws an error if any host is not included in ALLOW_HOSTNAMES", () => {
  assertThrows(() => resolveURL("https://api.example.com/2/tweets"));
});

Deno.test("Throws an error if protocol is not https", () => {
  assertThrows(() => resolveURL("http://gnip-stream.gnip.com/2/tweets"));
});
