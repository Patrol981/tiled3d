import { type Vec3, vec3, vec2 } from "wgpu-matrix";
import Mesh from "./mesh";
import Vertex from "./vertex";
import VertexArray from "./vertexArray";
import Entity from "../entity";
import type Renderable from "../interfaces/renderable";

export default class Box extends Entity implements Renderable {
  private readonly device: GPUDevice;

  mesh: Mesh;
  vertexBuffer!: GPUBuffer;
  indexBuffer!: GPUBuffer;

  constructor(device: GPUDevice) {
    super();

    this.device = device;

    this.mesh = this.createMesh(0.5);

    this.vertexBuffer = this.device.createBuffer({
      label: "box vertex buffer",
      size: this.mesh.vertices.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true
    });
    new Float32Array(this.vertexBuffer.getMappedRange()).set(this.mesh.vertices);
    this.vertexBuffer.unmap();

    this.indexBuffer = this.device.createBuffer({
      label: "box index buffer",
      size: this.mesh.indices.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true
    });
    new Int32Array(this.indexBuffer.getMappedRange()).set(this.mesh.indices);
    this.indexBuffer.unmap();
  }

  private createMesh(scale: number): Mesh {
    const normals = this.createNormals();
    const indices = this.createIndices();

    const vertices: Vertex[] = [];
    const color: Vec3 = [1.0, 1.0, 1.0];
    const black: Vec3 = [0.0, 0.0, 0.0];

    vertices.push(new Vertex([-scale, -scale, -scale], color, normals[0], vec2.zero()));
    vertices.push(new Vertex([scale, -scale, -scale], color, normals[1], vec2.zero()));
    vertices.push(new Vertex([scale, scale, -scale], color, normals[2], vec2.zero()));
    vertices.push(new Vertex([-scale, scale, -scale], color, normals[3], vec2.zero()));
    vertices.push(new Vertex([-scale, -scale, scale], color, normals[4], vec2.zero()));
    vertices.push(new Vertex([scale, -scale, scale], color, normals[5], vec2.zero()));
    vertices.push(new Vertex([scale, scale, scale], color, normals[6], vec2.zero()));
    vertices.push(new Vertex([-scale, scale, scale], color, normals[7], vec2.zero()));

    const mesh: Mesh = {
      vertices: new VertexArray(vertices),
      indices: new Int32Array(indices)
      // indices: new Int32Array()
    };
    return mesh;
  }

  private createNormals(): Vec3[] {
    const normals: Vec3[] = [];

    normals.push([-1, -1, -1]);
    normals.push([1, -1, -1]);
    normals.push([1, 1, -1]);
    normals.push([-1, 1, -1]);

    normals.push([-1, -1, 1]);
    normals.push([1, -1, 1]);
    normals.push([1, 1, 1]);
    normals.push([-1, 1, 1]);

    return normals;
  }

  private createIndices(): number[] {
    const indices: number[] = [];

    // front face
    indices.push(0, 3, 2, 2, 1, 0);

    // back face
    indices.push(4, 5, 6, 6, 7, 4);

    // left face
    indices.push(0, 4, 7, 7, 3, 0);

    // right face
    indices.push(1, 2, 6, 6, 5, 1);

    // top face
    indices.push(3, 7, 6, 6, 2, 3);

    // bottom face
    indices.push(0, 1, 5, 5, 4, 0);

    return indices;
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