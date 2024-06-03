import type Camera from "../camera";
import type Entity from "../entity";
import type Renderer from "../systems/renderer";
import type Renderable from "./renderable";
import type System from "./system";

export default interface Universe {
  label: string;

  device: GPUDevice,
  camera: Camera;
  renderer: Renderer;
  system: System | undefined;
  canvas: HTMLCanvasElement;
  entities: Renderable[];

  init(universe: Universe): Promise<void>;
}