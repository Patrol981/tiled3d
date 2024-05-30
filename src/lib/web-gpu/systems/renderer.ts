export default class Renderer {
  private readonly device: GPUDevice;
  private readonly canvas: HTMLCanvasElement;

  private commandBuffer!: GPUCommandBuffer;
  private encoder!: GPUCommandEncoder;
  private renderPass!: GPURenderPassEncoder;
  private context!: GPUCanvasContext;
  private format!: GPUTextureFormat;

  private depthTexture!: GPUTexture;
  private renderPassDescriptor!: GPURenderPassDescriptor;

  private clearColor: GPUColor = { r: 0.2, g: 0.3, b: 0.3, a: 1.0 };

  constructor(device: GPUDevice, canvas: HTMLCanvasElement) {
    this.device = device;
    this.canvas = canvas;
  }

  public async init(canvas: HTMLCanvasElement): Promise<void> {
    const context = canvas.getContext("webgpu");
    if (context) {
      this.context = context;
    } else {
      throw new Error("Could not setup ontext.");
    }

    this.format = navigator.gpu.getPreferredCanvasFormat();
    this.context.configure({
      device: this.device,
      format: this.format
    });
  }

  public beginRenderPass(): void {
    this.depthTexture = this.device.createTexture({
      size: [this.canvas.width, this.canvas.height, 1],
      format: 'depth24plus',
      usage: GPUTextureUsage.RENDER_ATTACHMENT
    });

    this.renderPassDescriptor = {
      colorAttachments: [
        {
          view: this.context.getCurrentTexture().createView(),
          loadOp: "clear",
          storeOp: "store",
          clearValue: this.clearColor
        },
      ],
      depthStencilAttachment: {
        view: this.depthTexture.createView(),
        depthClearValue: 1.0,
        depthStoreOp: 'store',
        depthLoadOp: 'clear'
      },
    }

    this.encoder = this.device.createCommandEncoder();
    this.renderPass = this.encoder.beginRenderPass(this.renderPassDescriptor);
  }

  public endRenderPass(): void {
    this.renderPass.end();
  }

  public submitCommandBuffers(): void {
    this.commandBuffer = this.encoder.finish();
    this.device.queue.submit([this.commandBuffer]);

    // this.context.getCurrentTexture();
  }

  public setClearValue(color: GPUColor) {
    this.clearColor = color;
  }

  public get Context(): GPUCanvasContext {
    return this.context;
  }

  public get CanvasFormat(): GPUTextureFormat {
    return this.format;
  }

  public get RenderPass(): GPURenderPassEncoder {
    return this.renderPass;
  }

  public get CommandBuffer(): GPUCommandBuffer {
    return this.commandBuffer;
  }

  public get RenderPassDescriptor(): GPURenderPassDescriptor {
    return this.renderPassDescriptor;
  }
}