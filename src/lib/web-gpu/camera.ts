import { mat4, vec3, type Mat4, type Vec3 } from "wgpu-matrix";
import Entity from "./entity";

export default class Camera extends Entity {
  private aspect!: number;
  private projectionMatrix!: Mat4;

  private front: Vec3 = [0, 0, 1];
  private up: Vec3 = [0, 1, 0];

  constructor(canvas: HTMLCanvasElement) {
    super();

    this.aspect = canvas.width / canvas.height;
    this.getProjectionMatrix(this.aspect);
  }

  public getProjectionMatrix(aspect: number): Mat4 {
    this.projectionMatrix = mat4.perspective((2 * Math.PI) / 5, aspect, 1, 100.0);
    this.aspect = aspect;
    return this.projectionMatrix;
  }

  public getViewMatrix(): Mat4 {
    return mat4.lookAt(this.Position, vec3.add(this.Position, this.front), this.up)
  }

  public get ProjectionMatrix(): Mat4 {
    return this.projectionMatrix;
  }

  public get Aspect(): number {
    return this.aspect;
  }
}