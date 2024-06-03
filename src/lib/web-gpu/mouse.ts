export default class Mouse {
  private lastX: number;
  private lastY: number;
  private firstMouse: boolean;

  constructor() {
    this.lastX = 0;
    this.lastY = 0;

    this.firstMouse = true;
  }

  public get LastX(): number {
    return this.lastX;
  }

  public get LastY(): number {
    return this.lastY;
  }

  public get FirstMouse(): boolean {
    return this.firstMouse;
  }

  public set LastX(value: number) {
    this.lastX = value;
  }

  public set LastY(value: number) {
    this.lastY = value;
  }

  public set FirstMouse(value: boolean) {
    this.firstMouse = value;
  }
}