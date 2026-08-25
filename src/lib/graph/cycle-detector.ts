export function hasCycle(path: string[], maxDepth: number = 4): boolean {
  if (path.length > maxDepth) return true;
  const uniqueNodes = new Set(path);
  return uniqueNodes.size !== path.length;
}
