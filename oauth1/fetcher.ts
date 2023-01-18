import { createSigningKey } from "./hmac.ts";
import { OAuth1aCredential } from "./types.ts";
import * as OAuth1 from "./oauth1a.ts";
import * as Hmac from "./hmac.ts";
import { resolveURL } from "../utils/url.ts";

export const fetcher = async (credentials: Readonly<OAuth1aCredential>) => {
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
