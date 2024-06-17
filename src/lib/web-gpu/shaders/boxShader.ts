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
        @location(3) fragPos: vec3f
      };

      @vertex
      fn vertexMain(input: VertexInput) -> VertexOutput {
        var output: VertexOutput;

        let modelView = uniforms.viewMatrix * uniforms.modelMatrix * vec4f(input.position, 1.0);
        output.Position = uniforms.projectionMatrix * modelView;
        output.color = input.color;
        output.normal = input.normal;
        output.uv = input.uv;
        output.fragPos = output.Position.xyz;

        return output;
      }

      struct FragmentInput {
        @location(0) color : vec3f,
        @location(1) normal : vec3f,
        @location(2) uv : vec2f,
        @location(3) fragPos: vec3f
      };

      @fragment
      fn fragmentMain(input: FragmentInput) -> @location(0) vec4f {
        let lightDirection = normalize(vec3(0.0, -5.0, 0.0) - input.fragPos);
        let lightIntensity = max(dot(normalize(input.normal), lightDirection), 0.0);
        let lightColor = vec3f(1.0, 1.0, 1.0);

        let ambientStr: f32 = 0.1;
        let ambient: vec3f = ambientStr * lightColor;

        let norm = normalize(input.normal);
        let diff: f32 = max(dot(norm, lightDirection), 0.0);
        let diffuse: vec3f = diff * lightColor;

        let result = (ambient + diffuse) * input.color;

        return vec4f(result, 1.0);
      }
    `
  });
}