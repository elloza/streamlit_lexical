# Script para solo compilar el frontend
# Uso: .\build_frontend.ps1

$projectRoot = $PSScriptRoot
Set-Location "$projectRoot\streamlit_lexical\frontend"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Compilando Frontend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si node_modules existe
if (-Not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error al instalar dependencias" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
}

# Build
Write-Host "🔨 Compilando TypeScript..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Error al compilar" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Frontend compilado correctamente" -ForegroundColor Green
Write-Host ""
Write-Host "Ejecuta 'run_quick.ps1' para iniciar Streamlit" -ForegroundColor Gray
