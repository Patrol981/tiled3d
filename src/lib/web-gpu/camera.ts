import { mat4, vec3, type Mat4, type Vec3 } from "wgpu-matrix";
import Entity from "./entity";
import { degToRad, radToDeg } from "./math/converter";
import { clamp } from "./math/math";

export default class Camera extends Entity {
  private aspect!: number;
  private projectionMatrix!: Mat4;
  private fov: number = 45.0;

  private front: Vec3 = [0, 0, 1];
  private up: Vec3 = [0, -1, 0];
  private forward: Vec3 = [0, 0, 1];
  private right: Vec3 = [1, 0, 0];

  private pitch: number = 0;
  private roll: number = -Math.PI;
  private yaw: number = 90.0;

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

  public setFront(value: Vec3) {
    this.front = value;
  }

  public getFront(): Vec3 {
    return this.front;
  }

  public setUp(value: Vec3) {
    this.up = value;
  }

  public getUp(): Vec3 {
    return this.up;
  }

  public updateVectors(): void {
    this.front[0] = Math.cos(this.yaw) * Math.cos(this.pitch);
    this.front[1] = Math.sin(this.pitch);
    this.front[2] = Math.cos(this.pitch) * Math.sin(this.yaw);

    // this.forward[0] = Math.cos(this.yaw);
    // this.forward[2] = Math.sin(this.yaw);

    // this.forward = vec3.normalize(this.forward);
    vec3.normalize(this.front, this.front);

    // this.right = vec3.normalize(vec3.cross(this.front, [0, 1, 0]));
    // this.up = vec3.normalize(vec3.cross(this.right, this.front));
  }

  public get ProjectionMatrix(): Mat4 {
    return this.projectionMatrix;
  }

  public get Aspect(): number {
    return this.aspect;
  }

  public get Pitch(): number {
    return radToDeg(this.pitch);
  }

  public get Yaw(): number {
    return radToDeg(this.yaw);
  }

  public get Fov(): number {
    return radToDeg(this.fov);
  }

  public set Pitch(value: number) {
    const angle = clamp(value, -89, 89);
    this.pitch = degToRad(angle);
    this.updateVectors();
  }

  public set Yaw(value: number) {
    this.yaw = degToRad(value);
    this.updateVectors();
  }

  public set Fov(value: number) {
    const angle = clamp(value, 1.0, 45.0);
    this.fov = degToRad(angle);
  }

  public get Right(): Vec3 {
    return this.right;
  }
}