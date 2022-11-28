# twitter-api-fetch

[![codecov](https://codecov.io/gh/NEXTERIAS/twitter-api-fetch/branch/main/graph/badge.svg?token=9A7VFTMH3R)](https://codecov.io/gh/NEXTERIAS/twitter-api-fetch)
[![Tests](https://github.com/NEXTERIAS/twitter-api-fetch/actions/workflows/tests.yml/badge.svg?branch=main)](https://github.com/NEXTERIAS/twitter-api-fetch/actions/workflows/tests.yml)

**twitter-api-fetch** is a Node.js library for accessing the Twitter API.

It has a fetch-like implementation based on [node-fetch](https://github.com/node-fetch/node-fetch).

## Installation

```sh
npm i twitter-api-fetch

# Yarn
yarn add twitter--api-fetch

# pnpm
pnpm i twitter-api-fetch
```

## Usage

```mjs
import { OAuth1a } from 'twitter-api-fetch'

const client = new OAuth1a({
  accessToken: 'your access token',
  consumerKey: 'your consumer key',
  secretAccessToken: 'your secret access token',
  secretConsumerKey: 'your secret consumer key',
})

const response = await client.fetch(
  `/1.1/statuses/update.json?status=${encodeURIComponent('Hello World')}`,
  { method: 'POST' }
)

console.log(await response.json())
```

## Supports

- Authentication
  - [x] OAuth 1.0a User Context
  - [ ] OAuth 2.0 Authorization Code Flow with PKCE
  - [ ] App only
  - [ ] Basic authentication

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
