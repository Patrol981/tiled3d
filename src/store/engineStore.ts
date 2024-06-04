import { writable } from "svelte/store";
import type { WebGPUMemoryInfo } from "../lib/utils/memory";

export const perfInfo = writable<WebGPUMemoryInfo>();