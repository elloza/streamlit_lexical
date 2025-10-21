# Script principal con múltiples opciones
# Uso: 
#   .\dev.ps1           - Compilar y ejecutar (full)
#   .\dev.ps1 -Quick    - Solo ejecutar (sin compilar)
#   .\dev.ps1 -Build    - Solo compilar frontend
#   .\dev.ps1 -Clean    - Limpiar archivos temporales

param(
    [switch]$Quick,
    [switch]$Build,
    [switch]$Clean
)

$projectRoot = $PSScriptRoot

# Función para limpiar
function Clean-Project {
    Write-Host "🧹 Limpiando proyecto..." -ForegroundColor Yellow
    
    # Frontend
    if (Test-Path "$projectRoot\streamlit_lexical\frontend\node_modules") {
        Write-Host "  - Eliminando node_modules..." -ForegroundColor Gray
        Remove-Item -Recurse -Force "$projectRoot\streamlit_lexical\frontend\node_modules"
    }
    
    if (Test-Path "$projectRoot\streamlit_lexical\frontend\build") {
        Write-Host "  - Eliminando build..." -ForegroundColor Gray
        Remove-Item -Recurse -Force "$projectRoot\streamlit_lexical\frontend\build"
    }
    
    # Python
    if (Test-Path "$projectRoot\dist") {
        Write-Host "  - Eliminando dist..." -ForegroundColor Gray
        Remove-Item -Recurse -Force "$projectRoot\dist"
    }
    
    if (Test-Path "$projectRoot\build") {
        Write-Host "  - Eliminando build..." -ForegroundColor Gray
        Remove-Item -Recurse -Force "$projectRoot\build"
    }
    
    Get-ChildItem -Path $projectRoot -Filter "*.egg-info" -Recurse | Remove-Item -Recurse -Force
    Get-ChildItem -Path $projectRoot -Filter "__pycache__" -Recurse | Remove-Item -Recurse -Force
    
    Write-Host "✅ Limpieza completa" -ForegroundColor Green
}

# Función para compilar frontend
function Build-Frontend {
    Write-Host "🔨 Compilando Frontend..." -ForegroundColor Yellow
    Set-Location "$projectRoot\streamlit_lexical\frontend"
    
    if (-Not (Test-Path "node_modules")) {
        Write-Host "  - Instalando dependencias npm..." -ForegroundColor Gray
        npm install
        if ($LASTEXITCODE -ne 0) { return $false }
    }
    
    npm run build
    if ($LASTEXITCODE -ne 0) { return $false }
    
    Write-Host "✅ Frontend compilado" -ForegroundColor Green
    return $true
}

# Función para instalar Python
function Install-Python {
    Write-Host "📦 Instalando paquete Python..." -ForegroundColor Yellow
    Set-Location $projectRoot
    
    $condaPath = "C:/Users/Loza/Anaconda3/Scripts/conda.exe"
    $condaEnv = "$projectRoot\.conda"
    
    if ((Test-Path $condaPath) -and (Test-Path $condaEnv)) {
        & $condaPath run -p $condaEnv --no-capture-output python -m pip install -e . --quiet
    } else {
        python -m pip install -e . --quiet
    }
    
    if ($LASTEXITCODE -ne 0) { return $false }
    
    Write-Host "✅ Paquete instalado" -ForegroundColor Green
    return $true
}

# Función para ejecutar Streamlit
function Run-Streamlit {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  🚀 Servidor Streamlit" -ForegroundColor Green
    Write-Host "  📍 http://localhost:8501" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    
    Set-Location $projectRoot
    
    $condaPath = "C:/Users/Loza/Anaconda3/Scripts/conda.exe"
    $condaEnv = "$projectRoot\.conda"
    
    if ((Test-Path $condaPath) -and (Test-Path $condaEnv)) {
        & $condaPath run -p $condaEnv --no-capture-output streamlit run streamlit_lexical\example_complete.py
    } else {
        streamlit run streamlit_lexical\example_complete.py
    }
}

# Mostrar banner
Write-Host ""
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Streamlit Lexical - Dev Tool        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Ejecutar según opciones
if ($Clean) {
    Clean-Project
}
elseif ($Build) {
    if (Build-Frontend) {
        Write-Host ""
        Write-Host "✨ Listo! Ejecuta '.\dev.ps1 -Quick' para iniciar" -ForegroundColor Green
    } else {
        Write-Host "❌ Error al compilar" -ForegroundColor Red
        exit 1
    }
}
elseif ($Quick) {
    Run-Streamlit
}
else {
    # Full build
    if (-Not (Build-Frontend)) {
        Write-Host "❌ Error al compilar frontend" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    
    if (-Not (Install-Python)) {
        Write-Host "❌ Error al instalar paquete Python" -ForegroundColor Red
        exit 1
    }
    
    Run-Streamlit
}
