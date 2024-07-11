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
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import ToolbarPlugin from './plugins/ToolbarPlugin';

import theme from './theme';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown';

import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { CodeNode } from '@lexical/code';
import {ListNode, ListItemNode } from '@lexical/list'
import {ListPlugin} from '@lexical/react/LexicalListPlugin'
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
              <ListPlugin />
              {/* <TreeViewPlugin /> */}
              <OnChangePlugin onChange={this.handleEditorChange} />
            </div>
          </div>
        </LexicalComposer>
      </div>
    );
  };

  private handleEditorChange = debounce((editorState: any) => {
    editorState.read(() => {
      const markdown = $convertToMarkdownString(TRANSFORMERS);
      const jsonState = JSON.stringify(editorState.toJSON());
      this.setState({ editorState: jsonState });
      Streamlit.setComponentValue(markdown);
    });
  }, 500); // debounce is 500ms
}

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

export default withStreamlitConnection(StreamlitLexical);