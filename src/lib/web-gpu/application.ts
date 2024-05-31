import Engine from "./engine";
import Box from "./rendering/box";
import BuildingBlock from "./rendering/editor/buildingBlock";
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
    const block = new BuildingBlock(this.engine.Device);
    block.addPosition([0, 0, 0]);
    block.addPosition([.5, -.25, 0]);
    block.addPosition([.75, -.25, 0]);
    block.addPosition([1, -.5, 0]);

    this.engine.addEntity(box);
    this.engine.addBlock(block);

    await this.engine.run();
  }
}