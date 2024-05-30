import { mat4, type Mat4 } from "wgpu-matrix";

export default class Renderer3DUniform {
  private modelMatrix: Mat4 = mat4.identity();
  private projectionMatrix: Mat4 = mat4.identity();
  private viewMatrix: Mat4 = mat4.identity();

  public getData(): Float32Array {
    const floatData = new Float32Array(16 * 3);
    floatData.set(this.modelMatrix as Float32Array, 0);
    floatData.set(this.projectionMatrix as Float32Array, 16);
    floatData.set(this.viewMatrix as Float32Array, 32);
    return floatData;
  }

  public get ModelMatrix(): Mat4 {
    return this.modelMatrix;
  }

  public get ProjectionMatrix(): Mat4 {
    return this.projectionMatrix;
  }

  public get ViewMatrix(): Mat4 {
    return this.viewMatrix;
  }

  public set ModelMatrix(mat: Mat4) {
    this.modelMatrix = mat;
  }

  public set ViewMatrix(mat: Mat4) {
    this.viewMatrix = mat;
  }

  public set ProjectionMatrix(mat: Mat4) {
    this.projectionMatrix = mat;
  }

  public static get bufferSize(): number {
    return 64 * 3;
  }
}