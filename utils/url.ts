export const ALLOW_HOSTNAMES: Set<string> = new Set([
  "gnip-stream.twitter.com",
  "data-api.twitter.com",
  "gnip-stream.gnip.com",
  "api.twitter.com",
  "gnip-api.twitter.com",
]);

export const resolveURL = (info: string | Request): URL => {
  const url = new URL(
    typeof info === "string" ? info : info.url,
    "https://api.twitter.com",
  );

  if (url.protocol !== "https:") throw new Error("The protocol must be HTTPS.");
  if (!ALLOW_HOSTNAMES.has(url.hostname)) {
    throw new Error(
      `Allowed hosts are ${
        [...ALLOW_HOSTNAMES].map((it) => `"${it}"`).join(", ")
      }.`,
    );
  }

  return url;
};
