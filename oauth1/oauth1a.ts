import { base64encode } from "../deps.ts";
import { OAuth1aBaseParameters, OAuth1aSignedParameters } from "./types.ts";
import * as percent from "../utils/percent.ts";

export const createBaseParams = (
  accessToken: string,
  consumerKey: string,
): OAuth1aBaseParameters => {
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));

  return new Map([
    ["oauth_consumer_key", consumerKey],
    ["oauth_nonce", base64encode(randomBytes)],
    ["oauth_timestamp", (Date.now() / 1000).toFixed(0)],
    ["oauth_token", accessToken],
    ["oauth_version", "1.0"],
  ]);
};

export const createHttpHeader = (
  params: OAuth1aSignedParameters,
): Headers => {
  const values = [...params]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) =>
      [percent.encode(key), `"${percent.encode(value)}"`].join("=")
    )
    .join(", ");

  return new Headers({
    "Authorization": `OAuth ${values}`,
  });
};
