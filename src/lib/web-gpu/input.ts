import type { MouseKey } from "./enums/mouseKey";
import type { Delegate, KeyEventDelegate, MouseEventDelegate } from "./interfaces/delegate";
import type Dictionary from "./interfaces/dictionary";
import type Mouse from "./mouse";

function createMouseHold(
  canvas: HTMLCanvasElement,
  callback: MouseEventDelegate,
  mouseKey: MouseKey,
  mouse: Mouse
) {
  const onHoldObject = () => {
    let isOn: boolean = false;

    canvas.addEventListener('mousedown', (event) => {
      if(event.button != mouseKey) return;
      isOn = true;
    });

    canvas.addEventListener('mouseup', () => {
      isOn = false;
      mouse.FirstMouse = true;
    });

    canvas.addEventListener('mousemove', (event) => {
      if(isOn) {
        callback(event);
      }
    });
  }

  return onHoldObject;
}

function createKeyHold(canvas: HTMLCanvasElement, callback: KeyEventDelegate) {
  const onKeyObject = () => {
    let isOn: boolean = false;

    window.addEventListener('keydown', (event) => {
      isOn = true;
    });

    window.addEventListener('keyup', (event) => {
      isOn = false;
    });

    window.addEventListener('keypress', (event) => {
      if(isOn) {
        callback(event);
      }
    });
  }

  return onKeyObject;
}

export { createMouseHold, createKeyHold };