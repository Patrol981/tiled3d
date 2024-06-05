import { vec2, type Vec2, type Vec3 } from "wgpu-matrix";

function calculateUV(position: Vec3): Vec2 {
  return vec2.fromValues(position[0], position[2]);
}

export { calculateUV };