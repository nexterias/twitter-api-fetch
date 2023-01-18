export interface OAuth1aCredential {
  accessToken: string;
  consumerKey: string;
  secretAccessToken: string;
  secretConsumerKey: string;
}

export type OAuth1aParameterKeys =
  | "oauth_consumer_key"
  | "oauth_nonce"
  | "oauth_timestamp"
  | "oauth_token"
  | "oauth_version"
  | "oauth_signature_method"
  | "oauth_signature";

export type OAuth1aBaseParameters = Map<
  Exclude<OAuth1aParameterKeys, "oauth_signature" | "oauth_signature_method">,
  string
>;

export type OAuth1aSignedParameters = ReadonlyMap<OAuth1aParameterKeys, string>;
