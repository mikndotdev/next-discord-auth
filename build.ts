import { $ } from "bun";

await $`tsc`;
await $`mkdir -p dist/types`;
await $`cp types/*.d.ts dist/types/`;

console.log("Build completed successfully!");
