import {
  OAuth1aBaseParameters,
  OAuth1aCredential,
  OAuth1aParameterKeys,
  OAuth1aSignedParameters,
} from "./types.ts";
import * as percent from "../utils/percent.ts";
import { encodeBase64 } from "@std/encoding/base64";

/**
 * {@link https://developer.twitter.com/en/docs/authentication/oauth-1-0a/creating-a-signature Creating a signature | Docs | Twitter Developer Platform} - Getting a signing key
 * @param credentials
 * @returns
 */
export const combineKeys = (
  credentials: Pick<
    OAuth1aCredential,
    "secretAccessToken" | "secretConsumerKey"
  >,
) =>
  [
    credentials.secretConsumerKey,
    credentials.secretAccessToken,
  ].map((it) => percent.encode(it)).join("&");

export const createSigningKey = (
  credentials: Pick<
    OAuth1aCredential,
    "secretAccessToken" | "secretConsumerKey"
  >,
) => {
  const key = combineKeys(credentials);
  const textEncoder = new TextEncoder();

  return crypto.subtle.importKey(
    "raw",
    textEncoder.encode(key),
    {
      name: "HMAC",
      hash: "SHA-1",
    },
    false,
    ["sign"],
  );
};

export const sign = async (
  key: CryptoKey,
  request: Request,
  params: OAuth1aBaseParameters,
): Promise<OAuth1aSignedParameters> => {
  const clonedParams = new Map<OAuth1aParameterKeys, string>(params);

  clonedParams.set("oauth_signature_method", "HMAC-SHA1");

  const textEncoder = new TextEncoder();
  const url = new URL(request.url);
  const messageParameters = [...clonedParams, ...url.searchParams]
    .map(([key, value]) => [percent.encode(key), percent.encode(value)])
    .sort(([a], [b]) => a.localeCompare(b))
    .map((it) => it.join("="));
  const message = [
    request.method.toUpperCase(),
    percent.encode(url.origin + url.pathname),
    percent.encode(messageParameters.join("&")),
  ].join("&");
  const hash = await crypto.subtle.sign(
    {
      name: "HMAC",
      hash: "SHA-1",
    },
    key,
    textEncoder.encode(message),
  );

  clonedParams.set("oauth_signature", encodeBase64(hash));

  return clonedParams;
};
