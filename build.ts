import { $ } from "bun"

await $`tsc`
await $`cp types/index.d.ts dist/index.d.ts`

console.log("Build completed successfully!");
