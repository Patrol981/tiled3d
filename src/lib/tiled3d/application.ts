import Camera from "../web-gpu/camera";
import Engine from "../web-gpu/engine";
import { createMouseHold } from "../web-gpu/input";
import type { MouseEventDelegate } from "../web-gpu/interfaces/delegate";
import type Universe from "../web-gpu/interfaces/universe";
import { mouseToWorld3D } from "../web-gpu/math/ray";
import Mouse from "../web-gpu/mouse";
import Box from "../web-gpu/rendering/box";
import BuildingBlock from "../web-gpu/rendering/editor/buildingBlock";
import Renderer3D from "../web-gpu/systems/render3D/renderer3D";
import Renderer from "../web-gpu/systems/renderer";
import SketchRenderer from "../web-gpu/systems/sketchRenderer/sketchRenderer";
import { handleRightClick } from "./mouseUtils";

export default class Application {
  private engine: Engine;
  private universes: Universe[] = [];

  private viewCanvas: HTMLCanvasElement;
  private sketchCanvas: HTMLCanvasElement;
  private tileCanvas: HTMLCanvasElement;

  constructor(
    viewCanvas: HTMLCanvasElement,
    sketchCanvas: HTMLCanvasElement,
    tileCanvas: HTMLCanvasElement
  ) {
    this.viewCanvas = viewCanvas;
    this.sketchCanvas = sketchCanvas;
    this.tileCanvas = tileCanvas;

    this.engine = new Engine();
  }

  public async run(): Promise<void> {
    await this.engine.init();

    await this.createUniverses();

    await this.engine.run(this.universes);
  }

  private onLoad(): void {

  }

  private onUpdate(): void {

  }

  private async createUniverses(): Promise<void> {
    const box = new Box(this.engine.Device);
    const block = new BuildingBlock(this.engine.Device);
    block.addPosition([0, 0, 0]);
    block.addPosition([1, 0, 0]);
    block.addPosition([1, 0, 1]);
    block.addPosition([0, 0, 1]);

    const viewUniverse: Universe = {
      label: "View Universe",
      device: this.engine.Device,
      camera: new Camera(this.viewCanvas),
      renderer: new Renderer(this.engine.Device, this.viewCanvas),
      system: undefined,
      canvas: this.viewCanvas,
      init: this.setupViewUniverse,
      entities: [box]
    }
    this.universes.push(viewUniverse);

    const sketchUniverse: Universe = {
      label: "Sketch Universe",
      device: this.engine.Device,
      camera: new Camera(this.sketchCanvas),
      renderer: new Renderer(this.engine.Device, this.sketchCanvas),
      system: undefined,
      canvas: this.sketchCanvas,
      init: this.setupSketchUniverse,
      entities: [block]
    }
    this.universes.push(sketchUniverse);

    const tileUniverse: Universe = {
      label: "Tile Universe",
      device: this.engine.Device,
      camera: new Camera(this.tileCanvas),
      renderer: new Renderer(this.engine.Device, this.tileCanvas),
      system: undefined,
      canvas: this.tileCanvas,
      init: this.setupTileUniverse,
      entities: []
    }
    this.universes.push(tileUniverse);
  }

  private async setupSketchUniverse(sketchUniverse: Universe): Promise<void> {
    console.info("[APPLICATION] Initializing Sketch Universe...");

    await sketchUniverse.renderer.init(sketchUniverse.canvas);
    sketchUniverse.system = new SketchRenderer(sketchUniverse.device, sketchUniverse.renderer);
    sketchUniverse.renderer.setClearValue({ r: 0.5, g: 0.3, b: 0.3, a: 1.0 });

    sketchUniverse.camera.Position[0] = 0;
    sketchUniverse.camera.Position[1] = -5;
    sketchUniverse.camera.Position[2] = 0;
    sketchUniverse.camera.Pitch = 90;
    sketchUniverse.camera.Yaw = 90;

    sketchUniverse.canvas.addEventListener('contextmenu', (event) => {
      const rect = sketchUniverse.canvas.getBoundingClientRect();
      const mX = event.clientX - rect.left;
      const mY = event.clientY - rect.top;

      const result = mouseToWorld3D(event, sketchUniverse.canvas, sketchUniverse.camera);

      const target = <BuildingBlock>sketchUniverse.entities[0];
      target.addPosition(result.point);
    });
  }

  private async setupViewUniverse(viewUniverse: Universe): Promise<void> {
    console.info("[APPLICATION] Initializing View Universe...");

    await viewUniverse.renderer.init(viewUniverse.canvas);
    viewUniverse.system = new Renderer3D(viewUniverse.device, viewUniverse.renderer);

    viewUniverse.camera.Position[0] = 0;
    viewUniverse.camera.Position[1] = -5;
    viewUniverse.camera.Position[2] = 0;
    viewUniverse.camera.Pitch = 90;
    viewUniverse.camera.Yaw = 90;

    const mouse = new Mouse();
    const viewRightClick: MouseEventDelegate = (event: MouseEvent) => {
      handleRightClick(event, viewUniverse.canvas, viewUniverse.camera, mouse);
    }

    const hold = createMouseHold(viewUniverse.canvas, viewRightClick);
    hold();
  }

  private async setupTileUniverse(tileUniverse: Universe): Promise<void> {
    console.info("[APPLICATION] Initializing Tile Universe...");

    await tileUniverse.renderer.init(tileUniverse.canvas);
    tileUniverse.renderer.setClearValue({ r: 0.1, g: 0.5, b: 0.3, a: 1.0 });
  }
}