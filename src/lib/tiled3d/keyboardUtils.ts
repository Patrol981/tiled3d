import type Camera from "../web-gpu/camera";

function keyMovement(event: KeyboardEvent, camera: Camera) {
  // w = 87
  // s = 83
  // a = 65
  // d = 68

  console.log(event.key);
}

export { keyMovement }