import { mat4, vec3, vec4, type Mat4, type Vec2, type Vec3, type Vec4 } from "wgpu-matrix";
import type Camera from "../camera";
import { getMat4Data } from "./math";

interface RayResult {
  origin: Vec3;
  direction: Vec3,
}

interface RaycastHitResult {
  present: boolean;
  point: Vec3;
  distance: number;
}

function getRayInfo(camera: Camera, screenSize: Vec2, mousePos: Vec2) {
  const rayStartNdc: Vec4 = [
    (mousePos[0] / screenSize[0] - 0.5) * 2.0,
    (mousePos[1] / screenSize[1] - 0.5) * 2.0,
    -1.0,
    1.0
  ];
  const rayEndNdc: Vec4 = [
    (mousePos[0] / screenSize[0] - 0.5) * 2.0,
    (mousePos[1] / screenSize[1] - 0.5) * 2.0,
    0.0,
    1.0
  ];

  const proj = camera.ProjectionMatrix;
  const view = camera.getViewMatrix();

  const inProj = mat4.invert(proj);
  const inView = mat4.invert(view);

  const rayStartCamera = vec4.transformMat4(rayStartNdc, inProj);
  rayStartCamera[0] /= rayStartCamera[3];
  rayStartCamera[1] /= rayStartCamera[3];
  rayStartCamera[2] /= rayStartCamera[3];

  const rayStartWorld = vec4.transformMat4(rayStartCamera, inView);
  rayStartWorld[0] /= rayStartWorld[3];
  rayStartWorld[1] /= rayStartWorld[3];
  rayStartWorld[2] /= rayStartWorld[3];

  const rayEndCamera = vec4.transformMat4(rayEndNdc, inProj);
  rayEndCamera[0] /= rayEndCamera[3];
  rayEndCamera[1] /= rayEndCamera[3];
  rayEndCamera[2] /= rayEndCamera[3];

  const rayEndWorld = vec4.transformMat4(rayEndNdc, inView);
  rayEndWorld[0] /= rayEndWorld[3];
  rayEndWorld[1] /= rayEndWorld[3];
  rayEndWorld[2] /= rayEndWorld[3];

  const rayDirWorld = vec4.subtract(rayEndWorld, rayStartWorld);
  vec4.normalize(rayDirWorld, rayDirWorld);

  const result: RayResult = {
    origin: [rayStartWorld[0], rayStartWorld[1], rayStartWorld[2]],
    direction: vec3.normalize([rayDirWorld[0], rayDirWorld[1], rayDirWorld[2]])
  };

  return result;
}

function castRayIntersect(
  hitResult: RaycastHitResult,
  modelMatrix: Mat4,
  rayData: RayResult,
  delta: Vec3,
  maxDistance: number
) {
  const tMin = 0.0;
  const tMax = maxDistance;

  // X
  const xAxis: Vec3 = [
    getMat4Data(modelMatrix, 0, 0),
    getMat4Data(modelMatrix, 0, 1),
    getMat4Data(modelMatrix, 0, 2)
  ];

  console.log(rayData.direction);

  hitResult.point = vec3.add(
    rayData.origin,
    [rayData.direction[0] * tMax, rayData.direction[1] * tMax, rayData.direction[2] * tMax]
  );

  hitResult.point = rayData.direction;

  return hitResult;
}

function mouseToWorld3D(mouseEvent: MouseEvent, canvas: HTMLCanvasElement, camera: Camera) {
  const sizeX = canvas.width;
  const sizeY = canvas.height;
  const rect = canvas.getBoundingClientRect();
  const mX = mouseEvent.clientX - rect.left;
  const mY = mouseEvent.clientY - rect.top;
  const rayData = getRayInfo(camera, [sizeX, sizeY], [mX, mY]);

  let result: RaycastHitResult = {
    present: false,
    point: rayData.direction,
    distance: 0
  };

  result = castRayIntersect(result, mat4.identity(), rayData, [1,1,1], camera.Position[1]);

  return result;
}

export { mouseToWorld3D }