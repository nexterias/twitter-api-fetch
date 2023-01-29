import {
  assertInstanceOf,
  assertSpyCalls,
  assertStrictEquals,
  stub,
} from "../deps_test.ts";
import { fetcher as oauth2 } from "./fetcher.ts";

Deno.test('When calling fetch, the "Authorization" header must be set to the correct value.', async () => {
  const stubFetch = stub(globalThis, "fetch", (input, _init) => {
    assertInstanceOf(input, Request);
    assertStrictEquals(
      input.headers.get("Authorization"),
      "Bearer S2F3YXNlbWk=",
    );

    return Promise.resolve(new Response());
  });

  try {
    const fetcher = oauth2("S2F3YXNlbWk=");

    await Promise.all([
      fetcher("/2/tweets"),
      fetcher("1.1/statuses/update.json"),
    ]);

    assertSpyCalls(stubFetch, 2);
  } finally {
    stubFetch.restore();
  }
});
