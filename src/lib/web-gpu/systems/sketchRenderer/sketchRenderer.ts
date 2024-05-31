import type { FrameInfo } from "../../frameInfo";
import type BuildingBlock from "../../rendering/editor/buildingBlock";
import type Renderer from "../renderer";
import SketchPipeline from "./sketchPipeline";
import SketchUniform from "./sketchUniform";

export default class SketchRenderer {
  private readonly device: GPUDevice;
  private readonly renderer: Renderer;

  pipeline: SketchPipeline;

  constructor(device: GPUDevice, renderer: Renderer) {
    this.device = device;
    this.renderer = renderer;

    this.pipeline = new SketchPipeline(this.device, this.renderer.CanvasFormat);
  }

  public render(entities: BuildingBlock[], frameInfo: FrameInfo): void {
    frameInfo.camera.Position[0] += 0.01;
    if(frameInfo.camera.Position[0] > 2) {
      frameInfo.camera.Position[0] = 0;
    }

    for(let i = 0; i < entities.length; i++) {
      const modelMatrix = entities[i].WorldMatrix as Float32Array;
      const viewMatrix = frameInfo.camera.getViewMatrix() as Float32Array;
      const projectionMatrix = frameInfo.camera.ProjectionMatrix as Float32Array;

      const uniform = new SketchUniform();
      uniform.ViewMatrix = viewMatrix;
      uniform.ProjectionMatrix = projectionMatrix;
      uniform.ModelMatrix = modelMatrix;

      const sendBuffer = uniform.getData();
      this.device.queue.writeBuffer(this.pipeline.UniformBuffer, 0, sendBuffer);

      this.renderer.RenderPass.setPipeline(this.pipeline.pipeline);
      this.renderer.RenderPass.setBindGroup(0, this.pipeline.UniformBindGroup);

      this.renderer.RenderPass.setVertexBuffer(0, entities[i].vertexBuffer);
      this.renderer.RenderPass.draw(entities[i].verticesLength);
    }
  }
}