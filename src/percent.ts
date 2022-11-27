const reservedCharacters = new Set(['!', '*', "'", '(', ')'])

/**
 * RFC 3986 に従ってパーセントエンコーディングする関数
 * @param value パーセントエンコードする文字列
 * @returns パーセントエンコーディングされた文字列
 */
export function encode(value: string): string {
  let encodedText = ''

  for (const string_ of encodeURIComponent(value)) {
    if (!reservedCharacters.has(string_)) {
      encodedText += string_

      continue
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    encodedText += '%' + string_.codePointAt(0)!.toString(16)
  }

  return encodedText
}
