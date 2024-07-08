import React, { useEffect } from "react";
import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib";
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { EditorState } from 'lexical';
import ToolbarPlugin from './plugins/ToolbarPlugin';

import theme from './theme';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { CodeNode } from '@lexical/code';
import {ListNode, ListItemNode} from '@lexical/list'
import {LinkNode} from '@lexical/link'

interface State {
  editorState: string;
}

class StreamlitLexical extends StreamlitComponentBase<State> {
  public state: State = {
    editorState: '',
  };

  private editorConfig = {
    namespace: 'MyStreamlitRichTextEditor',
    theme: theme,
    onError: (error: Error) => {
      console.error('Lexical error:', error);
    },
    nodes: [HorizontalRuleNode, HeadingNode, QuoteNode, CodeNode, ListNode, ListItemNode, LinkNode],
  };

  public render = (): React.ReactNode => {
    const { theme } = this.props;
    const style: React.CSSProperties = {};

    if (theme) {
      style.borderColor = theme.primaryColor;
    }

    return (
      <div style={style} className="streamlit-lexical-editor">
        <LexicalComposer initialConfig={this.editorConfig}>
          <div className="editor-container">
            <ToolbarPlugin />
            <div className="editor-inner">
              <RichTextPlugin
                contentEditable={<ContentEditable className="editor-input" />}
                placeholder={<Placeholder />}
                ErrorBoundary={LexicalErrorBoundary}
              />
              <HistoryPlugin />
              <AutoFocusPlugin />
              <MarkdownShortcutPlugin />
              {/* <TreeViewPlugin /> */}
              <OnChangePlugin onChange={this.handleEditorChange} />
            </div>
          </div>
        </LexicalComposer>
      </div>
    );
  };

  private handleEditorChange = (editorState: any) => {
    editorState.read(() => {
      const jsonState = JSON.stringify(editorState.toJSON());
      this.setState({ editorState: jsonState });
      Streamlit.setComponentValue(jsonState);
    });
  };
}

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

function OnChangePlugin({ onChange }: { onChange: (editorState: EditorState) => void }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState);
    });
  }, [editor, onChange]);
  return null;
}

export default withStreamlitConnection(StreamlitLexical);