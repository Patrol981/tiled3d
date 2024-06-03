interface Delegate {
  (task: void): void
}

type MouseEventDelegate = (event: MouseEvent) => void;

export type { Delegate, MouseEventDelegate };