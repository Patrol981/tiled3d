export default function boxShader(devcie: GPUDevice): GPUShaderModule {
  return devcie.createShaderModule({
    label: "Box shader",
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
        @location(2) normal : vec3f,
        @location(3) uv : vec2f,
      };

      struct VertexOutput {
        @builtin(position) Position : vec4f,
        @location(0) color : vec3f,
        @location(1) normal : vec3f,
        @location(2) uv : vec2f,
      };

      @vertex
      fn vertexMain(input: VertexInput) -> VertexOutput {
        var output: VertexOutput;

        let modelView = uniforms.viewMatrix * uniforms.modelMatrix * vec4f(input.position, 1.0);
        output.Position = uniforms.projectionMatrix * modelView;
        output.color = input.color;
        output.normal = input.normal;
        output.uv = input.uv;

        return output;
      }

      struct FragmentInput {
        @location(0) color : vec3f,
        @location(1) normal : vec3f,
        @location(2) uv : vec2f,
      };

      @fragment
      fn fragmentMain(input: FragmentInput) -> @location(0) vec4f {
        let lightDirection = normalize(vec3(0.0, -1.0, 0.0));
        let lightIntensity = max(dot(normalize(input.normal), lightDirection), 0.0);
        let result = lightIntensity * input.color;
        return vec4f(result, 1.0);
      }
    `
  });
}