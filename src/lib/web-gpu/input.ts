import type { MouseKey } from "./enums/mouseKey";
import type { Delegate, MouseEventDelegate } from "./interfaces/delegate";

function createMouseHold(canvas: HTMLCanvasElement, callback: MouseEventDelegate, mouseKey: MouseKey) {
  const onHoldObject = () => {
    let isOn: boolean = false;

    canvas.addEventListener('mousedown', (event) => {
      if(event.button != mouseKey) return;
      isOn = true;
    });

    canvas.addEventListener('mouseup', () => {
      isOn = false;
    });

    canvas.addEventListener('mousemove', (event) => {
      if(isOn) {
        callback(event);
      }
    });
  }

  return onHoldObject;
}

export { createMouseHold };