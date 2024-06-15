import type Camera from "../web-gpu/camera";
import type Mouse from "../web-gpu/mouse";

function panCamera3D(event: MouseEvent, canvas: HTMLCanvasElement, camera: Camera, mouse: Mouse) {
  const rect = canvas.getBoundingClientRect();
  const mX = event.clientX - rect.left;
  const mY = event.clientY - rect.top;

  if (mouse.FirstMouse) {
    mouse.LastX = mX;
    mouse.LastY = mY;
    mouse.FirstMouse = false;
  }

  let xOffset = mX - mouse.LastX;
  let yOffset = mY - mouse.LastY;
  mouse.LastX = mX;
  mouse.LastY = mY;

  const sensitivity = 0.1;
  xOffset *= sensitivity;
  yOffset *= sensitivity;

  camera.Yaw -= xOffset;
  camera.Pitch += yOffset;
}

function panCameraTopDown(event: MouseEvent, canvas: HTMLCanvasElement, camera: Camera, mouse: Mouse) {
  const rect = canvas.getBoundingClientRect();
  const mX = event.clientX - rect.left;
  const mY = event.clientY - rect.top;

  if (mouse.FirstMouse) {
    mouse.LastX = mX;
    mouse.LastY = mY;
    mouse.FirstMouse = false;
  }

  let deltaX = mX - mouse.LastX;
  let deltaY = mY - mouse.LastY;
  mouse.LastX = mX;
  mouse.LastY = mY;

  const sensitivity = 0.01;
  deltaX *= sensitivity;
  deltaY *= sensitivity;

  camera.Position[0] -= deltaX;
  camera.Position[2] += deltaY;
}

export { panCamera3D, panCameraTopDown }