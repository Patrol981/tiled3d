import { mat4, vec3, type Mat4, type Vec3 } from "wgpu-matrix";

export default class Entity {
  private position: Vec3;
  private rotation: Vec3;
  private scale: Vec3;

  constructor() {
    this.position = [.5,.5,.5];
    this.rotation = vec3.zero();
    this.scale = [1, 1, 1];
  }

  public get Position(): Vec3 {
    return this.position;
  }

  public get Scale(): Vec3 {
    return this.scale;
  }

  public get Rotation(): Vec3 {
    return this.rotation;
  }

  public set Position(vec3: Vec3) {
    this.Position = vec3;
  }

  public set Scale(vec3: Vec3) {
    this.scale = vec3;
  }

  public set Rotation(vec3: Vec3) {
    this.rotation = vec3;
  }

  public get WorldMatrix(): Mat4 {
    const matrix = mat4.identity();
    mat4.scale(matrix, this.scale, matrix);
    mat4.rotateX(matrix, this.rotation[0], matrix);
    mat4.rotateY(matrix, this.rotation[1], matrix);
    mat4.rotateZ(matrix, this.rotation[2], matrix);
    mat4.translate(matrix, this.position, matrix);
    return matrix;
  }
}