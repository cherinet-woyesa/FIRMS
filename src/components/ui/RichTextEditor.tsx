import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Bold, Italic, List, ListOrdered, Quote } from 'lucide-react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  minHeight?: string
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  content, 
  onChange, 
  placeholder = 'Start typing...',
  minHeight = '150px' 
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose-base focus:outline-none max-w-full p-3`,
        style: `min-height: ${minHeight};`,
      },
    },
  })

  // We must track the content prop externally in case it is updated (e.g. state reset or loaded from server)
  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '')
    }
  }, [content, editor])

  if (!editor) {
    return null
  }

  return (
    <div className="border border-slate-300 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-cbe-purple focus-within:border-transparent transition-all shadow-sm">
      {/* Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 flex items-center p-1.5 gap-1 overflow-x-auto">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-slate-200 transition ${editor.isActive('bold') ? 'bg-slate-200 text-slate-900 shadow-sm' : 'text-slate-600'}`}
          type="button"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-slate-200 transition ${editor.isActive('italic') ? 'bg-slate-200 text-slate-900 shadow-sm' : 'text-slate-600'}`}
          type="button"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-4 bg-slate-300 mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded hover:bg-slate-200 transition ${editor.isActive('bulletList') ? 'bg-slate-200 text-slate-900 shadow-sm' : 'text-slate-600'}`}
          type="button"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded hover:bg-slate-200 transition ${editor.isActive('orderedList') ? 'bg-slate-200 text-slate-900 shadow-sm' : 'text-slate-600'}`}
          type="button"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-4 bg-slate-300 mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded hover:bg-slate-200 transition ${editor.isActive('blockquote') ? 'bg-slate-200 text-slate-900 shadow-sm' : 'text-slate-600'}`}
          type="button"
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>
      </div>
      
      {/* Editor Content */}
      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>
      <style>{`
        .is-editor-empty:first-child::before {
          color: #94a3b8;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}
