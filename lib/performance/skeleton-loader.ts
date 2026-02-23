export function createSkeletonArray(length: number) {
  return Array.from({ length }, (_, i) => ({ id: i }))
}
