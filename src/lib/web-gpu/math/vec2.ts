export default class Vec2 {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public static zero(): Vec2 {
    return new Vec2(0,0);
  }

  public static get byteLength(): number {
    return 8;
  }
}