import fs from "fs"
import path from "path"

const requiredFiles = ["public/manifest.json", "public/service-worker.js", ".next/BUILD_ID"]

const requiredEnvVars = ["NEXT_PUBLIC_CRYPTO_ENABLED", "NEXT_PUBLIC_E2EE_ENABLED", "NEXT_PUBLIC_IP_MASKING_ENABLED"]

function validateBuild(): boolean {
  console.log("Validating build...")

  // Check required files
  for (const file of requiredFiles) {
    const filePath = path.join(process.cwd(), file)
    if (!fs.existsSync(filePath)) {
      console.warn(`Warning: ${file} not found`)
    }
  }

  // Check environment variables
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.warn(`Warning: ${envVar} not set`)
    }
  }

  console.log("Build validation complete")
  return true
}

validateBuild()
