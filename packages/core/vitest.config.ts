import vitestConfig from "@configs/vitest";

/** @ts-expect-error Because it expect not function */
export default vitestConfig(import.meta.dirname);
