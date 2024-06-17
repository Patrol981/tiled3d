import Entity from "../../entity";
import type { MeshDelegate } from "../../interfaces/delegate";
import type Renderable from "../../interfaces/renderable";
import Mesh from "../mesh";

export default class BlockView extends Entity implements Renderable {
  private readonly device: GPUDevice;

  private mesh: Mesh;

  vertexBuffer!: GPUBuffer;
  indexBuffer!: GPUBuffer;

  constructor(device: GPUDevice) {
    super();

    this.device = device;

    this.mesh = new Mesh();
    this.recreateBuffers();
  }

  onMeshCallback(mesh: Mesh): void {
    this.mesh = mesh;
    this.recreateBuffers();
  }

  recreateBuffers(): void {
    if(this.vertexBuffer) {
      this.vertexBuffer.destroy();
      this.vertexBuffer = null!;
    }
    this.vertexBuffer = this.device.createBuffer({
      label: "block view vertex buffer",
      size: this.mesh.vertices.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true
    });
    new Float32Array(this.vertexBuffer.getMappedRange()).set(this.mesh.vertices);
    this.vertexBuffer.unmap();

    if(this.indexBuffer) {
      this.indexBuffer.destroy();
      this.indexBuffer = null!;
    }
    this.indexBuffer = this.device.createBuffer({
      label: "block view index buffer",
      size: this.mesh.vertices.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true
    });
    new Int32Array(this.indexBuffer.getMappedRange()).set(this.mesh.indices);
    this.indexBuffer.unmap();
  }

  public get VertexBuffer(): GPUBuffer {
    return this.vertexBuffer;
  }

  public get IndexBuffer(): GPUBuffer {
    return this.indexBuffer;
  }

  public get EntityData(): Entity {
    return this;
  }

  public getIndices(): Int32Array {
    return this.mesh.indices;
  }

  public getVertices(): Float32Array {
    return this.mesh.vertices;
  }

  public verticesLength(): number {
    return this.mesh.vertices.verticesLength;
  }

  public indicesLength(): number {
    return this.mesh.indices.length;
  }
}