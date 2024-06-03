import type { FrameInfo } from "../frameInfo";
import type Renderable from "./renderable";

export default interface System {
  render(entities: Renderable[], frameInfo: FrameInfo): void;
}