export default class Vec4 {
  public x: number;
  public y: number;
  public z: number;
  public w: number;

  constructor(x: number, y: number, z: number, w: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  public static zero(): Vec4 {
    return new Vec4(0, 0, 0, 0);
  }

  public static get byteLength(): number {
    return 16;
  }
}