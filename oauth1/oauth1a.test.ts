import { assertInstanceOf, assertStrictEquals } from "@std/assert";
import { stub } from "@std/testing/mock";
import { FakeTime } from "@std/testing/time";
import { createBaseParams, createHttpHeader } from "./oauth1a.ts";

Deno.test("createBaseParams", () => {
  const time = new FakeTime(1318622958000);
  const stubGetRandomValues = stub(
    crypto,
    "getRandomValues",
    () =>
      new Uint8Array([
        167,
        109,
        43,
        156,
        90,
        97,
        202,
        75,
        90,
        128,
        151,
        72,
        54,
        132,
        108,
        86,
        212,
        219,
        228,
        221,
        69,
        77,
        149,
        65,
        67,
        180,
        231,
        205,
        203,
        233,
        250,
        210,
      ]),
  );

  try {
    const params = createBaseParams(
      "370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb",
      "xvz1evFS4wEEPTGEFPHBog",
    );

    assertInstanceOf(params, Map);
    assertStrictEquals(
      params.get("oauth_nonce"),
      "p20rnFphyktagJdINoRsVtTb5N1FTZVBQ7Tnzcvp+tI=",
    );
    assertStrictEquals(params.get("oauth_timestamp"), "1318622958");
    assertStrictEquals(params.get("oauth_version"), "1.0");
    assertStrictEquals(
      params.get("oauth_consumer_key"),
      "xvz1evFS4wEEPTGEFPHBog",
    );
    assertStrictEquals(
      params.get("oauth_token"),
      "370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb",
    );
  } finally {
    time.restore();
    stubGetRandomValues.restore();
  }
});

Deno.test("createHttpHeader", () => {
  const time = new FakeTime(1318622958000);
  const stubGetRandomValues = stub(
    crypto,
    "getRandomValues",
    () =>
      new Uint8Array([
        167,
        109,
        43,
        156,
        90,
        97,
        202,
        75,
        90,
        128,
        151,
        72,
        54,
        132,
        108,
        86,
        212,
        219,
        228,
        221,
        69,
        77,
        149,
        65,
        67,
        180,
        231,
        205,
        203,
        233,
        250,
        210,
      ]),
  );

  try {
    const params = createBaseParams(
      "370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb",
      "xvz1evFS4wEEPTGEFPHBog",
    );
    const headers = createHttpHeader(params);

    assertStrictEquals(
      headers.get("Authorization"),
      'OAuth oauth_consumer_key="xvz1evFS4wEEPTGEFPHBog", oauth_nonce="p20rnFphyktagJdINoRsVtTb5N1FTZVBQ7Tnzcvp%2BtI%3D", oauth_timestamp="1318622958", oauth_token="370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb", oauth_version="1.0"',
    );
  } finally {
    time.restore();
    stubGetRandomValues.restore();
  }
});
