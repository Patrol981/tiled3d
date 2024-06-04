import { vec3, type Vec2, type Vec3 } from "wgpu-matrix";
import Entity from "../../entity";
import SimpleVertex from "../simpleVertex";
import type Renderable from "../../interfaces/renderable";
import VertexArray from "../vertexArray";
import type { MeshDelegate } from "../../interfaces/delegate";
import Vertex from "../vertex";
import Mesh from "../mesh";

export default class BuildingBlock extends Entity implements Renderable {
  private readonly device: GPUDevice;

  private positions: SimpleVertex[] = [];
  private actualPositions: SimpleVertex[] = this.positions;
  private meshCallback: MeshDelegate = null!;

  vertexBuffer!: GPUBuffer;

  constructor(device: GPUDevice) {
    super();

    this.device = device;

    this.recreateBuffer();
  }

  public addPosition(pos: Vec3): void {
    this.positions.push(new SimpleVertex(pos, [1.0, 1.0, 1.0]));
    this.actualPositions = [...this.positions, this.positions[0]];
    this.recreateBuffer();
    this.generateMesh();
  }

  public addPositions(pos: Vec3[]): void {
    for(let i = 0; i < pos.length; i++) {
      this.positions.push(new SimpleVertex(pos[i], [1.0, 1.0, 1.0]));
    }
    this.actualPositions = [...this.positions, this.positions[0]];
    this.recreateBuffer();
    this.generateMesh();
  }

  public removePosition(pos: Vec3): void {

  }

  public generateMesh() {
    const vertices: Vertex[] = this.actualPositions.map(simpleVertex => {
      const position = simpleVertex.position;
      const color = simpleVertex.color;
      const normal: Vec3 = [0,-1,0];
      const uv: Vec2 = [0,0];
      return new Vertex(position, color, normal, uv);
    });

    const mesh = new Mesh();
    mesh.vertices = new VertexArray(vertices);
    mesh.indices = new Int32Array(0);

    if(this.meshCallback != null) {
      this.meshCallback(mesh);
    }
  }

  public setupMeshCallcack(meshCallback: MeshDelegate): void {
    this.meshCallback = meshCallback;
  }

  public getData(): Float32Array {
    if (this.actualPositions.length < 1) return new Float32Array(0);
    const elementSize = 6;
    const floatData = new Float32Array(elementSize * this.actualPositions.length);
    this.actualPositions.forEach((vertex, index) => {
      const dataArray = vertex.toFloat32Array();
      floatData.set(dataArray, index * elementSize);
    });
    return floatData;
  }

  private recreateBuffer() {
    if (this.vertexBuffer) {
      this.vertexBuffer.destroy();
      this.vertexBuffer = null!;
    }
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

  public verticesLength(): number {
    return this.actualPositions.length;
  }

  public indicesLength(): number {
    return 0;
  }

  public getIndices(): Int32Array {
    return new Int32Array(0);
  }

  public getVertices(): Float32Array {
    return this.getData();
  }

  public get VertexBuffer(): GPUBuffer {
    return this.vertexBuffer;
  }

  public get IndexBuffer(): GPUBuffer {
    return null!;
  }

  public get EntityData(): Entity {
    return this;
  }
}