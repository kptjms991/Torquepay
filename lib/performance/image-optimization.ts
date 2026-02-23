export function getOptimizedImageUrl(url: string, width: number, height: number): string {
  // For production, integrate with image CDN like Cloudinary or Vercel Image Optimization
  const params = new URLSearchParams({
    w: width.toString(),
    h: height.toString(),
    q: "75",
  })
  return `${url}?${params}`
}

export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}
