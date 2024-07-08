# streamlit-custom-component

Streamlit component that allows you to use Lexical's rich text plugin. 

## Installation instructions

```sh
pip install streamlit_lexical
```

## Usage instructions

```python
import streamlit as st

from streamlit_lexical import streamlit_lexical

rich_text_dict = streamlit_lexical("name")

st.markdown(rich_text_dict)
```