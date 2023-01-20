const reservedCharacters: ReadonlySet<string> = new Set([
  "!",
  "*",
  "'",
  "(",
  ")",
]);

export function encode(value: string): string {
  let encodedText = "";

  for (const string_ of encodeURIComponent(value)) {
    if (!reservedCharacters.has(string_)) {
      encodedText += string_;

      continue;
    }

    encodedText += "%" + string_.codePointAt(0)!.toString(16);
  }

  return encodedText;
}
