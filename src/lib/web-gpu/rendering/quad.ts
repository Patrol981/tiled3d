export default class Quad {
  vertices: Float32Array;
  vertexBuffer: GPUBuffer;

  private readonly device: GPUDevice;

  constructor(device: GPUDevice) {
    this.device = device;

    this.vertices = new Float32Array([
      //   X,    Y,
      -0.8, -0.8, // Triangle 1 (Blue)
      0.8, -0.8,
      0.8, 0.8,

      -0.8, -0.8, // Triangle 2 (Red)
      0.8, 0.8,
      -0.8, 0.8,
    ]);

    this.vertexBuffer = this.device.createBuffer({
      label: "quad vertices",
      size: this.vertices.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    this.device.queue.writeBuffer(this.vertexBuffer, 0, this.vertices);
  }
}