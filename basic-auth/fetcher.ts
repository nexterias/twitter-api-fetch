import { encodeBase64 } from "@std/encoding/base64";
import { resolveURL } from "../utils/url.ts";

/**
 * Fetch API for using Twitter Enterprise API
 *
 * See details: {@link https://developer.twitter.com/en/docs/authentication/basic-auth Basic authentication | Docs | Twitter Developer Platform}
 *
 * ```js
 * import { basicAuth } from "jsr:@nexterias/twitter-api-fetch";
 *
 * const fetcher = basicAuth("example", "example");
 * const response = await fetcher("https://api.twitter.com/1.1/account_activity/webhooks.json");
 * const data = await response.json();
 *
 * console.log(response);
 * console.log(data);
 * ```
 *
 * @param username your email address
 * @param password your password
 */
export const fetcher = (
  username: string,
  password: string,
): (input: string | Request, init?: RequestInit) => Promise<Response> => {
  const token = encodeBase64(`${username}:${password}`);

  return (input: string | Request, init?: RequestInit) => {
    const url = resolveURL(input);
    const request = new Request(url.toString(), init);

    request.headers.set("Authorization", token);

    return fetch(request);
  };
};
