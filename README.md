# streamlit_lexical

Streamlit component that allows you to use Meta's [Lexical](https://lexical.dev/) as a rich text editor with full formatting capabilities. 

## Installation instructions

```sh
pip install streamlit-lexical
```

## Features

✨ **Rich Text Formatting**
- Bold, italic, underline, strikethrough
- Inline code formatting
- Multiple heading levels (H1, H2, H3)

📝 **Content Organization**
- Bulleted and numbered lists
- Block quotes
- Code blocks with language selector (Python, JavaScript, Java, C++, SQL, etc.)

�️ **Media & Images**
- Insert images via URL
- Upload images from file (automatic compression)
- Base64 encoding for embedded images in markdown
- Smart compression: resizes large images to 1920x1080 max, converts to JPEG format

🔗 **Links & More**
- Insert and edit hyperlinks
- Real-time markdown export

⚡ **Advanced Features**
- Text alignment (left, center, right, justify)
- Undo/Redo functionality
- Markdown export with full fidelity (images, code blocks, formatting)
- Real-time synchronization with Streamlit
- File size validation (10MB limit)
- Loading indicators for image processing

## Usage instructions

```python
import streamlit as st
from streamlit_lexical import streamlit_lexical

# Basic usage
markdown = streamlit_lexical(
    value="# Hello World\n\nStart editing with **full formatting** support!",
    placeholder="Enter some rich text...", 
    min_height=400,
    debounce=300,
    key='editor_1',
    overwrite=False
)

# Display the markdown output
st.markdown(markdown)
```

### Parameters

- `value` (str): Initial content in Markdown format
- `placeholder` (str): Placeholder text when editor is empty
- `min_height` (int): Minimum height of the editor in pixels (default: 400)
- `debounce` (int): Debounce delay in milliseconds for updates (default: 300)
- `key` (str): Unique key for the component
- `overwrite` (bool): Whether to overwrite content when value changes (default: False)

## Development instructions

### Setup for Development

After cloning the github repo, in `__init__.py`, set:
```python
RELEASE = False
```

#### Windows (PowerShell/CMD)

**Development mode with hot reload:**
```powershell
# Terminal 1 - Start the Webpack dev server
cd streamlit_lexical\frontend
npm install
npm run start
```

```powershell
# Terminal 2 - Run Streamlit
pip install -e .
streamlit run streamlit_lexical\example.py
```

**Build for production:**
```powershell
cd streamlit_lexical\frontend
npm install
npm run build
cd ..\..
pip install -e .
```

#### Linux/Mac

**Development mode with hot reload:**
```sh
# Terminal 1 - Start the Webpack dev server
cd streamlit_lexical/frontend
npm install
npm run start
```

```sh
# Terminal 2 - Run Streamlit
pip install -e .
streamlit run streamlit_lexical/example.py
```

**Build for production:**
```sh
cd streamlit_lexical/frontend
npm install
npm run build
cd ../..
pip install -e ./
```

**Note:** Make sure the `__init__.py` file has `RELEASE = True` for production builds. 