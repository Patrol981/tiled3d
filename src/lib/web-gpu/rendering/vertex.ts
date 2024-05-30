import { vec3, vec2, type Vec3, type Vec2 } from "wgpu-matrix";

export default class Vertex {
  public position: Vec3 = vec3.zero();
  public color: Vec3 = vec3.zero();
  public normal: Vec3 = vec3.zero();
  public uv: Vec2 = vec2.zero();

  constructor(pos: Vec3, color: Vec3, normal: Vec3, uv: Vec2) {
    this.position = pos;
    this.color = color;
    this.normal = normal;
    this.uv = uv;
  }

  public toFloat32Array(): Float32Array {
    const floatArray = new Float32Array(11);
    floatArray.set(this.position, 0);
    floatArray.set(this.color, 3);
    floatArray.set(this.normal, 6);
    floatArray.set(this.uv, 9);
    return floatArray;
  }

  public static get byteLength(): number {
    return (12 * 3) + 8;
  }
}