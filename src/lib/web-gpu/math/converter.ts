function degToRad(deg: number): number {
  const rad = Math.PI / 180 * deg;
  return rad;
}

function radToDeg(rad: number) {
  const deg = 180 / Math.PI * rad;
  return deg;
}

export { radToDeg, degToRad }