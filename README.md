# twitter-fetch

[![codecov](https://codecov.io/gh/NEXTERIAS/twitter-fetch/branch/main/graph/badge.svg?token=9A7VFTMH3R)](https://codecov.io/gh/NEXTERIAS/twitter-fetch)
[![Tests](https://github.com/NEXTERIAS/twitter-fetch/actions/workflows/tests.yml/badge.svg?branch=main)](https://github.com/NEXTERIAS/twitter-fetch/actions/workflows/tests.yml)

twitter-fetch is a Node.js library for accessing the Twitter API.

It has a fetch-like implementation based on [node-fetch](https://github.com/node-fetch/node-fetch).

## Installation

```sh
npm i twitter-fetch

# Yarn
yarn add twitter-fetch

# pnpm
pnpm i twitter-fetch
```

## Usage

```mjs
import { OAuth1a } from 'twitter-fetch'

const client = new OAuth1a({
  accessToken: 'your access token',
  consumerKey: 'your consumer key',
  secretAccessToken: 'your secret access token',
  secretConsumerKey: 'your secret consumer key',
})

const response = await fetch(
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
