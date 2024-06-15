import type Mesh from "../rendering/mesh";

interface Delegate {
  (task: void): void
}

type MouseEventDelegate = (event: MouseEvent) => void;
type KeyEventDelegate = (event: KeyboardEvent) => void;
type MeshDelegate = (mesh: Mesh) => void;

export type { Delegate, MouseEventDelegate, KeyEventDelegate, MeshDelegate };