import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Quote } from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  isEditable?: boolean
  minHeight?: string
  placeholder?: string
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  isEditable = true,
  minHeight = '120px',
  placeholder,
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || (placeholder ? `<p class="text-slate-400">${placeholder}</p>` : ''),
    editable: isEditable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        // Tailwind Typography (prose) handles the beautiful styling automatically
        class: 'prose prose-sm prose-slate max-w-none focus:outline-hidden p-4 min-h-[120px]',
      },
    },
  })

  // Synchronize external value changes if needed
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '')
    }
  }, [value, editor])

  if (!editor) {
    return null
  }

  return (
    <div className={`border rounded-xl overflow-hidden bg-white flex flex-col transition-shadow ${isEditable ? 'border-slate-200 shadow-2xs focus-within:border-cbe-purple focus-within:ring-1 focus-within:ring-cbe-purple' : 'border-transparent'}`}>
      {isEditable && (
        <div className="flex items-center gap-1 border-b border-slate-100 bg-slate-50/80 px-2 py-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded-md transition-colors ${editor.isActive('bold') ? 'bg-slate-200 text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'}`}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded-md transition-colors ${editor.isActive('italic') ? 'bg-slate-200 text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'}`}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          
          <div className="w-px h-5 bg-slate-300 mx-1" />
          
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-1.5 rounded-md transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-slate-200 text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'}`}
            title="Heading 2"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-1.5 rounded-md transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-slate-200 text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'}`}
            title="Heading 3"
          >
            <Heading2 className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-slate-300 mx-1" />
          
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded-md transition-colors ${editor.isActive('bulletList') ? 'bg-slate-200 text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'}`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded-md transition-colors ${editor.isActive('orderedList') ? 'bg-slate-200 text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'}`}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-slate-300 mx-1" />
          
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded-md transition-colors ${editor.isActive('blockquote') ? 'bg-slate-200 text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'}`}
            title="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </button>
        </div>
      )}
      
      <div 
        className="flex-1 overflow-y-auto cursor-text" 
        style={{ minHeight: isEditable ? minHeight : 'auto' }}
        onClick={() => {
          if (isEditable && !editor.isFocused) {
            editor.commands.focus()
          }
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
