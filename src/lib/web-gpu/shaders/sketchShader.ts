export default function sketchShader(device: GPUDevice): GPUShaderModule {
  return device.createShaderModule({
    label: "Sketch Shader",
    code: `
      struct Uniforms {
        modelMatrix : mat4x4f,
        projectionMatrix: mat4x4f,
        viewMatrix: mat4x4f
      };
      @binding(0) @group(0) var<uniform> uniforms : Uniforms;


      struct VertexInput {
        @location(0) position : vec3f,
        @location(1) color : vec3f,
      };

      struct VertexOutput {
        @builtin(position) Position : vec4f,
        @location(0) color : vec3f,
      };

      @vertex
      fn vertexMain(input: VertexInput) -> VertexOutput {
        var output: VertexOutput;

        let modelView = uniforms.viewMatrix * uniforms.modelMatrix * vec4f(input.position, 1.0);
        output.Position = uniforms.projectionMatrix * modelView;
        // output.Position = vec4f(input.position, 1.0);
        output.color = input.color;

        return output;
      }

      struct FragmentInput {
        @location(0) color : vec3f,
      };

      @fragment
      fn fragmentMain(input: FragmentInput) -> @location(0) vec4f {
        return vec4f(input.color, 1.0);
      }
    `
  });
}