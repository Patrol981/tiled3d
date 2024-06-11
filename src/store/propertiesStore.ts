import { writable } from "svelte/store";

const MODEL_PROPERTIES = "model_properties"

export type Properties = {
  modelProperties: ModelProperties[];
}

export type ModelProperties = {
  ySize: number;
};

export const isPropertiesTabOpen = writable(false);
export const propertiesData = writable<Properties>();

export function saveToPropertiesLocalStore(properties: ModelProperties): void {
  const data = JSON.stringify(properties);
  localStorage.setItem(MODEL_PROPERTIES, data);
}

export function readFromPropertiesLocalStore(): ModelProperties[] {
  const properties = localStorage.getItem(MODEL_PROPERTIES);
  if(!properties) throw new Error("[PROPERTIES] Could not read local storage data.");
  return JSON.parse(properties);
}