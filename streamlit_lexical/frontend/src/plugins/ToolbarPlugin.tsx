import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {mergeRegister} from '@lexical/utils';
import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import {useCallback, useEffect, useRef, useState} from 'react';

import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND, $isListNode } from '@lexical/list';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $isCodeNode, $createCodeNode } from '@lexical/code';
import { INSERT_IMAGE_COMMAND } from './ImagesPlugin';
import InsertImageDialog from './InsertImageDialog';
import Select from '../ui/Select';

const LowPriority = 1;

function Divider() {
  return <div className="divider" />;
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [currentHeading, setCurrentHeading] = useState('paragraph');
  const [blockType, setBlockType] = useState('paragraph');
  const [showImageDialog, setShowImageDialog] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsCode(selection.hasFormat('code'));
  
      // Update link status
      const node = selection.anchor.getNode();
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
  
      // Update heading and block type
      const anchorNode = selection.anchor.getNode();
      const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElement();
      if (element !== null) {
        // Check if it's a code node first using Lexical's type check
        if ($isCodeNode(element)) {
          setBlockType('code');
        } else {
          const elementKey = element.getKey();
          const elementDOM = editor.getElementByKey(elementKey);
          if (elementDOM !== null) {
            if (elementDOM.tagName === 'P') {
              setCurrentHeading('paragraph');
              setBlockType('paragraph');
            } else if (elementDOM.tagName.match(/^H[1-6]$/)) {
              setCurrentHeading(elementDOM.tagName.toLowerCase());
              setBlockType('heading');
            } else if (elementDOM.tagName === 'BLOCKQUOTE') {
              setBlockType('quote');
            } else if (elementDOM.tagName === 'UL') {
              setBlockType('bullet');
            } else if (elementDOM.tagName === 'OL') {
              setBlockType('number');
            }
          }
        }
      }
    }
  }, [editor]);

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

  const formatBulletList = () => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
  };

  const formatCodeBlock = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (blockType === 'code') {
          $setBlocksType(selection, () => $createParagraphNode());
        } else {
          $setBlocksType(selection, () => $createCodeNode());
        }
      }
    });
  };

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  const insertImage = () => {
    setShowImageDialog(true);
  };

  const handleImageInsert = (payload: any) => {
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
    setShowImageDialog(false);
  };

  const getCodeLanguage = () => {
    let codeLanguage = 'javascript';
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElement();
        if ($isCodeNode(element)) {
          codeLanguage = element.getLanguage() || 'javascript';
        }
      }
    });
    return codeLanguage;
  };

  const onCodeLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElement();
        if ($isCodeNode(element)) {
          element.setLanguage(e.target.value);
        }
      }
    });
  };

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({editorState}: {editorState: any}) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload: any, _newEditor: any) => {
          $updateToolbar();
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload: boolean) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload: boolean) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority,
      ),
    );
  }, [editor, $updateToolbar]);

  return (
    <div className="toolbar" ref={toolbarRef}>
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className="toolbar-item spaced"
        aria-label="Undo">
        <i className="format undo" />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="toolbar-item"
        aria-label="Redo">
        <i className="format redo" />
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        className={'toolbar-item spaced ' + (isBold ? 'active' : '')}
        aria-label="Format Bold">
        <i className="format bold" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        className={'toolbar-item spaced ' + (isItalic ? 'active' : '')}
        aria-label="Format Italics">
        <i className="format italic" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
        className={'toolbar-item spaced ' + (isUnderline ? 'active' : '')}
        aria-label="Format Underline">
        <i className="format underline" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
        }}
        className={'toolbar-item spaced ' + (isStrikethrough ? 'active' : '')}
        aria-label="Format Strikethrough">
        <i className="format strikethrough" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
        }}
        className={'toolbar-item spaced ' + (isCode ? 'active' : '')}
        aria-label="Format Code">
        <i className="format code" />
      </button>
      <button
        onClick={insertLink}
        className={'toolbar-item spaced ' + (isLink ? 'active' : '')}
        aria-label="Insert Link">
        <i className="format link" />
      </button>
      <button
        onClick={insertImage}
        className="toolbar-item spaced"
        aria-label="Insert Image">
        <i className="format image" />
      </button>
      <Divider />
      <select
        className="toolbar-item block-controls"
        value={currentHeading}
        onChange={onHeadingChange}
      >
        <option value="paragraph">Normal</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
      </select>
      <Divider />
      <button
        onClick={formatBulletList}
        className={'toolbar-item spaced ' + (blockType === 'bullet' ? 'active' : '')}
        aria-label="Bullet List">
        <i className="format bullet-list" />
      </button>
      <button
        onClick={formatNumberedList}
        className={'toolbar-item spaced ' + (blockType === 'number' ? 'active' : '')}
        aria-label="Numbered List">
        <i className="format numbered-list" />
      </button>
      <button
        onClick={formatQuote}
        className={'toolbar-item spaced ' + (blockType === 'quote' ? 'active' : '')}
        aria-label="Quote">
        <i className="format quote" />
      </button>
      <button
        onClick={formatCodeBlock}
        className={'toolbar-item spaced ' + (blockType === 'code' ? 'active' : '')}
        aria-label="Code Block">
        <i className="format code-block" />
      </button>
      {blockType === 'code' && (
        <Select
          className="toolbar-item code-language"
          onChange={onCodeLanguageChange}
          value={getCodeLanguage()}
          label="Language"
        >
          <option value="">Select Language</option>
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="csharp">C#</option>
          <option value="php">PHP</option>
          <option value="ruby">Ruby</option>
          <option value="go">Go</option>
          <option value="rust">Rust</option>
          <option value="swift">Swift</option>
          <option value="kotlin">Kotlin</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="sql">SQL</option>
          <option value="bash">Bash</option>
          <option value="json">JSON</option>
          <option value="xml">XML</option>
          <option value="yaml">YAML</option>
        </Select>
      )}
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
        }}
        className="toolbar-item spaced"
        aria-label="Align Left">
        <i className="format left-align" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
        }}
        className="toolbar-item spaced"
        aria-label="Align Center">
        <i className="format center-align" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
        }}
        className="toolbar-item spaced"
        aria-label="Align Right">
        <i className="format right-align" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
        }}
        className="toolbar-item spaced"
        aria-label="Align Justify">
        <i className="format justify-align" />
      </button>
      {showImageDialog && (
        <InsertImageDialog
          onInsert={handleImageInsert}
          onClose={() => setShowImageDialog(false)}
        />
      )}
    </div>
  );
}
