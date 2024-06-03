import type Entity from "../entity";

export default interface Renderable {
  get VertexBuffer(): GPUBuffer;
  get IndexBuffer(): GPUBuffer;
  get EntityData(): Entity;
  getIndices(): Int32Array;
  getVertices(): Float32Array;
  verticesLength(): number;
  indicesLength(): number;
}