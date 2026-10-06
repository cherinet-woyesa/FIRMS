import React, { useRef, useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Maximize2,
  Minimize2,
  X,
  ExternalLink,
  Clock,
  AlertTriangle,
  Table as TableIcon,
  ChevronDown,
} from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  minHeight?: string
  title?: string
  lastModifiedBy?: string
  lastModifiedAt?: string
  onModifiedMeta?: (meta: { author: string; timestamp: string }) => void
  readOnly?: boolean
}

// Security Configuration for Embedded Images
const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024 // 2 MB strict size cap

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = 'Start typing...',
  minHeight = '150px',
  title = 'Document Editor',
  lastModifiedBy,
  lastModifiedAt,
  onModifiedMeta,
  readOnly = false,
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)

  // Link Modal State
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [openInNewTab, setOpenInNewTab] = useState(true)

  // Logged-in User Info for Last Modified tracking
  const { user } = useSelector((state: RootState) => state.auth)
  const currentAuthorName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.userName || 'User'
    : 'You'
  const currentAuthorRole = user && user.roles && user.roles.length > 0 ? user.roles[0] : 'Reviewer'
  const currentAuthorLabel = `${currentAuthorName} (${currentAuthorRole})`

  const [lastModifiedInfo, setLastModifiedInfo] = useState<{ author: string; time: string } | null>(
    lastModifiedBy ? { author: lastModifiedBy, time: lastModifiedAt || 'Earlier' } : null
  )

  // Secure Image Upload Handler (Strict raster whitelist & 2MB size cap)
  const handleSecureImageFile = (file: File) => {
    setImageError(null)

    // 1. Strict MIME validation: Prevent SVG, HTML, Executables
    if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) {
      setImageError('Security policy: Only PNG, JPEG, and WebP images are permitted (SVG is disabled).')
      setTimeout(() => setImageError(null), 5000)
      return
    }

    // 2. Strict size cap: Prevent database bloat and memory DoS
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setImageError(`File exceeds maximum size limit (2 MB). File size: ${(file.size / (1024 * 1024)).toFixed(2)} MB.`)
      setTimeout(() => setImageError(null), 5000)
      return
    }

    // 3. Read as safe base64 and insert into TipTap editor
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string' && editor) {
        editor.chain().focus().setImage({ src: reader.result }).run()
      }
    }
    reader.readAsDataURL(file)
  }

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleSecureImageFile(file)
    }
    e.target.value = ''
  }

  // Table Menu State
  const [isTableMenuOpen, setIsTableMenuOpen] = useState(false)
  const [customRows, setCustomRows] = useState(3)
  const [customCols, setCustomCols] = useState(3)
  const tableMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tableMenuRef.current && !tableMenuRef.current.contains(e.target as Node)) {
        setIsTableMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInsertTable = (rows: number, cols: number) => {
    if (!editor) return
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run()
    setIsTableMenuOpen(false)
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-cbe-purple underline hover:text-purple-800 transition-colors cursor-pointer font-medium',
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg border border-slate-200 my-2 shadow-2xs',
          loading: 'lazy',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'cbe-tiptap-table',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content || '',
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html)
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      setLastModifiedInfo({ author: currentAuthorLabel, time: now })
      if (onModifiedMeta) {
        onModifiedMeta({ author: currentAuthorLabel, timestamp: new Date().toISOString() })
      }
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose-base focus:outline-hidden max-w-full p-4 text-slate-800 leading-relaxed`,
        style: `min-height: ${isFullscreen ? '100%' : minHeight};`,
      },
      handlePaste: (_view, event) => {
        const items = event.clipboardData?.items
        if (!items) return false
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile()
            if (file) {
              event.preventDefault()
              handleSecureImageFile(file)
              return true
            }
          }
        }
        return false
      },
      handleDrop: (_view, event) => {
        const files = event.dataTransfer?.files
        if (files && files.length > 0 && files[0].type.startsWith('image/')) {
          event.preventDefault()
          handleSecureImageFile(files[0])
          return true
        }
        return false
      },
    },
  })

  // Synchronize externally changed content
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '')
    }
  }, [content, editor])

  // Escape key exits fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen])

  // Open Link Modal with prefilled values
  const handleOpenLinkModal = () => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href || ''
    const previousTarget = editor.getAttributes('link').target === '_blank'

    // Get selected text if any
    const { from, to } = editor.state.selection
    const selectedText = editor.state.doc.textBetween(from, to, ' ')

    setLinkUrl(previousUrl)
    setLinkText(selectedText)
    setOpenInNewTab(previousTarget || true)
    setIsLinkModalOpen(true)
  }

  // Apply Link from Modal
  const handleApplyLink = () => {
    if (!editor) return
    let finalUrl = linkUrl.trim()
    if (!finalUrl) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      setIsLinkModalOpen(false)
      return
    }

    // Auto-prepend https:// if no protocol entered
    if (!/^https?:\/\//i.test(finalUrl) && !finalUrl.startsWith('mailto:') && !finalUrl.startsWith('tel:')) {
      finalUrl = `https://${finalUrl}`
    }

    const { empty } = editor.state.selection
    if (empty && linkText.trim()) {
      // If no text was selected, insert custom text linked
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'text',
          text: linkText.trim(),
          marks: [
            {
              type: 'link',
              attrs: {
                href: finalUrl,
                target: openInNewTab ? '_blank' : null,
                rel: openInNewTab ? 'noopener noreferrer' : null,
              },
            },
          ],
        })
        .run()
    } else {
      // Apply link mark to existing selection
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({
          href: finalUrl,
          target: openInNewTab ? '_blank' : null,
        })
        .run()
    }

    setIsLinkModalOpen(false)
  }

  const handleRemoveLink = () => {
    if (!editor) return
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
    setIsLinkModalOpen(false)
  }

  if (!editor) {
    return null
  }

  // Word & Character counts
  const rawText = editor.getText()
  const wordCount = rawText.trim() ? rawText.trim().split(/\s+/).length : 0
  const charCount = rawText.length

  const editorContainer = (
    <div
      className={`bg-white transition-all ${
        isFullscreen
          ? 'w-full h-full flex flex-col overflow-hidden'
          : 'border border-slate-300 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-cbe-purple focus-within:border-cbe-purple shadow-2xs'
      }`}
    >
      {/* Hidden File Input for Secure Image Upload */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleImageInputChange}
        className="hidden"
      />

      {/* Security Alert Banner */}
      {imageError && (
        <div className="bg-rose-50 border-b border-rose-200 px-3.5 py-2 text-xs text-rose-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{imageError}</span>
          </div>
          <button
            type="button"
            onClick={() => setImageError(null)}
            className="text-rose-500 hover:text-rose-700 p-0.5 rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Fullscreen Header Bar */}
      {isFullscreen && (
        <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-sm font-bold tracking-tight">{title}</h3>
            <span className="text-xs text-slate-400">Distraction-Free Fullscreen Editor</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-400 hidden sm:block">
              {wordCount} words • {charCount} characters
            </div>
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
              title="Exit Fullscreen (Esc)"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Exit Fullscreen</span>
            </button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      {!readOnly && (
        <div className="bg-slate-50/90 border-b border-slate-200 flex items-center justify-between p-1.5 gap-1 overflow-x-auto">
          <div className="flex items-center gap-0.5">
            {/* Bold */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1.5 rounded-md hover:bg-slate-200 transition cursor-pointer ${
                editor.isActive('bold') ? 'bg-slate-200 text-slate-900 font-bold' : 'text-slate-600'
              }`}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>

            {/* Italic */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1.5 rounded-md hover:bg-slate-200 transition cursor-pointer ${
                editor.isActive('italic') ? 'bg-slate-200 text-slate-900' : 'text-slate-600'
              }`}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>

            {/* Underline */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-1.5 rounded-md hover:bg-slate-200 transition cursor-pointer ${
                editor.isActive('underline') ? 'bg-slate-200 text-slate-900' : 'text-slate-600'
              }`}
              title="Underline"
            >
              <UnderlineIcon className="w-4 h-4" />
            </button>

            <div className="w-[1px] h-4 bg-slate-200 mx-1" />

            {/* Link Modal Button */}
            <button
              type="button"
              onClick={handleOpenLinkModal}
              className={`p-1.5 rounded-md hover:bg-slate-200 transition cursor-pointer ${
                editor.isActive('link') ? 'bg-purple-100 text-cbe-purple font-semibold' : 'text-slate-600'
              }`}
              title="Insert or Edit Link"
            >
              <LinkIcon className="w-4 h-4" />
            </button>

            {editor.isActive('link') && (
              <button
                type="button"
                onClick={handleRemoveLink}
                className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600 transition cursor-pointer"
                title="Remove Link"
              >
                <Unlink className="w-4 h-4" />
              </button>
            )}

            {/* Secure Image Upload Button */}
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="p-1.5 rounded-md hover:bg-slate-200 text-slate-600 transition cursor-pointer"
              title="Insert Image (JPG, PNG, WebP — Max 2MB)"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            <div className="w-[1px] h-4 bg-slate-200 mx-1" />

            {/* Bullet List */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-1.5 rounded-md hover:bg-slate-200 transition cursor-pointer ${
                editor.isActive('bulletList') ? 'bg-slate-200 text-slate-900' : 'text-slate-600'
              }`}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>

            {/* Numbered List */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-1.5 rounded-md hover:bg-slate-200 transition cursor-pointer ${
                editor.isActive('orderedList') ? 'bg-slate-200 text-slate-900' : 'text-slate-600'
              }`}
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            {/* Blockquote */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-1.5 rounded-md hover:bg-slate-200 transition cursor-pointer ${
                editor.isActive('blockquote') ? 'bg-slate-200 text-slate-900' : 'text-slate-600'
              }`}
              title="Blockquote"
            >
              <Quote className="w-4 h-4" />
            </button>

            <div className="w-[1px] h-4 bg-slate-200 mx-1" />

            {/* Table Dropdown */}
            <div className="relative" ref={tableMenuRef}>
              <button
                type="button"
                onClick={() => setIsTableMenuOpen(!isTableMenuOpen)}
                className={`p-1.5 rounded-md hover:bg-slate-200 transition cursor-pointer flex items-center gap-0.5 ${
                  editor.isActive('table') ? 'bg-purple-100 text-cbe-purple font-semibold' : 'text-slate-600'
                }`}
                title="Table options (Insert, Rows, Columns)"
              >
                <TableIcon className="w-4 h-4" />
                <ChevronDown className="w-2.5 h-2.5 opacity-60" />
              </button>

              {isTableMenuOpen && (
                <div className="absolute left-0 top-full mt-1.5 z-40 bg-white border border-slate-200 rounded-xl shadow-xl p-2 w-64 text-xs animate-in fade-in zoom-in-95 duration-150">
                  {!editor.isActive('table') ? (
                    <div className="space-y-2">
                      <div className="font-bold text-slate-800 text-[11px] px-1.5 pt-0.5 pb-1 border-b border-slate-100">
                        Insert Table
                      </div>
                      <div className="space-y-1">
                        <button
                          type="button"
                          onClick={() => handleInsertTable(3, 3)}
                          className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-purple-50 hover:text-cbe-purple flex items-center justify-between text-slate-700 transition cursor-pointer"
                        >
                          <span>Standard 3 × 3 (with header)</span>
                          <span className="text-[10px] text-slate-400">Default</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertTable(2, 2)}
                          className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-purple-50 hover:text-cbe-purple text-slate-700 transition cursor-pointer"
                        >
                          Compact 2 × 2
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertTable(4, 4)}
                          className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-purple-50 hover:text-cbe-purple text-slate-700 transition cursor-pointer"
                        >
                          Extended 4 × 4
                        </button>
                      </div>

                      <div className="pt-2 border-t border-slate-100 px-1">
                        <span className="block text-[10px] font-semibold text-slate-500 mb-1.5">Custom Dimensions</span>
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-1 text-[11px] text-slate-600">
                            Rows:
                            <input
                              type="number"
                              min={1}
                              max={20}
                              value={customRows}
                              onChange={(e) => setCustomRows(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-11 px-1 py-0.5 border border-slate-200 rounded text-center text-xs"
                            />
                          </label>
                          <label className="flex items-center gap-1 text-[11px] text-slate-600">
                            Cols:
                            <input
                              type="number"
                              min={1}
                              max={10}
                              value={customCols}
                              onChange={(e) => setCustomCols(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-11 px-1 py-0.5 border border-slate-200 rounded text-center text-xs"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => handleInsertTable(customRows, customCols)}
                            className="ml-auto px-2 py-1 bg-cbe-purple text-white rounded text-[11px] font-semibold hover:bg-purple-800 transition cursor-pointer"
                          >
                            Insert
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="font-bold text-slate-800 text-[11px] px-1.5 pt-0.5 pb-1 border-b border-slate-100 flex items-center justify-between">
                        <span>Table Operations</span>
                        <span className="text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded font-medium">Inside Table</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => { editor.chain().focus().addRowBefore().run(); setIsTableMenuOpen(false); }}
                        className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 cursor-pointer"
                      >
                        + Add Row Above
                      </button>
                      <button
                        type="button"
                        onClick={() => { editor.chain().focus().addRowAfter().run(); setIsTableMenuOpen(false); }}
                        className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 cursor-pointer"
                      >
                        + Add Row Below
                      </button>
                      <button
                        type="button"
                        onClick={() => { editor.chain().focus().deleteRow().run(); setIsTableMenuOpen(false); }}
                        className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-rose-50 text-rose-600 cursor-pointer"
                      >
                        − Delete Row
                      </button>
                      <div className="my-1 border-t border-slate-100" />
                      <button
                        type="button"
                        onClick={() => { editor.chain().focus().addColumnBefore().run(); setIsTableMenuOpen(false); }}
                        className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 cursor-pointer"
                      >
                        + Add Column Before
                      </button>
                      <button
                        type="button"
                        onClick={() => { editor.chain().focus().addColumnAfter().run(); setIsTableMenuOpen(false); }}
                        className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 cursor-pointer"
                      >
                        + Add Column After
                      </button>
                      <button
                        type="button"
                        onClick={() => { editor.chain().focus().deleteColumn().run(); setIsTableMenuOpen(false); }}
                        className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-rose-50 text-rose-600 cursor-pointer"
                      >
                        − Delete Column
                      </button>
                      <div className="my-1 border-t border-slate-100" />
                      <button
                        type="button"
                        onClick={() => { editor.chain().focus().toggleHeaderRow().run(); setIsTableMenuOpen(false); }}
                        className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 cursor-pointer"
                      >
                        Toggle Header Row
                      </button>
                      <button
                        type="button"
                        onClick={() => { editor.chain().focus().deleteTable().run(); setIsTableMenuOpen(false); }}
                        className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-rose-100 text-rose-700 font-semibold cursor-pointer"
                      >
                        🗑 Delete Whole Table
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Fullscreen Toggle Button */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-md hover:bg-slate-200 text-slate-600 transition cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Full Page Writing Mode'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Contextual Table Controls Quick Bar */}
      {!readOnly && editor && editor.isActive('table') && (
        <div className="bg-[#FAF5FB] border-b border-purple-200/60 px-3 py-1.5 flex items-center justify-between text-xs overflow-x-auto gap-2">
          <div className="flex items-center gap-1.5 shrink-0 text-cbe-purple font-semibold text-[11px]">
            <TableIcon className="w-3.5 h-3.5" />
            <span>Table Controls:</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] shrink-0">
            <button
              type="button"
              onClick={() => editor.chain().focus().addRowBefore().run()}
              className="px-2 py-0.5 rounded bg-white border border-slate-200 hover:bg-purple-50 text-slate-700 hover:text-cbe-purple transition cursor-pointer text-[11px]"
            >
              + Row Above
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className="px-2 py-0.5 rounded bg-white border border-slate-200 hover:bg-purple-50 text-slate-700 hover:text-cbe-purple transition cursor-pointer text-[11px]"
            >
              + Row Below
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteRow().run()}
              className="px-2 py-0.5 rounded bg-white border border-slate-200 hover:bg-rose-50 text-rose-600 transition cursor-pointer text-[11px]"
            >
              − Row
            </button>
            <div className="w-[1px] h-3.5 bg-purple-200 mx-0.5" />
            <button
              type="button"
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              className="px-2 py-0.5 rounded bg-white border border-slate-200 hover:bg-purple-50 text-slate-700 hover:text-cbe-purple transition cursor-pointer text-[11px]"
            >
              + Col Left
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              className="px-2 py-0.5 rounded bg-white border border-slate-200 hover:bg-purple-50 text-slate-700 hover:text-cbe-purple transition cursor-pointer text-[11px]"
            >
              + Col Right
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteColumn().run()}
              className="px-2 py-0.5 rounded bg-white border border-slate-200 hover:bg-rose-50 text-rose-600 transition cursor-pointer text-[11px]"
            >
              − Col
            </button>
            <div className="w-[1px] h-3.5 bg-purple-200 mx-0.5" />
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeaderRow().run()}
              className="px-2 py-0.5 rounded bg-white border border-slate-200 hover:bg-purple-50 text-slate-700 hover:text-cbe-purple transition cursor-pointer text-[11px]"
            >
              Header
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteTable().run()}
              className="px-2 py-0.5 rounded bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 font-semibold transition cursor-pointer text-[11px]"
              title="Delete Table"
            >
              Delete Table
            </button>
          </div>
        </div>
      )}

      {/* Editor Content Area */}
      <div className={`bg-white ${isFullscreen ? 'flex-1 overflow-y-auto px-6 py-6 sm:px-16' : ''}`}>
        <div className={isFullscreen ? 'max-w-4xl mx-auto' : ''}>
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Audit & Modification Footer */}
      <div className="bg-slate-50 border-t border-slate-200 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-slate-500 select-none">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-cbe-purple shrink-0" />
          <span>Last modified by:</span>
          <span className="font-semibold text-slate-800">
            {lastModifiedInfo ? lastModifiedInfo.author : currentAuthorLabel}
          </span>
          <span className="text-slate-300">•</span>
          <span>{lastModifiedInfo ? lastModifiedInfo.time : 'Just now'}</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{charCount} chars</span>
        </div>
      </div>

      {/* Custom Link Insertion Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-60 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-cbe-purple" />
                <h4 className="text-sm font-bold text-slate-900">
                  {editor.isActive('link') ? 'Edit Hyperlink' : 'Insert Hyperlink'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Destination URL
                </label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com or internal link"
                  autoFocus
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-cbe-purple focus:ring-1 focus:ring-cbe-purple bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Display Text <span className="text-[10px] text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Link label to show in text..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-cbe-purple focus:ring-1 focus:ring-cbe-purple bg-white"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={openInNewTab}
                  onChange={(e) => setOpenInNewTab(e.target.checked)}
                  className="rounded border-slate-300 text-cbe-purple focus:ring-cbe-purple"
                />
                <span className="flex items-center gap-1">
                  Open link in new window / tab
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              {editor.isActive('link') ? (
                <button
                  type="button"
                  onClick={handleRemoveLink}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition cursor-pointer"
                >
                  Remove Link
                </button>
              ) : (
                <span />
              )}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyLink}
                  className="px-4 py-1.5 rounded-lg bg-cbe-purple hover:bg-cbe-purple-700 text-white text-xs font-semibold shadow-2xs cursor-pointer"
                >
                  Apply Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .is-editor-empty:first-child::before {
          color: #94a3b8;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .cbe-tiptap-table {
          border-collapse: collapse;
          margin: 0.75rem 0;
          table-layout: fixed;
          width: 100%;
          overflow: hidden;
          border-radius: 6px;
          border: 1px solid #cbd5e1;
        }
        .cbe-tiptap-table td,
        .cbe-tiptap-table th {
          min-width: 60px;
          border: 1px solid #cbd5e1;
          padding: 6px 10px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
          font-size: 0.8125rem;
        }
        .cbe-tiptap-table th {
          font-weight: 600;
          text-align: left;
          background-color: #f8fafc;
          color: #1e293b;
          border-bottom: 2px solid #cbd5e1;
        }
        .cbe-tiptap-table .selectedCell:after {
          z-index: 2;
          position: absolute;
          content: "";
          left: 0; right: 0; top: 0; bottom: 0;
          background: rgba(149, 41, 142, 0.12);
          pointer-events: none;
        }
        .cbe-tiptap-table .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: -2px;
          width: 4px;
          background-color: #95298e;
          pointer-events: none;
        }
        .tableWrapper {
          overflow-x: auto;
          margin: 0.75rem 0;
        }
        .resize-cursor {
          cursor: col-resize;
        }
      `}</style>
    </div>
  )

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
        <div className="bg-white w-full max-w-5xl h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
          {editorContainer}
        </div>
      </div>
    )
  }

  return editorContainer
}
