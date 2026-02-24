import fs from 'fs'
import path from 'path'

interface VerificationResult {
  name: string
  status: 'pass' | 'fail' | 'warn'
  message: string
}

const results: VerificationResult[] = []

function addResult(name: string, status: 'pass' | 'fail' | 'warn', message: string) {
  results.push({ name, status, message })
  console.log(`[${status.toUpperCase()}] ${name}: ${message}`)
}

// Check 1: Environment Variables
console.log('\n=== CHECKING ENVIRONMENT VARIABLES ===')
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
]

const serverEnvVars = ['SUPABASE_SERVICE_ROLE_KEY']

requiredEnvVars.forEach((envVar) => {
  if (process.env[envVar]) {
    addResult(envVar, 'pass', 'Set and accessible')
  } else {
    addResult(envVar, 'fail', 'Missing - required for frontend')
  }
})

serverEnvVars.forEach((envVar) => {
  if (process.env[envVar]) {
    addResult(envVar, 'pass', 'Set for server-side operations')
  } else {
    addResult(envVar, 'warn', 'Not set - server operations will be limited')
  }
})

// Check 2: Required Files
console.log('\n=== CHECKING REQUIRED FILES ===')
const requiredFiles = [
  'lib/supabase/client.ts',
  'lib/services/merchant-service.ts',
  'lib/services/admin-service.ts',
  'lib/services/mfs-service.ts',
  'types/database.ts',
  'package.json',
  'tsconfig.json',
]

requiredFiles.forEach((file) => {
  const filePath = path.join(process.cwd(), file)
  if (fs.existsSync(filePath)) {
    addResult(file, 'pass', 'File exists')
  } else {
    addResult(file, 'fail', 'File missing')
  }
})

// Check 3: Package Dependencies
console.log('\n=== CHECKING DEPENDENCIES ===')
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
  const requiredDeps = [
    'next',
    'react',
    'react-dom',
    '@supabase/supabase-js',
    'react-hook-form',
    'zod',
    'tailwindcss',
    'vaul',
  ]

  requiredDeps.forEach((dep) => {
    if (packageJson.dependencies[dep]) {
      const version = packageJson.dependencies[dep]
      addResult(dep, 'pass', `Version ${version}`)
    } else {
      addResult(dep, 'fail', 'Missing from package.json')
    }
  })

  // Check for React 19 compatibility
  if (packageJson.dependencies.react === '19.2.0') {
    const vaulVersion = packageJson.dependencies.vaul
    if (vaulVersion && (vaulVersion.includes('^1') || vaulVersion.includes('^2'))) {
      addResult('React 19 + vaul', 'pass', `Compatible versions`)
    } else {
      addResult('React 19 + vaul', 'fail', `vaul version ${vaulVersion} incompatible with React 19`)
    }
  }
} catch (error) {
  addResult('package.json', 'fail', 'Could not parse package.json')
}

// Check 4: Git Status
console.log('\n=== CHECKING GIT STATUS ===')
try {
  const gitStatus = require('child_process').execSync('git status --short', { encoding: 'utf-8' })
  const uncommitted = gitStatus.trim().split('\n').filter((line) => line.length > 0)
  if (uncommitted.length === 0) {
    addResult('Git', 'pass', 'All changes committed')
  } else {
    addResult('Git', 'warn', `${uncommitted.length} uncommitted files`)
  }
} catch (error) {
  addResult('Git', 'warn', 'Could not check git status')
}

// Check 5: Security Scan
console.log('\n=== SECURITY CHECK ===')
const securityRisks = ['password', 'api_key', 'secret', 'token', 'credential']
try {
  const gitLog = require('child_process').execSync('git log --all -p | head -10000', {
    encoding: 'utf-8',
  })
  let foundRisks = false
  securityRisks.forEach((risk) => {
    if (gitLog.toLowerCase().includes(risk)) {
      addResult('Git History', 'warn', `Potential ${risk} exposed in history`)
      foundRisks = true
    }
  })
  if (!foundRisks) {
    addResult('Git History', 'pass', 'No obvious secrets detected')
  }
} catch (error) {
  addResult('Security Scan', 'warn', 'Could not scan git history')
}

// Summary
console.log('\n=== SUMMARY ===')
const passCount = results.filter((r) => r.status === 'pass').length
const failCount = results.filter((r) => r.status === 'fail').length
const warnCount = results.filter((r) => r.status === 'warn').length

console.log(`✓ Pass: ${passCount}`)
console.log(`✗ Fail: ${failCount}`)
console.log(`⚠ Warn: ${warnCount}`)

if (failCount > 0) {
  console.log('\n⚠️  VERIFICATION FAILED - Please fix the errors above')
  process.exit(1)
} else if (warnCount > 0) {
  console.log('\n⚠️  VERIFICATION PASSED WITH WARNINGS - Please review warnings above')
  process.exit(0)
} else {
  console.log('\n✅ VERIFICATION PASSED - Ready to build')
  process.exit(0)
}
