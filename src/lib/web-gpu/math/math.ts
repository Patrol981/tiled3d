import type { Mat4 } from "wgpu-matrix";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getMat4Data(mat4: Mat4, row: number, col: number) {
  return mat4[row + col * 4];
}

function setMat4Data(mat4: Mat4, row: number, col: number, value: number) {
  mat4[row + col * 4] = value;
}

export { clamp, getMat4Data, setMat4Data }