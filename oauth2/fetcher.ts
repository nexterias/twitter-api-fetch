import { resolveURL } from "../utils/url.ts";

/**
 * {@link https://developer.twitter.com/en/docs/authentication/oauth-2-0 OAuth 2.0 | Docs | Twitter Developer Platform}
 *
 * ```js
 * import { oauth2 } from "https://deno.land/x/twitter_api_fetch/mod.ts";
 *
 * const fetcher = oauth2("bearer token here.");
 *
 * console.log(await fetcher("/2/tweets"));
 * ```
 */
export const fetcher = (
  bearerToken: string,
): (input: string | Request, init?: RequestInit) => Promise<Response> => {
  return (input: string | Request, init?: RequestInit) => {
    const url = resolveURL(input);
    const request = new Request(url, init);

    request.headers.set("Authorization", `Bearer ${bearerToken}`);

    return fetch(request);
  };
};
