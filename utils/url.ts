export const resolveURL = (info: string | Request) => {
  const url = new URL(
    typeof info === "string" ? info : info.url,
    "https://api.twitter.com",
  );

  if (url.protocol !== "https:") throw new Error("The protocol must be HTTPS.");
  if (url.hostname !== "api.twitter.com") {
    throw new Error('Requests can only be sent to "api.twitter.com".');
  }

  return url;
};
