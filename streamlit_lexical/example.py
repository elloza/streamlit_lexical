import streamlit as st
from __init__ import streamlit_lexical
# Add some test code to play with the component while it's in development.
# During development, we can run this just as we would any other Streamlit
# app: `$ streamlit run my_component/example.py`

st.subheader("Lexical Rich Text Editor")

# Create an instance of our component with a constant `name` arg, and
# print its output value.
markdown = streamlit_lexical("test")

st.markdown(markdown)

st.markdown("---")