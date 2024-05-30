import Vertex from "../../rendering/vertex";
import boxShader from "../../shaders/boxShader";
import quadShader from "../../shaders/quadShader";

export default class Pipeline3D {
  private readonly device: GPUDevice;

  vertexLayout: GPUVertexBufferLayout
  pipeline: GPURenderPipeline;
  pipelineLayout: GPUPipelineLayout;

  private uniformBuffer: GPUBuffer;
  private uniformBufferSize: number;
  private uniformBindGroup: GPUBindGroup;

  constructor(device: GPUDevice, format: GPUTextureFormat) {
    this.device = device;

    this.vertexLayout = {
      arrayStride: Vertex.byteLength,
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
        {
          shaderLocation: 2, // Normal
          offset: 24,
          format: 'float32x3'
        },
        {
          shaderLocation: 3, // UV
          offset: 36,
          format: 'float32x2'
        }
      ],
    }

    this.uniformBufferSize = 64 * 3;
    this.uniformBuffer = device.createBuffer({
      size: this.uniformBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    const bindGroupLayout = device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: {}
        }
      ]
    })
    this.pipelineLayout = device.createPipelineLayout({
      bindGroupLayouts: [bindGroupLayout]
    })

    const shader = boxShader(this.device);
    this.pipeline = this.device.createRenderPipeline({
      label: "3D Pipeline",
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
        topology: 'triangle-list',
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