import React, { useCallback, useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  $createParagraphNode,
  UNDO_COMMAND,
  REDO_COMMAND,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';

import { $createHeadingNode, $isHeadingNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [currentHeading, setCurrentHeading] = useState('paragraph');

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
  
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
  
      // Update heading
      if (elementDOM !== null) {
        const type = $isHeadingNode(element) ? element.getTag() : 'paragraph';
        setCurrentHeading(type);
      }
    }
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  useEffect(() => {
    return editor.registerCommand(
      CAN_UNDO_COMMAND,
      (payload) => {
        setCanUndo(payload);
        return false;
      },
      1
    );
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      CAN_REDO_COMMAND,
      (payload) => {
        setCanRedo(payload);
        return false;
      },
      1
    );
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);
  
  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar();
        return false;
      },
      1
    );
  }, [editor, updateToolbar]);

  const toolbarStyle: React.CSSProperties = {
    display: 'flex',
    marginBottom: '1px',
    background: '#fff',
    padding: '8px',
    border: '1px solid #ccc',
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  };
  
  const buttonStyle = {
    border: '1px solid #ccc',
    background: '#fff',
    borderRadius: '4px',
    padding: '6px 12px',
    margin: '0 4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold' as const,
  };

  const onHeadingChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () =>
            e.target.value === 'paragraph'
              ? $createParagraphNode()
              : $createHeadingNode(e.target.value as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6')
          );
        }
      });
    },
    [editor]
  );

  return (
    <div style={toolbarStyle}>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        style={{
          ...buttonStyle,
          backgroundColor: isBold ? '#e6e6e6' : '#fff',
        }}
        aria-label="Format Bold"
      >
        B
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        style={{
          ...buttonStyle,
          backgroundColor: isItalic ? '#e6e6e6' : '#fff',
        }}
        aria-label="Format Italics"
      >
        I
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
        style={{
          ...buttonStyle,
          backgroundColor: isUnderline ? '#e6e6e6' : '#fff',
        }}
        aria-label="Format Underline"
      >
        U
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        disabled={!canUndo}
        style={{
          ...buttonStyle,
          opacity: canUndo ? 1 : 0.5,
        }}
        aria-label="Undo"
      >
        Undo
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        disabled={!canRedo}
        style={{
          ...buttonStyle,
          opacity: canRedo ? 1 : 0.5,
        }}
        aria-label="Redo"
      >
        Redo
      </button>
      <select
      onChange={onHeadingChange}
      value={currentHeading}
      style={{
        ...buttonStyle,
        appearance: 'none',
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        padding: '6px 24px 6px 12px',
        backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 8px top 50%',
        backgroundSize: '12px auto',
      }}
    >
      <option value="paragraph">Normal</option>
      <option value="h1">Heading 1</option>
      <option value="h2">Heading 2</option>
      <option value="h3">Heading 3</option>
      <option value="h4">Heading 4</option>
      <option value="h5">Heading 5</option>
      <option value="h6">Heading 6</option>
    </select>
    </div>
  );
}