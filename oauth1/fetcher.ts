import { createSigningKey } from "./hmac.ts";
import { OAuth1aCredential } from "./types.ts";
import * as OAuth1 from "./oauth1a.ts";
import * as Hmac from "./hmac.ts";
import { resolveURL } from "../utils/url.ts";

/**
 * {@link https://developer.twitter.com/en/docs/authentication/oauth-1-0a OAuth 1.0a | Docs | Twitter Developer Platform}
 *
 * ```js
 * import { oauth1a } from "jsr:@nexterias/twitter-api-fetch";
 *
 * const fetcher = await oauth1a({
 *   consumerKey: "Your consumer key here.",
 *   secretConsumerKey: "Your consumer key (secret) here.",
 *   accessToken: "Your access token here.",
 *   secretAccessToken: "Your access token (secret) here.",
 * });
 *
 * const response = await fetcher("/2/tweets", {
 *   method: "POST",
 *   headers: {
 *     "Content-Type": "application/json",
 *   },
 *   body: JSON.stringify({
 *     text: "大いなる力には、大いなる責任が伴う",
 *   }),
 * });
 *
 * console.log(response);
 * console.log(await response.json());
 * ```
 */
export const fetcher = async (
  credentials: Readonly<OAuth1aCredential>,
): Promise<
  (input: string | Request, init?: RequestInit) => Promise<Response>
> => {
  const signingKey = await createSigningKey({
    secretAccessToken: credentials.secretAccessToken,
    secretConsumerKey: credentials.secretConsumerKey,
  });

  return async (input: string | Request, init?: RequestInit) => {
    const url = resolveURL(input);
    const request = new Request(url.toString(), init);
    const params = await Hmac.sign(
      signingKey,
      request,
      OAuth1.createBaseParams(credentials.accessToken, credentials.consumerKey),
    );
    const headers = OAuth1.createHttpHeader(params);

    for (const [name, value] of headers) request.headers.set(name, value);

    return fetch(request);
  };
};
