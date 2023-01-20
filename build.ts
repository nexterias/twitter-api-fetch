import { build, emptyDir } from "https://deno.land/x/dnt@0.33.0/mod.ts";

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
    version: Deno.args[0],
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
