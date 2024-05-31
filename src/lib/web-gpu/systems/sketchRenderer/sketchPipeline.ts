import SimpleVertex from "../../rendering/simpleVertex";
import sketchShader from "../../shaders/sketchShader";

export default class SketchPipeline {
  private readonly device: GPUDevice;

  vertexLayout: GPUVertexBufferLayout
  pipeline: GPURenderPipeline;

  private uniformBuffer: GPUBuffer;
  private uniformBufferSize: number;
  private uniformBindGroup: GPUBindGroup;

  constructor(device: GPUDevice, format: GPUTextureFormat) {
    this.device = device;

    this.vertexLayout = {
      arrayStride: SimpleVertex.byteLength,
      attributes: [
        {
          shaderLocation: 0, // Position
          offset: 0,
          format: 'float32x3'
        },
        {
          shaderLocation: 1, // Color
          offset: 12,
          format: 'float32x3'
        },
      ]
    }

    this.uniformBufferSize = 64 * 3;
    this.uniformBuffer = device.createBuffer({
      size: this.uniformBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    const shader = sketchShader(this.device);
    this.pipeline = this.device.createRenderPipeline({
      label: "Sketch Pipeline",
      layout: "auto",
      vertex: {
        module: shader,
        entryPoint: "vertexMain",
        buffers: [this.vertexLayout]
      },
      fragment: {
        module: shader,
        entryPoint: "fragmentMain",
        targets: [{
          format: format
        }]
      },
      primitive: {
        topology: 'line-strip',
        cullMode: 'back',
      },
      depthStencil: {
        format: 'depth24plus',
        depthWriteEnabled: true,
        depthCompare: 'less',
      },
    });

    this.uniformBindGroup = device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: {
            buffer: this.uniformBuffer
          }
        }
      ]
    });
  }

  public get UniformBuffer(): GPUBuffer {
    return this.uniformBuffer;
  }

  public get UniformBindGroup(): GPUBindGroup {
    return this.uniformBindGroup;
  }
}