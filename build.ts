import { build, emptyDir } from "https://deno.land/x/dnt@0.33.0/mod.ts";
import * as semver from "https://deno.land/std@0.173.0/semver/mod.ts";

const trimVersion = (str: string) =>
  /^refs\/tags\/v(.+)$/.exec(str)?.at(1)?.trim();
const version = semver.valid(trimVersion(Deno.args[0]) ?? null);

if (!version) {
  console.error("Incorrect version");
  Deno.exit(1);
}

await emptyDir("npm");
await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  typeCheck: false,
  compilerOptions: {
    lib: ["dom", "esnext"],
    target: "ES2020",
  },
  package: {
    name: "twitter-api-fetch",
    version,
    description: "fetch-like implementation for Twitter API",
    author: "InkoHX <me@inkohx.dev>",
    homepage: "https://github.com/NEXTERIAS/twitter-api-fetch#readme",
    license: "MIT",
    repository: {
      type: "git",
      url: "https://github.com/NEXTERIAS/twitter-api-fetch.git",
    },
    bugs: {
      url: "https://github.com/NEXTERIAS/twitter-api-fetch/issues",
    },
    keywords: [
      "twitter-api",
      "fetch",
    ],
  },
  shims: {
    crypto: true,
    deno: "dev",
    custom: [{
      package: {
        name: "cross-fetch",
        version: "~3.1.5",
      },
      globalNames: [
        {
          name: "fetch",
          exportName: "default",
        },
        {
          name: "Request",
        },
        {
          name: "Response",
        },
        {
          name: "Headers",
        },
      ],
    }],
  },
});

Deno.copyFileSync("./README.md", "./npm/README.md");
Deno.copyFileSync("./LICENSE", "./npm/LICENSE");
