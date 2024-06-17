import type Vertex from "./vertex";
import VertexArray from "./vertexArray";

export default class Mesh {
  public vertices: VertexArray = VertexArray.empty;
  public indices: Int32Array = new Int32Array(0);
}