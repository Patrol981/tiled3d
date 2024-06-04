function bytesToMB(bytes: number): number {
  const MB = 1024 * 1024; // 1 MB = 1024 * 1024 bytes
  return Math.round(bytes / MB);
}

export { bytesToMB };