"""
Ejemplo Completo - Streamlit Lexical con Mejoras

Este ejemplo demuestra las nuevas funcionalidades:
1. Inserción de imágenes con base64
2. Selector de lenguaje para bloques de código
"""

import streamlit as st
from streamlit_lexical import streamlit_lexical

# Configuración de la página
st.set_page_config(
    page_title="Editor Lexical Mejorado",
    page_icon="✨",
    layout="wide"
)

# Título y descripción
st.title("✨ Editor Lexical con Mejoras")
st.markdown("""
### Nuevas Funcionalidades:
- 📷 **Inserción de Imágenes**: Sube archivos o usa URLs (con conversión automática a base64)
- 💻 **Selector de Lenguaje**: Elige entre 20+ lenguajes para resaltar tu código
""")

# Sidebar con instrucciones
with st.sidebar:
    st.header("📖 Instrucciones")
    
    st.subheader("🖼️ Insertar Imágenes")
    st.markdown("""
    1. Haz clic en el botón 📷 en la toolbar
    2. Selecciona **"URL"** o **"File"**
    3. Si es URL: pega la dirección
    4. Si es File: selecciona un archivo local
    5. Agrega texto alternativo (opcional)
    6. Confirma
    
    **Nota**: Las imágenes subidas se convierten a base64 automáticamente.
    """)
    
    st.subheader("💻 Bloques de Código")
    st.markdown("""
    1. Haz clic en el botón </> "Code Block"
    2. Aparecerá un selector "Language"
    3. Selecciona tu lenguaje (JS, Python, Java, etc.)
    4. Escribe tu código
    5. El resaltado se aplicará automáticamente
    """)
    
    st.divider()
    
    st.subheader("⚙️ Configuración")
    height = st.slider("Altura del Editor", 300, 1000, 600, 50)
    debounce = st.slider("Debounce (ms)", 0, 2000, 300, 100)

# Contenido inicial con ejemplos
initial_content = """# ¡Bienvenido al Editor Mejorado! 🎉

Este editor ahora incluye mejoras importantes:

## 📷 Inserción de Imágenes
Haz clic en el botón de imagen para:
- Insertar desde URL
- Subir archivo local (se convierte a base64 automáticamente)

## 💻 Código con Resaltado
Crea un bloque de código y selecciona el lenguaje:

```javascript
// Este es un ejemplo de JavaScript
function hello(name) {
  console.log(`¡Hola, ${name}!`);
}
```

Prueba crear tu propio bloque de código y seleccionar el lenguaje desde el menú desplegable.

## 🎨 Otras Características
- **Negrita**, *cursiva*, <u>subrayado</u>
- Listas ordenadas y desordenadas
- Títulos (H1, H2, H3)
- Citas
- Enlaces
- ¡Y mucho más!

---

**¡Empieza a crear contenido increíble!** ✨
"""

# Crear dos columnas
col1, col2 = st.columns([2, 1])

with col1:
    st.subheader("📝 Editor")
    
    # El editor principal
    content = streamlit_lexical(
        value=initial_content,
        placeholder="Escribe algo increíble aquí...",
        height=height,
        debounce=debounce,
        key="main_editor"
    )

with col2:
    st.subheader("📊 Estado del Editor")
    
    if content:
        # Mostrar estadísticas
        st.metric("Longitud", len(content.get("markdown", "")))
        
        # Contar elementos
        markdown_text = content.get("markdown", "")
        num_images = markdown_text.count("![")
        num_code_blocks = markdown_text.count("```")
        num_headings = markdown_text.count("#")
        
        col_a, col_b = st.columns(2)
        with col_a:
            st.metric("🖼️ Imágenes", num_images)
            st.metric("💻 Código", num_code_blocks)
        with col_b:
            st.metric("📌 Títulos", num_headings)
            st.metric("📄 Líneas", markdown_text.count("\n") + 1)
        
        # Detectar imágenes base64
        has_base64 = "data:image" in markdown_text
        if has_base64:
            st.success("✅ Contiene imágenes en base64")
        
        st.divider()
        
        # Tabs para ver diferentes formatos
        tab1, tab2 = st.tabs(["Markdown", "JSON"])
        
        with tab1:
            st.code(content.get("markdown", ""), language="markdown")
        
        with tab2:
            st.json(content)

# Sección de pruebas rápidas
st.divider()
st.header("🧪 Pruebas Rápidas")

col1, col2, col3 = st.columns(3)

with col1:
    st.subheader("📷 Ejemplo de Imagen")
    st.markdown("""
    **Prueba insertar esta imagen:**
    ```
    https://picsum.photos/400/300
    ```
    """)
    
    if st.button("📋 Copiar URL"):
        st.code("https://picsum.photos/400/300")
        st.info("URL copiada! Pégala en el diálogo de imagen")

with col2:
    st.subheader("💻 Código JavaScript")
    st.markdown("""
    **Prueba este código:**
    """)
    code_example_js = """const greet = (name) => {
  console.log(`Hello, ${name}!`);
};
greet('World');"""
    
    st.code(code_example_js, language="javascript")
    
    if st.button("📋 Copiar Código JS"):
        st.code(code_example_js)
        st.info("Código copiado! Pégalo en un bloque de código")

with col3:
    st.subheader("🐍 Código Python")
    st.markdown("""
    **Prueba este código:**
    """)
    code_example_py = """def greet(name):
    print(f"Hello, {name}!")

greet('World')"""
    
    st.code(code_example_py, language="python")
    
    if st.button("📋 Copiar Código Python"):
        st.code(code_example_py)
        st.info("Código copiado! Pégalo en un bloque de código")

# Tips al final
st.divider()
st.info("""
💡 **Tips Profesionales:**
- Usa **Ctrl/Cmd + B** para negrita
- Usa **Ctrl/Cmd + I** para cursiva
- Usa **Ctrl/Cmd + U** para subrayar
- Las imágenes base64 son portables pero pueden ser pesadas
- Selecciona el lenguaje correcto para mejor legibilidad del código
""")

# Footer
st.markdown("---")
st.markdown("""
<div style="text-align: center; color: #666;">
    <p>Editor Lexical Mejorado | Desarrollado con ❤️ usando Streamlit</p>
    <p>Funcionalidades: Imágenes Base64 + Selector de Lenguaje de Código</p>
</div>
""", unsafe_allow_html=True)
