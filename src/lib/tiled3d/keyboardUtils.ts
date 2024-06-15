import type Camera from "../web-gpu/camera";

function keyMovement(event: KeyboardEvent, camera: Camera) {
  // w = 87
  // s = 83
  // a = 65
  // d = 68

  if(event.code == "Space") {
    camera.Position[1] -= 0.1;
  }
  if(event.key == "a") {
    camera.Position[0] += 0.1;
  }
  if(event.key == "x") {
    camera.Position[1] += 0.1;
  }
  if(event.key == "d") {
    camera.Position[0] -= 0.1;
  }
}

export { keyMovement }