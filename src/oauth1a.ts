import { createHmac, randomBytes } from 'node:crypto'
import { URL } from 'node:url'

import fetch, { Request } from 'cross-fetch'
import * as percent from './percent.js'

type OAuth1Parameter = Map<string, string>

export interface OAuth1aCredential {
  accessToken: string
  consumerKey: string
  secretAccessToken: string
  secretConsumerKey: string
}

export class OAuth1a {
  private readonly signingKey: string

  public constructor(private readonly credential: OAuth1aCredential) {
    this.signingKey = [
      this.credential.secretConsumerKey,
      this.credential.secretAccessToken,
    ]
      .map(it => percent.encode(it))
      .join('&')
  }

  public fetch(url: RequestInfo, init?: RequestInit): Promise<Response> {
    const request = this._createRequest(url, init)
    const parameters = this._createParameters()

    this._sign(parameters, request)

    request.headers.set(
      'Authorization',
      `OAuth ${[...parameters]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) =>
          [percent.encode(key), `"${percent.encode(value)}"`].join('=')
        )
        .join(', ')}`
    )

    return fetch(request)
  }

  private _createParameters(): OAuth1Parameter {
    return new Map([
      ['oauth_consumer_key', this.credential.consumerKey],
      ['oauth_nonce', randomBytes(32).toString('base64')],
      ['oauth_timestamp', (Date.now() / 1000).toString()],
      ['oauth_token', this.credential.accessToken],
      ['oauth_version', '1.0'],
    ])
  }

  private _sign(parameters: OAuth1Parameter, request: Request): void {
    parameters.set('oauth_signature_method', 'HMAC-SHA1')

    const url = new URL(request.url)
    const messageParameters = [...parameters, ...url.searchParams]
      .map(([key, value]) => [percent.encode(key), percent.encode(value)])
      .sort(([a], [b]) => a.localeCompare(b))
      .map(it => it.join('='))
    const message = [
      request.method.toUpperCase(),
      percent.encode(url.origin + url.pathname),
      percent.encode(messageParameters.join('&')),
    ].join('&')

    const signature = createHmac('sha1', this.signingKey)
      .update(message)
      .digest('base64')

    parameters.set('oauth_signature', signature)
  }

  private _createRequest(url: RequestInfo, init?: RequestInit): Request {
    const parsedUrl = new URL(
      typeof url === 'string' ? url : url.url,
      'https://api.twitter.com'
    )

    if (parsedUrl.protocol !== 'https:')
      throw new Error('The protocol must be HTTPS.')
    if (parsedUrl.hostname !== 'api.twitter.com')
      throw new Error('Requests can only be sent to "api.twitter.com".')

    if (typeof url === 'string') return new Request(parsedUrl.toString(), init)
    else {
      Reflect.defineProperty(url, 'url', { value: parsedUrl.toString() })

      return new Request(url, init)
    }
  }
}
