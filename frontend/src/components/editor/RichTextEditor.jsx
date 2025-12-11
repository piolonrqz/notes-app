import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontFamily } from '@tiptap/extension-font-family';
import Underline from '@tiptap/extension-underline';
import EditorToolbar from './EditorToolbar';

/**
 * Rich Text Editor Component using TipTap
 * @param {Object} props
 * @param {String} props.value - HTML content
 * @param {Function} props.onChange - Callback when content changes
 * @param {String} props.placeholder - Placeholder text
 * @param {Boolean} props.readOnly - Read-only mode
 */
const RichTextEditor = ({ value = '', onChange, placeholder = 'Start typing...', readOnly = false }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TextStyle,
      FontFamily,
      Underline,
    ],
    content: value,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (onChange) {
        onChange(html);
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[200px] px-4 py-3 text-white',
        'data-placeholder': placeholder,
      },
    },
  });

  // Update editor content when value prop changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="w-full min-h-[200px] px-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl">
        <div className="flex items-center justify-center h-full">
          <span className="text-gray-400">Loading editor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl border border-white/10 bg-gray-800/50 overflow-hidden">
      {!readOnly && <EditorToolbar editor={editor} />}
      <div className="bg-gray-800/50">
        <EditorContent 
          editor={editor} 
          className="rich-text-editor-content"
        />
      </div>
      <style>{`
        .rich-text-editor-content .ProseMirror {
          min-height: 200px;
          padding: 1rem;
          color: white;
          outline: none;
        }
        .rich-text-editor-content .ProseMirror p {
          margin: 0.5rem 0;
        }
        .rich-text-editor-content .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }
        .rich-text-editor-content .ProseMirror h1 {
          font-size: 2rem;
          font-weight: bold;
          margin: 1rem 0;
          color: white;
        }
        .rich-text-editor-content .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 0.75rem 0;
          color: white;
        }
        .rich-text-editor-content .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: bold;
          margin: 0.5rem 0;
          color: white;
        }
        .rich-text-editor-content .ProseMirror ul,
        .rich-text-editor-content .ProseMirror ol {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }
        .rich-text-editor-content .ProseMirror li {
          margin: 0.25rem 0;
        }
        .rich-text-editor-content .ProseMirror strong {
          font-weight: bold;
        }
        .rich-text-editor-content .ProseMirror em {
          font-style: italic;
        }
        .rich-text-editor-content .ProseMirror u {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;

