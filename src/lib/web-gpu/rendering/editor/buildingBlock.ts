import { vec2, vec3, type Vec2, type Vec3 } from "wgpu-matrix";
import Entity from "../../entity";
import SimpleVertex from "../simpleVertex";
import type Renderable from "../../interfaces/renderable";
import VertexArray from "../vertexArray";
import type { MeshDelegate } from "../../interfaces/delegate";
import Vertex from "../vertex";
import Mesh from "../mesh";
import { calculateNormal } from "../../math/normal";
import { calculateUV } from "../../math/uv";
import earcut from "earcut";
import { propertiesData } from "../../../../store/propertiesStore";

export default class BuildingBlock extends Entity implements Renderable {
  private readonly device: GPUDevice;

  private positions: SimpleVertex[] = [];
  private actualPositions: SimpleVertex[] = this.positions;
  private meshCallback: MeshDelegate = null!;

  private ySize: number = 255;

  vertexBuffer!: GPUBuffer;

  constructor(device: GPUDevice) {
    super();

    this.device = device;
    propertiesData.subscribe((value) => {
      this.ySize = value.modelProperties[0].ySize;
      this.generateMesh();
    });

    this.recreateBuffer();
  }

  public addPosition(pos: Vec3): void {
    this.positions.push(new SimpleVertex(pos, [1.0, 1.0, 1.0]));
    const target = this.positions[0];
    target.color = [1, 0, 0];
    this.actualPositions = [...this.positions, target];
    this.recreateBuffer();
    this.generateMesh();
  }

  public addPositions(pos: Vec3[]): void {
    for(let i = 0; i < pos.length; i++) {
      this.positions.push(new SimpleVertex(pos[i], [1.0, 1.0, 1.0]));
    }
    const target = this.positions[0];
    target.color = [1,0,0];
    this.actualPositions = [...this.positions, target];
    this.recreateBuffer();
    this.generateMesh();
  }

  public removePosition(pos: Vec3): void {

  }

  public generateMesh() {
    const points = this.actualPositions.flatMap(vertex => {
      return [
        vertex.position[0],
        vertex.position[2]
      ]
    });

    const triangles = earcut(points);

    const vertices: Vertex[] = [];
    const topVertices: Vertex[] = [];
    const bottomVertices: Vertex[] = [];

    for (let i = 0; i < triangles.length; i++) {
      const idx = triangles[i];
      const originalPosition = this.actualPositions[idx];

      topVertices.push(
        new Vertex(
          [originalPosition.position[0], originalPosition.position[1] - this.ySize, originalPosition.position[2]],
          [1, 1, 1],
          [0, -1, 0],
          calculateUV(originalPosition.position)
        )
      );
    }

    for (let i = 0; i < triangles.length; i++) {
      const idx = triangles[i];
      const originalPosition = this.actualPositions[idx];

      bottomVertices.push(
        new Vertex(
          [originalPosition.position[0], originalPosition.position[1], originalPosition.position[2]],
          [1, 1, 1],
          [0, -1, 0],
          calculateUV(originalPosition.position)
        )
      );
    }

    vertices.push(...topVertices);
    vertices.push(...bottomVertices);

    for (let i = 0; i < topVertices.length; i++) {
      const nextIndex = (i + 1) % topVertices.length;

      // Top vertices
      const v0 = topVertices[i];
      const v1 = topVertices[nextIndex];

      // Corresponding bottom vertices
      const v2 = bottomVertices[i];
      const v3 = bottomVertices[nextIndex];

      // First triangle (v0, v2, v1)
      vertices.push(
        new Vertex(v0.position, [1, 1, 1], [0, 0, -1], calculateUV(v0.position)),
        new Vertex(v2.position, [1, 1, 1], [0, 0, -1], calculateUV(v2.position)),
        new Vertex(v1.position, [1, 1, 1], [0, 0, -1], calculateUV(v1.position))
      );

      // Second triangle (v1, v2, v3)
      vertices.push(
        new Vertex(v1.position, [1, 1, 1], [0, 0, -1], calculateUV(v1.position)),
        new Vertex(v2.position, [1, 1, 1], [0, 0, -1], calculateUV(v2.position)),
        new Vertex(v3.position, [1, 1, 1], [0, 0, -1], calculateUV(v3.position))
      );
    }

    const mesh = new Mesh();
    mesh.vertices = new VertexArray(vertices);
    mesh.indices = new Int32Array(0);

    if (this.meshCallback != null) {
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