import * as hmac from "./hmac.ts";
import { assertStrictEquals } from "../deps_test.ts";
import * as oauth1a from "./oauth1a.ts";

const credentials = {
  secretAccessToken: "LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE",
  secretConsumerKey: "kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw",
} as const;

Deno.test("combineKeys", () => {
  const key = hmac.combineKeys(credentials);

  assertStrictEquals(
    key,
    "kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw&LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE",
  );
});

Deno.test("createSigningKey", async () => {
  const key = await hmac.createSigningKey(credentials);

  assertStrictEquals(key.algorithm.name, "HMAC");
  assertStrictEquals(key.type, "secret");
  assertStrictEquals(key.extractable, false);
});

Deno.test("sign", async () => {
  const crypto = await hmac.createSigningKey(credentials);
  const params = oauth1a.createBaseParams(
    "370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb",
    "xvz1evFS4wEEPTGEFPHBog",
  );

  params.set("oauth_nonce", "kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg");
  params.set("oauth_timestamp", "1318622958");

  const signedParams = await hmac.sign(
    crypto,
    new Request(
      "https://api.twitter.com/1.1/statuses/update.json?include_entities=true&status=Hello%20Ladies%20%2b%20Gentlemen%2c%20a%20signed%20OAuth%20request%21",
      {
        method: "POST",
      },
    ),
    params,
  );

  assertStrictEquals(
    signedParams.get("oauth_signature"),
    "hCtSmYh+iHYCEqBWrE7C7hYmtUk=",
  );
  assertStrictEquals(signedParams.get("oauth_signature_method"), "HMAC-SHA1");
});
