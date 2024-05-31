import { vec3, vec2, type Vec3, type Vec2 } from "wgpu-matrix";

export default class SimpleVertex {
  public position: Vec3 = vec3.zero();
  public color: Vec3 = vec3.zero();

  constructor(pos: Vec3, color: Vec3) {
    this.position = pos;
    this.color = color;
  }

  public toFloat32Array(): Float32Array {
    const floatArray = new Float32Array(6);
    floatArray.set(this.position, 0);
    floatArray.set(this.color, 3);
    return floatArray;
  }

  public static get byteLength(): number {
    return 24;
  }
}