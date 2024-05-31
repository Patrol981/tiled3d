import type { Vec3 } from "wgpu-matrix";
import Entity from "../../entity";
import SimpleVertex from "../simpleVertex";

export default class BuildingBlock extends Entity {
  private readonly device: GPUDevice;

  private positions: SimpleVertex[] = [];

  vertexBuffer!: GPUBuffer;

  constructor(device: GPUDevice) {
    super();

    this.device = device;

    this.recreateBuffer();
  }

  public addPosition(pos: Vec3): void {
    this.positions.push(new SimpleVertex(pos, [1.0, 1.0, 1.0]));
    this.recreateBuffer();
  }

  public addPositions(pos: Vec3[]): void {
    for(let i = 0; i < pos.length; i++) {
      this.positions.push(new SimpleVertex(pos[i], [1.0, 1.0, 1.0]));
    }
    this.recreateBuffer();
  }

  public removePosition(pos: Vec3): void {

  }

  public createMesh() {

  }

  public getData(): Float32Array {
    if (this.positions.length < 1) return new Float32Array(0);
    const elementSize = 6;
    const floatData = new Float32Array(elementSize * this.positions.length);
    this.positions.forEach((vertex, index) => {
      const dataArray = vertex.toFloat32Array();
      floatData.set(dataArray, index * elementSize);
    });
    return floatData;
  }

  private recreateBuffer() {
    this.vertexBuffer?.destroy();
    const data = this.getData();
    this.vertexBuffer = this.device.createBuffer({
      label: "block vertex buffer",
      size: data.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true
    });
    new Float32Array(this.vertexBuffer.getMappedRange()).set(data);
    this.vertexBuffer.unmap();
  }

  public get verticesLength(): number {
    return this.positions.length;
  }
}