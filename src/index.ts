import { OAuth1a, OAuth1aCredential } from './oauth1a.js'

export type { OAuth1aCredential } from './oauth1a.js'
export { OAuth1a } from './oauth1a.js'

export const oauth1a = (credential: OAuth1aCredential): OAuth1a =>
  new OAuth1a(credential)
