export default class Vec3 {
  public x: number;
  public y: number;
  public z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  public static zero(): Vec3 {
    return new Vec3(0, 0, 0);
  }

  public static get byteLength(): number {
    return 12;
  }
}