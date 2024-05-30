import Engine from "./engine";
import Box from "./rendering/box";
import Quad from "./rendering/quad";

export default class Application {
  private engine: Engine;

  constructor(
    canvas: HTMLCanvasElement,
    rightTopCanvas: HTMLCanvasElement,
    rightBottomCanvas: HTMLCanvasElement
  ) {
    this.engine = new Engine(canvas, rightTopCanvas, rightBottomCanvas);
  }

  public async run(): Promise<void> {
    await this.engine.init();

    const box = new Box(this.engine.Device);

    this.engine.addEntity(box);

    await this.engine.run();
  }
}