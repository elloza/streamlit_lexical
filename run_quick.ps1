# Script rápido - Solo ejecuta Streamlit (sin recompilar)
# Uso: .\run_quick.ps1

$projectRoot = $PSScriptRoot
Set-Location $projectRoot

Write-Host "🚀 Iniciando Streamlit..." -ForegroundColor Cyan
Write-Host "📍 URL: http://localhost:8501" -ForegroundColor Green
Write-Host ""

# Usar conda si está disponible
$condaPath = "C:/Users/Loza/Anaconda3/Scripts/conda.exe"
$condaEnv = "$projectRoot\.conda"

if ((Test-Path $condaPath) -and (Test-Path $condaEnv)) {
    & $condaPath run -p $condaEnv --no-capture-output streamlit run streamlit_lexical\example_complete.py
} else {
    streamlit run streamlit_lexical\example_complete.py
}
