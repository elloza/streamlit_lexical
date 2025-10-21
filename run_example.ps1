# Script de PowerShell para compilar y ejecutar Streamlit Lexical
# Uso: .\run_example.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Streamlit Lexical - Build & Run" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Directorio raíz del proyecto
$projectRoot = $PSScriptRoot
Set-Location $projectRoot

# 1. Compilar Frontend
Write-Host "[1/3] Compilando Frontend..." -ForegroundColor Yellow
Set-Location "$projectRoot\streamlit_lexical\frontend"

# Verificar si node_modules existe
if (-Not (Test-Path "node_modules")) {
    Write-Host "  - Instalando dependencias npm (primera vez)..." -ForegroundColor Gray
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error al instalar dependencias npm" -ForegroundColor Red
        exit 1
    }
}

# Build
Write-Host "  - Compilando TypeScript..." -ForegroundColor Gray
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al compilar frontend" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Frontend compilado correctamente" -ForegroundColor Green
Write-Host ""

# 2. Instalar paquete Python
Write-Host "[2/3] Instalando paquete Python..." -ForegroundColor Yellow
Set-Location $projectRoot

# Usar conda si está disponible, sino pip normal
$condaPath = "C:/Users/Loza/Anaconda3/Scripts/conda.exe"
$condaEnv = "$projectRoot\.conda"

if ((Test-Path $condaPath) -and (Test-Path $condaEnv)) {
    Write-Host "  - Usando entorno conda..." -ForegroundColor Gray
    & $condaPath run -p $condaEnv --no-capture-output python -m pip install -e . --quiet
} else {
    Write-Host "  - Usando pip..." -ForegroundColor Gray
    python -m pip install -e . --quiet
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al instalar paquete Python" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Paquete Python instalado" -ForegroundColor Green
Write-Host ""

# 3. Ejecutar Streamlit
Write-Host "[3/3] Iniciando Streamlit..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  🚀 Servidor iniciado" -ForegroundColor Green
Write-Host "  📍 URL: http://localhost:8501" -ForegroundColor Green
Write-Host "  📝 Archivo: example_complete.py" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Gray
Write-Host ""

if ((Test-Path $condaPath) -and (Test-Path $condaEnv)) {
    & $condaPath run -p $condaEnv --no-capture-output streamlit run streamlit_lexical\example_complete.py
} else {
    streamlit run streamlit_lexical\example_complete.py
}
