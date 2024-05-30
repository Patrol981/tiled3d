import { mat4 } from "wgpu-matrix";
import type { FrameInfo } from "../../frameInfo";
import type Box from "../../rendering/box";
import type Quad from "../../rendering/quad";
import type Renderer from "../renderer";
import Pipeline3D from "./pipeline3D";
import Renderer3DUniform from "./renderer3DUniform";

export default class Renderer3D {
  private readonly device: GPUDevice;
  private readonly renderer: Renderer;

  pipeline: Pipeline3D;

  constructor(device: GPUDevice, renderer: Renderer) {
    this.device = device;
    this.renderer = renderer;

    this.pipeline = new Pipeline3D(this.device, this.renderer.CanvasFormat);
  }

  public render(entities: Box[], frameInfo: FrameInfo): void {
    for (let i = 0; i < entities.length; i++) {
      entities[i].Rotation[1] += 0.01;
      entities[i].Rotation[2] += 0.01;

      if (entities[i].Rotation[1] > 6) entities[i].Rotation[1] = 0;
      if (entities[i].Rotation[2] > 6) entities[i].Rotation[2] = 0;

      const modelMatrix = entities[i].WorldMatrix as Float32Array;
      const viewMatrix = frameInfo.camera.getViewMatrix() as Float32Array;
      const projectionMatrix = frameInfo.camera.ProjectionMatrix as Float32Array;

      const uniform = new Renderer3DUniform();
      uniform.ViewMatrix = viewMatrix;
      uniform.ProjectionMatrix = projectionMatrix;
      uniform.ModelMatrix = modelMatrix;

      const sendBuffer = uniform.getData();
      this.device.queue.writeBuffer(this.pipeline.UniformBuffer, 0, sendBuffer)

      this.renderer.RenderPass.setPipeline(this.pipeline.pipeline);
      this.renderer.RenderPass.setBindGroup(0, this.pipeline.UniformBindGroup);

      if(entities[i].mesh.indices.length > 0) {
        this.renderer.RenderPass.setVertexBuffer(0, entities[i].vertexBuffer);
        this.renderer.RenderPass.setIndexBuffer(entities[i].indexBuffer, 'uint32');

        this.renderer.RenderPass.drawIndexed(entities[i].mesh.indices.length);
      } else {
        this.renderer.RenderPass.setVertexBuffer(0, entities[i].vertexBuffer);
        this.renderer.RenderPass.draw(entities[i].mesh.vertices.verticesLength);
      }

    }
  }
}