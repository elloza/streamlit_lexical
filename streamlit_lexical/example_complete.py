import streamlit as st
from streamlit_lexical import streamlit_lexical

st.set_page_config(page_title="Streamlit Lexical - Demo Completa", layout="wide")

st.title("🚀 Editor de Texto Rico Streamlit Lexical")
st.markdown("""
Este editor ahora incluye todas las funcionalidades avanzadas del editor Lexical:
- **Formato de texto**: Negrita, cursiva, subrayado, tachado, código inline
- **Encabezados**: H1, H2, H3
- **Listas**: Con viñetas y numeradas
- **Bloques especiales**: Citas y bloques de código
- **Enlaces**: Insertar y editar enlaces
- **Imágenes**: Insertar imágenes mediante URL
- **Alineación**: Izquierda, centro, derecha, justificado
""")

# Contenido inicial con ejemplos de todas las funcionalidades
initial_content = """# ¡Bienvenido al Editor Lexical Mejorado!

Este editor rico ahora soporta **todas las funcionalidades** que necesitas para crear contenido profesional.

## Características de Formato de Texto

Puedes usar **negrita**, *cursiva*, ***ambos a la vez***, ~~tachado~~, y hasta `código inline`.

## Listas y Organización

### Lista con viñetas:
- Primer elemento
- Segundo elemento
- Tercer elemento con **formato**

### Lista numerada:
1. Paso uno
2. Paso dos
3. Paso tres

## Bloques Especiales

> Esta es una cita. Perfecta para destacar información importante o citas textuales.

```
// Bloque de código
function ejemplo() {
    return "¡Código formateado!";
}
```

## Enlaces e Imágenes

Puedes insertar [enlaces](https://github.com) fácilmente.

Para insertar imágenes, usa el botón 🖼️ en el toolbar y proporciona una URL de imagen.

## Alineación de Texto

Usa los botones de alineación en el toolbar para alinear el texto a la izquierda, centro, derecha o justificado.

---

**¡Comienza a editar y explora todas las funcionalidades!**
"""

col1, col2 = st.columns([2, 1])

with col1:
    st.subheader("📝 Editor")
    
    # Editor con todas las opciones
    content = streamlit_lexical(
        value=initial_content,
        placeholder="Escribe algo increíble...",
        min_height=500,
        debounce=300,
        key="rich_editor",
        overwrite=False
    )

with col2:
    st.subheader("📊 Salida Markdown")
    st.markdown("El contenido se guarda automáticamente en formato Markdown:")
    
    if content:
        with st.expander("Ver Markdown Raw"):
            st.code(content, language="markdown")
        
        st.markdown("---")
        st.subheader("Vista Previa")
        st.markdown(content)

# Información adicional
st.markdown("---")
st.info("""
### 💡 Consejos de Uso:
- **Ctrl/Cmd + B**: Negrita
- **Ctrl/Cmd + I**: Cursiva  
- **Ctrl/Cmd + U**: Subrayado
- **Ctrl/Cmd + Z**: Deshacer
- **Ctrl/Cmd + Shift + Z**: Rehacer
- Usa el toolbar para acceder a todas las funcionalidades
- El contenido se sincroniza automáticamente con Streamlit
""")

st.success("✨ Editor compilado exitosamente con todas las funcionalidades de Lexical")
