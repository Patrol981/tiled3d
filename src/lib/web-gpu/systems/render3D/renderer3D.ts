import type { FrameInfo } from "../../frameInfo";
import type Renderer from "../renderer";
import Pipeline3D from "./pipeline3D";
import Renderer3DUniform from "./renderer3DUniform";
import type System from "../../interfaces/system";
import type Renderable from "../../interfaces/renderable";

export default class Renderer3D implements System {
  private readonly device: GPUDevice;
  private readonly renderer: Renderer;

  pipeline: Pipeline3D;

  constructor(device: GPUDevice, renderer: Renderer) {
    this.device = device;
    this.renderer = renderer;

    this.pipeline = new Pipeline3D(this.device, this.renderer.CanvasFormat);
  }

  public render(entities: Renderable[], frameInfo: FrameInfo): void {
    for (let i = 0; i < entities.length; i++) {
      if(entities[i].verticesLength() < 1) continue;

      // entities[i].EntityData.Rotation[1] += 0.01;
      // console.log(entities[i].EntityData.Rotation[1]);
      // if(entities[i].EntityData.Rotation[1] > 6) entities[i].EntityData.Rotation[1] = 0;

      const modelMatrix = entities[i].EntityData.WorldMatrix as Float32Array;
      const viewMatrix = frameInfo.camera.getViewMatrix() as Float32Array;
      const projectionMatrix = frameInfo.camera.ProjectionMatrix as Float32Array;

      const uniform = new Renderer3DUniform();
      uniform.ViewMatrix = viewMatrix;
      uniform.ProjectionMatrix = projectionMatrix;
      uniform.ModelMatrix = modelMatrix;

      const sendBuffer = uniform.getData();
      this.device.queue.writeBuffer(this.pipeline.UniformBuffer, 0, sendBuffer);

      this.renderer.RenderPass.setPipeline(this.pipeline.pipeline);
      this.renderer.RenderPass.setBindGroup(0, this.pipeline.UniformBindGroup);

      if(entities[i].getIndices().length > 0) {
        this.renderer.RenderPass.setVertexBuffer(0, entities[i].VertexBuffer);
        this.renderer.RenderPass.setIndexBuffer(entities[i].IndexBuffer, 'uint32');

        this.renderer.RenderPass.drawIndexed(entities[i].indicesLength());

      } else {
        this.renderer.RenderPass.setVertexBuffer(0, entities[i].VertexBuffer);
        this.renderer.RenderPass.draw(entities[i].verticesLength());
      }

    }
  }
}