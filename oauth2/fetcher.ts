import { resolveURL } from "../utils/url.ts";

export const fetcher = (bearerToken: string) => {
  return (input: string | Request, init?: RequestInit) => {
    const url = resolveURL(input);
    const request = new Request(url, init);

    request.headers.set("Authorization", `Bearer ${bearerToken}`);

    return fetch(request);
  };
};
