import type Camera from "./camera";

export interface FrameInfo {
  camera: Camera;
  commandBuffer: GPUCommandBuffer;
}