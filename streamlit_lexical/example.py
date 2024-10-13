import streamlit as st
from __init__ import streamlit_lexical

def update_val():
    new_content = "# New Heading\n\nThis is updated content in **Markdown**."
    st.session_state['editor_content'] = new_content
    st.session_state['overwrite'] = True


st.write("#")
st.header("Lexical Rich Text Editor")

# Initialize the session state for editor content
if 'editor_content' not in st.session_state:
    st.session_state['editor_content'] = 'initial value'

if 'overwrite' not in st.session_state:
    st.session_state['overwrite'] = True

# Button to update content
if st.button("Update Editor Content"):
    update_val()

# Create an instance of our component
markdown = streamlit_lexical(
    value=st.session_state['editor_content'],
    placeholder="Enter some rich text",
    key='editor',
    height=800,
    overwrite=st.session_state['overwrite']
)
st.session_state['overwrite'] = False

st.markdown(markdown)
st.markdown("---")

# Display the current content in session state (for debugging)
st.write("Current content in session state:", st.session_state['editor_content'])