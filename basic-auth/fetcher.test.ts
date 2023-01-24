import {
  assertInstanceOf,
  assertSpyCalls,
  assertStrictEquals,
  stub,
} from "../deps_test.ts";
import { fetcher as basicAuth } from "./fetcher.ts";

Deno.test('When calling fetch, the "Authorization" header must be set to the correct value.', async () => {
  const stubFetch = stub(globalThis, "fetch", (input, _init) => {
    assertInstanceOf(input, Request);
    assertStrictEquals(
      input.headers.get("Authorization"),
      "ZXhhbXBsZTpleGFtcGxl",
    );

    return Promise.resolve(new Response());
  });

  try {
    const fetcher = basicAuth("example", "example");

    await Promise.all([
      fetcher("/1.1/account_activity/webhooks.json"),
      fetcher("https://gnip-api.twitter.com/search"),
    ]);

    assertSpyCalls(stubFetch, 2);
  } finally {
    stubFetch.restore();
  }
});
