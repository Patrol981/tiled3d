import { vec3, type Vec3 } from "wgpu-matrix";

function calculateNormal(a: Vec3, b: Vec3, c: Vec3): Vec3 {
  const ab = vec3.subtract(vec3.create(), b, a);
  const ac = vec3.subtract(vec3.create(), c, a);
  const normal = vec3.cross(vec3.create(), ab, ac);
  return vec3.normalize(normal, normal);
}

export { calculateNormal };