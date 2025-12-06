# WordIT Backend Starter Script
Set-Location -Path (Split-Path -Parent $MyInvocation.MyCommand.Path)

$env:DATABASE_URL = 'postgresql://neondb_owner:npg_QW0gm5ySioHe@ep-nameless-pond-a1oa6nfj-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
$env:JWT_ACCESS_SECRET = 'wordit_secret_key_development_2025'
$env:HOST = 'localhost'
$env:PORT = '4000'
$env:NODE_ENV = 'development'

Write-Host "🚀 Starting WordIT Backend Server..." -ForegroundColor Cyan
& (Join-Path $env:USERPROFILE '.bun\bin\bun.exe') run --watch src/main.ts
