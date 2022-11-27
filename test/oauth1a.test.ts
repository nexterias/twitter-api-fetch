/* eslint-disable unicorn/no-abusive-eslint-disable */
/* eslint-disable */
import fetch, { Request } from 'node-fetch'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  MockInstance,
  vi,
} from 'vitest'
import { OAuth1a, OAuth1aCredential } from '../src/oauth1a.js'

const nonce = 'kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg'

vi.mock('node-fetch', async () => {
  const nodeFetch = await vi.importActual<typeof import('node-fetch')>(
    'node-fetch'
  )

  return { ...nodeFetch, default: vi.fn() }
})

vi.mock('node:crypto', async () => {
  const randomBytes = vi.fn(() => ({
    toString: (): string => nonce,
  }))

  const crypto = await vi.importActual<typeof import('node:crypto')>(
    'node:crypto'
  )

  return { ...crypto, randomBytes }
})

describe('OAuth1.0a', () => {
  const credential: OAuth1aCredential = {
    accessToken: '370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb',
    consumerKey: 'xvz1evFS4wEEPTGEFPHBog',
    secretAccessToken: 'LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE',
    secretConsumerKey: 'kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw',
  }
  let target: OAuth1a

  beforeEach(() => {
    // 認証情報は公式ドキュメントのものを引用しています。
    // https://developer.twitter.com/en/docs/authentication/oauth-1-0a/creating-a-signature
    target = new OAuth1a(credential)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('OAuth1a#signingKey', () => {
    expect(target['signingKey']).toBe(
      'kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw&LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE'
    )
  })

  it('OAuth1a#_createParameters', () => {
    vi.setSystemTime(1_318_622_958_000)

    const parameters = target['_createParameters']()

    expect(parameters.get('oauth_consumer_key')).toBe(credential.consumerKey)
    expect(parameters.get('oauth_version')).toBe('1.0')
    expect(parameters.get('oauth_token')).toBe(credential.accessToken)
    expect(parameters.get('oauth_timestamp')).toBe('1318622958')
    expect(parameters.get('oauth_nonce')).toBe(nonce)
  })

  it('OAuth1a#_sign', () => {
    vi.setSystemTime(1_318_622_958_000)

    const parameters = target['_createParameters']()
    const url = new URL('https://api.twitter.com/1.1/statuses/update.json')

    url.searchParams.append('include_entities', 'true')
    url.searchParams.append(
      'status',
      'Hello Ladies + Gentlemen, a signed OAuth request!'
    )

    const request = new Request(url.toString(), { method: 'POST' })

    target['_sign'](parameters, request)

    expect(parameters.get('oauth_signature_method')).toBe('HMAC-SHA1')
    expect(parameters.get('oauth_signature')).toBe(
      'hCtSmYh+iHYCEqBWrE7C7hYmtUk='
    )
  })

  it('OAuth1a#_createRequest', () => {
    const badRequests = [
      'https://example.com/1.1/statuses/update.json?status=HAHAHA',
      'http://api.twitter.com/1.1/statuses/update.json?status=Insecure',
      new Request('https://example.com/1.1/statuses/update.json?status=HAHAHA'),
      new Request(
        'http://api.twitter.com/1.1/statuses/update.json?status=Insecure'
      ),
    ]
    const goodRequests = [
      'https://api.twitter.com/1.1/statuses/update.json?status=HAHAHA',
      '/1.1/statuses/update.json?status=HAHAHA',
      new Request(
        'https://api.twitter.com/1.1/statuses/update.json?status=HAHAHA'
      ),
    ]

    for (const url of badRequests)
      expect(() => target['_createRequest'](url)).toThrowError()
    for (const url of goodRequests)
      expect(target['_createRequest'](url).url).toStrictEqual(
        'https://api.twitter.com/1.1/statuses/update.json?status=HAHAHA'
      )
  })

  it('OAuth1a#fetch', async () => {
    vi.setSystemTime(1_318_622_958_000)

    const url = new URL('https://api.twitter.com/1.1/statuses/update.json')

    url.searchParams.append('include_entities', 'true')
    url.searchParams.append(
      'status',
      'Hello Ladies + Gentlemen, a signed OAuth request!'
    )

    await target.fetch(new Request(url.toString(), { method: 'POST' }))

    expect(fetch).toBeCalledTimes(1)

    const request = (fetch as unknown as MockInstance).mock.calls[0][0]

    expect(request).toBeInstanceOf(Request)
    expect((request as Request).headers.get('Authorization')).toStrictEqual(
      'OAuth oauth_consumer_key="xvz1evFS4wEEPTGEFPHBog", oauth_nonce="kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg", oauth_signature="hCtSmYh%2BiHYCEqBWrE7C7hYmtUk%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1318622958", oauth_token="370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb", oauth_version="1.0"'
    )
  })
})
