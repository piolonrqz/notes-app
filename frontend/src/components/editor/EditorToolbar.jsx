import React from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
} from 'lucide-react';

/**
 * Toolbar for Rich Text Editor
 * @param {Object} props
 * @param {Object} props.editor - TipTap editor instance
 */
const EditorToolbar = ({ editor }) => {
  if (!editor) return null;

  const ToolbarButton = ({ onClick, isActive = false, children, title }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded-lg transition-all ${
        isActive
          ? 'bg-brand-light/30 text-brand-lighter'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
      title={title}
    >
      {children}
    </button>
  );

  return (
    <div className="flex items-center gap-2 p-2 border-b border-white/15 bg-gray-900/80 flex-wrap">
      <span className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-white/70 bg-white/5 rounded-md">
        Format
      </span>

      {/* Text Formatting */}
      <div className="flex items-center gap-1 border-r border-white/10 pr-3 mr-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Headings */}
      <div className="flex items-center gap-1 border-r border-white/10 pr-3 mr-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Lists */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
      </div>
    </div>
  );
};

export default EditorToolbar;

