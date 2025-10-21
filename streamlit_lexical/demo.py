import streamlit as st
from __init__ import streamlit_lexical

st.set_page_config(page_title="Lexical Editor - Demo", layout="wide")

st.title("🎨 Streamlit Lexical Editor - Complete Demo")
st.markdown("Editor de texto enriquecido con soporte para **imágenes**, **código con highlighting** y **markdown**")

st.markdown("---")

# Initialize session state
if "editor_content" not in st.session_state:
    st.session_state["editor_content"] = """# Bienvenido al Editor Lexical

Este editor soporta **múltiples características**:

## 1. Formato de Texto
- **Negrita**, *cursiva*, ~~tachado~~, `código inline`
- Headers (H1, H2, H3)
- Listas y quotes

## 2. Bloques de Código con Syntax Highlighting

Puedes insertar código y seleccionar el lenguaje:

```python
def calcular_factorial(n):
    if n <= 1:
        return 1
    return n * calcular_factorial(n - 1)

# Ejemplo de uso
resultado = calcular_factorial(5)
print(f"5! = {resultado}")
```

```javascript
// Función para validar email
function validarEmail(email) {
    const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return regex.test(email);
}

console.log(validarEmail('usuario@ejemplo.com'));
```

```java
public class Ejemplo {
    public static void main(String[] args) {
        System.out.println("Hola Mundo!");
        
        // Calcular suma
        int suma = 10 + 20;
        System.out.println("Suma: " + suma);
    }
}
```

## 3. Imágenes
Puedes insertar imágenes desde URL o subirlas desde archivo (se comprimen automáticamente).

## 4. Enlaces
Visita [OpenAI](https://openai.com) para más información.

---

**¡Prueba todas las funcionalidades!**
"""

col1, col2 = st.columns([3, 1])

with col1:
    st.subheader("📝 Editor")
    
with col2:
    st.subheader("⚙️ Controles")
    
    if st.button("🔄 Reset Contenido", use_container_width=True):
        st.session_state["editor_content"] = st.session_state["editor_content"]
        st.rerun()
    
    if st.button("📋 Copiar Markdown", use_container_width=True):
        st.code(st.session_state.get("editor", ""), language="markdown")
        st.success("Markdown mostrado abajo!")

# Editor
markdown = streamlit_lexical(
    value=st.session_state["editor_content"],
    placeholder="Escribe tu contenido aquí...",
    key="editor",
    min_height=600,
    debounce=300,
)

st.markdown("---")

# Tabs para mostrar resultados
tab1, tab2, tab3 = st.tabs(["📄 Preview", "💾 Markdown Raw", "ℹ️ Información"])

with tab1:
    st.subheader("Vista Previa")
    st.markdown(markdown if markdown else "*Editor vacío*")

with tab2:
    st.subheader("Markdown (para procesar en LaTeX)")
    st.code(markdown if markdown else "", language="markdown", line_numbers=True)
    
    if markdown:
        # Mostrar estadísticas
        lines = markdown.count('\n') + 1
        words = len(markdown.split())
        chars = len(markdown)
        
        col1, col2, col3 = st.columns(3)
        col1.metric("Líneas", lines)
        col2.metric("Palabras", words)
        col3.metric("Caracteres", chars)

with tab3:
    st.subheader("Características del Editor")
    
    st.markdown("""
    ### ✨ Formato de Texto
    - Bold, italic, underline, strikethrough
    - Inline code
    - Headers (H1-H3)
    
    ### 📝 Bloques
    - Listas (bullets, números, checkboxes)
    - Quotes
    - Bloques de código con **20+ lenguajes**
    
    ### 🖼️ Imágenes
    - Insertar desde URL
    - Upload desde archivo
    - **Compresión automática** (max 1920x1080, JPEG 80%)
    - Límite de 10MB por archivo
    - Export a base64 en markdown
    
    ### 💻 Código con Syntax Highlighting
    - **Visual highlighting en el editor** (Prism.js)
    - Export correcto a markdown: ` ```language `
    - Compatible con LaTeX: `\\begin{lstlisting}[language=...]`
    
    ### 🔗 Características Extra
    - Links
    - Alineación de texto
    - Undo/Redo
    - Export a markdown con fidelidad completa
    """)
    
    st.info("**Nota para LaTeX**: El markdown exportado es 100% compatible con tu procesador Python que usa `\\begin{lstlisting}` para bloques de código.")

st.markdown("---")
st.caption("Streamlit Lexical Editor v1.3.0 - Powered by Meta's Lexical")
