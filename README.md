# twitter-api-fetch

[![codecov](https://codecov.io/gh/nexterias/twitter-api-fetch/branch/main/graph/badge.svg?token=9A7VFTMH3R)](https://codecov.io/gh/nexterias/twitter-api-fetch)
[![Tests](https://github.com/nexterias/twitter-api-fetch/actions/workflows/tests.yml/badge.svg?branch=main)](https://github.com/nexterias/twitter-api-fetch/actions/workflows/tests.yml)
[![JSR](https://jsr.io/badges/@nexterias/twitter-api-fetch)](https://jsr.io/@nexterias/twitter-api-fetch)
[![JSR Score](https://jsr.io/badges/@nexterias/twitter-api-fetch/score)](https://jsr.io/@nexterias/twitter-api-fetch)

fetch-like implementation designed for Twitter API

## Usage

> [!Important] Since v3,
> [twitter-api-fetch](https://jsr.io/@nexterias/twitter-api-fetch) is now
> published in [JSR](https://jsr.io). If you are using
> [deno.land/x/twitter_api_fetch](https://deno.land/x/twitter_api_fetch) or
> [npm package](https://npmjs.com/package/twitter-api-fetch), please use JSR.

```bash
$ deno add @nexterias/twitter-api-fetch # Deno

$ bunx jsr add @nexterias/twitter-api-fetch # Bun

$ npx jsr add @nexterias/twitter-api-fetch # npm
$ yarn dlx jsr add @nexterias/twitter-api-fetch # yarn
$ pnpm dlx jsr add @nexterias/twitter-api-fetch # pnpm
```

```js
import { oauth1a } from "@nexterias/twitter-api-fetch";

const fetcher = await oauth1a({
  consumerKey: "Your consumer key here.",
  secretConsumerKey: "Your consumer key (secret) here.",
  accessToken: "Your access token here.",
  secretAccessToken: "Your access token (secret) here.",
});

const response = await fetcher("/2/tweets", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    text: "大いなる力には、大いなる責任が伴う",
  }),
});

console.log(response);
console.log(await response.json());
```

### Cloudflare Workers

```ts
import { oauth1a } from "@nexterias/twitter-api-fetch";

export interface Env {
  TWITTER_API_ACCESS_TOKEN: string;
  TWITTER_API_SECRET_ACCESS_TOKEN: string;
  TWITTER_API_CONSUMER_KEY: string;
  TWITTER_API_SECRET_CONSUMER_KEY: string;
}

export default {
  async fetch(
    _request: Request,
    env: Env,
    _ctx: ExecutionContext,
  ): Promise<Response> {
    const fetcher = await oauth1a({
      accessToken: env.TWITTER_API_ACCESS_TOKEN,
      consumerKey: env.TWITTER_API_CONSUMER_KEY,
      secretAccessToken: env.TWITTER_API_SECRET_ACCESS_TOKEN,
      secretConsumerKey: env.TWITTER_API_SECRET_CONSUMER_KEY,
    });
    const response = await fetcher(
      "/2/users/910317474951786496/tweets",
      {
        cf: {
          cacheTtl: 600,
        },
      },
    );

    if (!response.ok) {
      return new Response(
        JSON.stringify({ message: "Internal Server Error" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const tweets = await response.json();

    console.log(tweets);

    return new Response(JSON.stringify(tweets), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};
```

## Authentication

- [x] OAuth 1.0a User Context
- [x] OAuth 2.0 Authorization Code Flow with PKCE
- [x] App only
- [x] Basic authentication

> **Note** Regarding **OAuth 2.0 Authorization Code Flow with PKCE**,
> `twitter-api-fetch` does not currently provide any functionality to assist in
> the process of issuing access tokens.

## License

```txt
MIT License

Copyright (c) 2022 The NEXTERIAS

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
