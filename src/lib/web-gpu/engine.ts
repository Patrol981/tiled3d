import { getWebGPUMemoryUsage } from "../utils/memory";
import { getHeight, getWidth } from "../utils/window";
import type { FrameInfo } from "./frameInfo";
import type { Delegate } from "./interfaces/delegate";
import type Universe from "./interfaces/universe";
import { perfInfo } from "../../store/engineStore";

export default class Engine {

  private device!: GPUDevice;
  private adapter!: GPUAdapter;

  // delegates
  private onRender!: Delegate;
  private onUpdate!: Delegate;
  private onStart!: Delegate;

  public async init(): Promise<void> {
    console.info("[ENGINE] Initializing...");

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
  }

  public async run(universes: Universe[]): Promise<void> {
    for(let i=0; i<universes.length; i++) {
      await universes[i].init(universes[i]);
      universes[i].canvas.addEventListener('contextloss', this.handleContextLoss, false);
    }

    const frameInfo: FrameInfo = {
      camera: universes[0].camera,
      commandBuffer: universes[0].renderer.CommandBuffer
    }

    let delta = 0.0;

    const render = () => {
      universes.forEach((universe, index) => {
        const aspect = universe.canvas.width / universe.canvas.height;
        if(aspect != universe.camera.Aspect) {
          universe.camera.getProjectionMatrix(aspect);
        }

        const width = getWidth(document, universe.canvas.id);
        const height = getHeight(document, universe.canvas.id);

        universe.canvas.width = width;
        universe.canvas.height = height;

        frameInfo.camera = universe.camera;
        frameInfo.commandBuffer = universe.renderer.CommandBuffer;

        universe.renderer.beginRenderPass();
        universe.system?.render(universe.entities, frameInfo);
        universe.renderer.endRenderPass();
        universe.renderer.submitCommandBuffers();
      });

      const info = getWebGPUMemoryUsage(this.device);
      perfInfo.set(info);

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }

  private handleContextLoss(event: any) {
    console.log("[PANIC] Context Lost!");
  }

  public get Device(): GPUDevice {
    return this.device;
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