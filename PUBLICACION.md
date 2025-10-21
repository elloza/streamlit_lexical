# 📦 Guía de Publicación del Paquete

## 🎯 Resumen del Componente

**streamlit_lexical** es un componente de Streamlit que integra el editor de texto enriquecido **Lexical** de Meta, con soporte para:
- ✅ Inserción de imágenes (URL + upload con compresión automática)
- ✅ Bloques de código con selector de lenguaje (20+ lenguajes)
- ✅ Exportación a Markdown con base64 para imágenes
- ✅ Formateo completo de texto (bold, italic, headers, listas, etc.)

## 📋 Pre-requisitos para Publicación

Antes de publicar en PyPI, asegúrate de tener:

```powershell
pip install --upgrade pip setuptools wheel twine
```

## 🔧 Preparación del Paquete

### 1. Compilar el Frontend

```powershell
cd streamlit_lexical\frontend
npm install
npm run build
cd ..\..
```

### 2. Verificar RELEASE = True

Edita `streamlit_lexical\__init__.py` y asegúrate de que:

```python
RELEASE = True
```

### 3. Limpiar Builds Anteriores

```powershell
# Borrar carpetas de build antiguas
Remove-Item -Recurse -Force dist, build, *.egg-info -ErrorAction SilentlyContinue
```

## 📦 Construcción del Paquete

### Crear Distribución

```powershell
python setup.py sdist bdist_wheel
```

Esto creará:
- `dist/streamlit_lexical-1.3.0.tar.gz` (source distribution)
- `dist/streamlit_lexical-1.3.0-py3-none-any.whl` (wheel)

### Verificar el Contenido del Paquete

```powershell
# Ver contenido del wheel
python -m zipfile -l dist\streamlit_lexical-1.3.0-py3-none-any.whl

# Verificar que incluye:
# - streamlit_lexical\frontend\build\ (archivos compilados)
# - streamlit_lexical\__init__.py
# - MANIFEST.in
```

## 🧪 Prueba Local del Paquete

Antes de publicar, prueba la instalación local:

```powershell
# Crear entorno virtual de prueba
python -m venv test_env
test_env\Scripts\activate

# Instalar desde el wheel local
pip install dist\streamlit_lexical-1.3.0-py3-none-any.whl

# Probar
streamlit run streamlit_lexical\example.py

# Limpiar
deactivate
Remove-Item -Recurse test_env
```

## 🚀 Publicación en PyPI

### Opción 1: PyPI Test (Recomendado Primero)

Publica primero en TestPyPI para verificar:

```powershell
# Subir a TestPyPI
twine upload --repository testpypi dist/*

# URL: https://test.pypi.org/

# Probar instalación desde TestPyPI
pip install --index-url https://test.pypi.org/simple/ streamlit-lexical
```

### Opción 2: PyPI Producción

Una vez verificado en TestPyPI:

```powershell
twine upload dist/*
```

Te pedirá:
- **Username**: Tu usuario de PyPI
- **Password**: Tu API token de PyPI

> 💡 **Tip**: Usa un API token en lugar de tu contraseña. Crear en: https://pypi.org/manage/account/token/

### Configurar Credenciales (Opcional)

Crea `~/.pypirc`:

```ini
[distutils]
index-servers =
    pypi
    testpypi

[pypi]
username = __token__
password = pypi-AgEI... (tu token)

[testpypi]
username = __token__
password = pypi-AgEI... (tu token de test)
```

## ✅ Verificación Post-Publicación

### 1. Verificar en PyPI
- URL: https://pypi.org/project/streamlit-lexical/
- Revisa README, versión, archivos

### 2. Instalación desde PyPI

```powershell
# En un entorno limpio
pip install streamlit-lexical

# Verificar versión
pip show streamlit-lexical
```

### 3. Prueba Funcional

```python
import streamlit as st
from streamlit_lexical import streamlit_lexical

markdown = streamlit_lexical(
    value="# Test\n\nComponent instalado correctamente!",
    placeholder="Prueba el editor...",
    min_height=400,
    key='test'
)

st.markdown(markdown)
```

## 🔄 Actualizar Versión

Para publicar una nueva versión:

1. **Incrementar versión** en `setup.py`:
   ```python
   version="1.3.1",  # o 1.4.0, 2.0.0, etc.
   ```

2. **Repetir proceso de construcción y publicación**

## 📊 Estructura del Paquete Publicado

```
streamlit_lexical/
├── __init__.py           # Entry point con _component_func
├── frontend/
│   └── build/            # Frontend compilado (React)
│       ├── static/
│       │   ├── js/
│       │   │   └── main.afbd4686.js  (164 kB)
│       │   └── css/
│       │       └── main.323e0fbc.css (2.66 kB)
│       └── index.html
├── example.py            # Ejemplo de uso
└── example2.py           # Ejemplo avanzado
```

## 🐛 Solución de Problemas

### Error: "RELEASE = False"
- Asegúrate de cambiar `RELEASE = True` en `__init__.py`

### Error: Frontend no compilado
- Ejecuta `npm run build` en `streamlit_lexical/frontend`

### Error: Archivos faltantes en el paquete
- Verifica `MANIFEST.in`:
  ```
  recursive-include streamlit_lexical/frontend/build *
  ```

### Error: Versión ya existe en PyPI
- Incrementa la versión en `setup.py`
- No puedes sobrescribir versiones existentes en PyPI

## 📖 Uso en Otros Proyectos

Una vez publicado, tus usuarios instalan con:

```bash
pip install streamlit-lexical
```

Y lo usan en su código:

```python
from streamlit_lexical import streamlit_lexical

# Tu componente está listo!
content = streamlit_lexical(
    value="# Mi Documento",
    min_height=500
)
```

## 🎉 ¡Listo!

Tu componente está publicado y listo para ser usado por la comunidad de Streamlit.

### Links Útiles

- **PyPI Package**: https://pypi.org/project/streamlit-lexical/
- **Streamlit Components**: https://docs.streamlit.io/develop/concepts/custom-components
- **Twine Docs**: https://twine.readthedocs.io/

---

**Versión Actual**: 1.3.0  
**Última Compilación**: Frontend build successful (166.59 kB)  
**Características**:
  - ✅ Syntax highlighting visual con Prism.js
  - ✅ Export correcto a markdown (` ```language `)
  - ✅ Compatible con LaTeX processors
  - ✅ Compresión de imágenes (max 1920x1080)
  - ✅ 20+ lenguajes de programación
**Estado**: ✅ Listo para publicación
