import { getHeight, getWidth } from "../utils/window";
import Camera from "./camera";
import type { FrameInfo } from "./frameInfo";
import type { Delegate } from "./interfaces/delegate";
import type Box from "./rendering/box";
import type Quad from "./rendering/quad";
import Renderer3D from "./systems/render3D/renderer3D";
import Renderer from "./systems/renderer";

export default class Engine {

  private device!: GPUDevice;
  private adapter!: GPUAdapter;

  private canvas: HTMLCanvasElement;
  private rightTopCanvas: HTMLCanvasElement;
  private rightBottomCanvas: HTMLCanvasElement;

  private renderer!: Renderer;
  private editorRenderer!: Renderer;
  private tileRenderer!: Renderer;

  // delegates
  private onRender!: Delegate;
  private onUpdate!: Delegate;
  private onStart!: Delegate;

  // systems
  private renderer3D!: Renderer3D;

  // enitities
  // private quads: Quad[] = [];
  private entities: Box[] = [];

  constructor(
    canvas: HTMLCanvasElement,
    rightTopCanvas: HTMLCanvasElement,
    rightBottomCanvas: HTMLCanvasElement
  ) {
    this.canvas = canvas;
    this.rightTopCanvas = rightTopCanvas;
    this.rightBottomCanvas = rightBottomCanvas;
  }

  public async init(): Promise<void> {
    if (!navigator.gpu) {
      throw new Error("WebGPU not supported on this browser.");
    }

    const adapter = await navigator.gpu.requestAdapter();
    if(adapter) {
      this.adapter = adapter;
    } else {
      throw new Error("No appropriate GPUAdapter found.");
    }

    const device = await this.adapter.requestDevice();
    if(device) {
      this.device = device;
    } else {
      throw new Error("Could not obtain device.");
    }

    this.renderer = new Renderer(this.device, this.canvas);
    await this.renderer.init(this.canvas);

    this.editorRenderer = new Renderer(this.device,  this.rightTopCanvas);
    await this.editorRenderer.init(this.rightTopCanvas);
    this.editorRenderer.setClearValue({ r: 0.5, g: 0.3, b: 0.3, a: 1.0 });

    this.tileRenderer = new Renderer(this.device, this.rightBottomCanvas);
    await this.tileRenderer.init(this.rightBottomCanvas);
    this.tileRenderer.setClearValue({ r: 0.1, g: 0.5, b: 0.3, a: 1.0 });
  }

  public async run(): Promise<void> {
    this.setupSystems();

    const camera = new Camera(this.canvas);
    camera.Position[0] = 0;
    camera.Position[1] = 0;
    camera.Position[2] = -5;

    const frameInfo: FrameInfo = {
      camera: camera,
      commandBuffer: this.renderer.CommandBuffer
    }

    const render = () => {
      const width = getWidth(document, "main-cnv");
      const height = getHeight(document, "main-cnv");

      const aspect = this.canvas.width / this.canvas.height;
      if(aspect != camera.Aspect) {
        camera.getProjectionMatrix(aspect);
      }

      this.canvas.width = width;
      this.canvas.height = height;

      this.renderer.beginRenderPass();

      this.renderer3D.render(this.entities, frameInfo);

      this.renderer.endRenderPass();
      this.renderer.submitCommandBuffers();

      this.editorRenderer.beginRenderPass();
      this.editorRenderer.endRenderPass();
      this.editorRenderer.submitCommandBuffers();

      this.tileRenderer.beginRenderPass();
      this.tileRenderer.endRenderPass();
      this.tileRenderer.submitCommandBuffers();

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }

  public addEntity(entity: Box) {
    this.entities.push(entity);
  }

  private setupSystems(): void {
    this.renderer3D = new Renderer3D(this.device, this.renderer);
  }

  public get Device(): GPUDevice {
    return this.device;
  }

  public get Renderer(): Renderer {
    return this.renderer;
  }

  // systems
  public get Renderer3D(): Renderer3D {
    return this.renderer3D;
  }

  public set OnStart(callback: Delegate) {
    this.onStart = callback;
  }

  public set OnRender(callback: Delegate) {
    this.onRender = callback;
  }

  public set OnUpdate(callback: Delegate) {
    this.onUpdate = callback;
  }
}