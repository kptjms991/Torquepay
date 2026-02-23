import sharp from "sharp"
import fs from "fs"
import path from "path"

const PUBLIC_DIR = path.join(process.cwd(), "public")
const SIZES = [96, 192, 512]

async function generateIcons() {
  const sourceImage = path.join(PUBLIC_DIR, "icon.png")

  if (!fs.existsSync(sourceImage)) {
    console.log("Source icon not found at", sourceImage)
    return
  }

  for (const size of SIZES) {
    const outputPath = path.join(PUBLIC_DIR, `icon-${size}.png`)

    await sharp(sourceImage)
      .resize(size, size, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toFile(outputPath)

    console.log(`Generated ${outputPath}`)
  }
}

generateIcons().catch(console.error)
