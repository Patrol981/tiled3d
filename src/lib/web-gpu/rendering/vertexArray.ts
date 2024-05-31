import Vertex from "./vertex";

export default class VertexArray extends Float32Array {
  private dataBytesLength: number;
  private vertices: Vertex[];

  constructor(vertices: Vertex[]) {
    const elementSize = 11;
    const totalLength = vertices.length * elementSize;

    const concatenatedArray = new Float32Array(totalLength);

    vertices.forEach((vertex, index) => {
      const floatArray = vertex.toFloat32Array();
      concatenatedArray.set(floatArray, index * elementSize);
    });

    super(concatenatedArray);

    this.dataBytesLength = concatenatedArray.byteLength;
    this.vertices = vertices;
  }

  public get byteLength(): number {
    return this.dataBytesLength;
  }

  public get verticesLength(): number {
    return this.vertices.length;
  }

  public get Vertices(): Vertex[] {
    return this.vertices;
  }

  public static get empty() {
    return new VertexArray([]);
  }
}