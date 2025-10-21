/**
 * Custom transformer for ImageNode to support Markdown conversion
 */

import type {
  TextMatchTransformer,
} from '@lexical/markdown';
import {
  $createImageNode,
  $isImageNode,
  ImageNode,
} from './ImageNode';

export const IMAGE_TRANSFORMER: TextMatchTransformer = {
  dependencies: [ImageNode],
  export: (node) => {
    if (!$isImageNode(node)) {
      return null;
    }
    
    const altText = node.getAltText();
    const src = node.getSrc();
    
    // Export as Markdown image syntax: ![alt text](image_url)
    return `![${altText}](${src})`;
  },
  importRegExp: /!\[([^\]]*)\]\(([^)]+)\)/,
  regExp: /!\[([^\]]*)\]\(([^)]+)\)$/,
  replace: (textNode, match) => {
    const [, altText, src] = match;
    const imageNode = $createImageNode({
      altText,
      src,
    });
    textNode.replace(imageNode);
  },
  trigger: ')',
  type: 'text-match',
};

