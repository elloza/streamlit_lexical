import streamlit as st
from __init__ import streamlit_lexical
# Add some test code to play with the component while it's in development.
# During development, we can run this just as we would any other Streamlit
# app: `$ streamlit run my_component/example.py`

st.write("#") # if this isnt here, for some reason, if you change the heading prior to entering any text, the page jumps to the bottom
st.header("Lexical Rich Text Editor")

# Create an instance of our component with a constant `name` arg, and
markdown = streamlit_lexical(value="", placeholder="Enter some rich text", height=800)

st.markdown(markdown)
st.markdown("---")