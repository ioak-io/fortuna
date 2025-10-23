"use client"

import * as React from "react"
import { useEditor, EditorContent, Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Placeholder } from "@tiptap/extension-placeholder"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import Highlight from "@tiptap/extension-highlight"
import Color from "@tiptap/extension-color"
import { Table } from "@tiptap/extension-table"
import { TableRow } from "@tiptap/extension-table-row"
import { TableCell } from "@tiptap/extension-table-cell"
import { TableHeader } from "@tiptap/extension-table-header"

import { cn } from "@/components/ui-library/utils"
import { Button } from "@/components/ui-library/ui/button"
import { Separator } from "@/components/ui-library/ui/separator"
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Image as ImageIcon,
  Link as LinkIcon,
  Table as TableIcon,
  Highlighter,
  Palette,
  Undo,
  Redo,
} from "lucide-react"

export type ToolbarOptionType =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'code'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'bulletList'
  | 'orderedList'
  | 'blockquote'
  | 'alignLeft'
  | 'alignCenter'
  | 'alignRight'
  | 'alignJustify'
  | 'image'
  | 'link'
  | 'table'
  | 'highlight'
  | 'color'
  | 'undo'
  | 'redo'
  | 'separator'
  | 'custom'

export interface CustomToolbarElement {
  type: 'custom'
  element: React.ReactElement
}

export interface StandardToolbarOption {
  type: Exclude<ToolbarOptionType, 'custom'>
}

export type ToolbarOption = StandardToolbarOption | CustomToolbarElement

export interface TextEditorProps {
  value?: string | any;
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  toolbarClassName?: string
  disabled?: boolean
  editable?: boolean
  toolbar?: ToolbarOption[]
  showToolbar?: boolean
  autoFocus?: boolean
  toolbarPosition?: 'top' | 'bottom'
}

const defaultToolbar: ToolbarOption[] = [
  { type: 'undo' },
  { type: 'redo' },
  { type: 'separator' },
  { type: 'bold' },
  { type: 'italic' },
  { type: 'underline' },
  { type: 'strikethrough' },
  { type: 'separator' },
  { type: 'h1' },
  { type: 'h2' },
  { type: 'h3' },
  { type: 'separator' },
  { type: 'bulletList' },
  { type: 'orderedList' },
  { type: 'blockquote' },
  { type: 'separator' },
  { type: 'alignLeft' },
  { type: 'alignCenter' },
  { type: 'alignRight' },
  { type: 'separator' },
  { type: 'link' },
  { type: 'image' },
]

interface ToolbarProps {
  editor: Editor
  options: ToolbarOption[]
  position?: 'top' | 'bottom'
  className?: string
}

const Toolbar: React.FC<ToolbarProps> = ({ editor, options, className, position = 'top' }) => {
  const [, setForceUpdate] = React.useState({})

  React.useEffect(() => {
    const updateHandler = () => setForceUpdate({})
    editor.on('selectionUpdate', updateHandler)
    editor.on('transaction', updateHandler)

    return () => {
      editor.off('selectionUpdate', updateHandler)
      editor.off('transaction', updateHandler)
    }
  }, [editor])

  const addImage = () => {
    const url = window.prompt('Enter image URL:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const addLink = () => {
    const url = window.prompt('Enter URL:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  const setColor = () => {
    const color = window.prompt('Enter color (hex):')
    if (color) {
      editor.chain().focus().setColor(color).run()
    }
  }

  const renderOption = (option: ToolbarOption, index: number) => {
    if (option.type === 'custom') {
      return React.cloneElement(option.element, { key: index })
    }

    if (option.type === 'separator') {
      return <Separator key={index} orientation="vertical" className="h-6" />
    }

    const buttonProps = {
      variant: "ghost" as const,
      size: "sm" as const,
      className: "h-8 w-8 p-0",
    }

    switch (option.type) {
      case 'bold':
        return (
          <Button
            key={index}
            {...buttonProps}
            onClick={() => editor.chain().focus().toggleBold().run()}
            data-active={editor.isActive('bold')}
            className={cn(buttonProps.className, editor.isActive('bold') && "bg-accent")}
          >
            <Bold className="h-4 w-4" />
          </Button>
        )
      case 'italic':
        return (
          <Button
            key={index}
            {...buttonProps}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(buttonProps.className, editor.isActive('italic') && "bg-accent")}
          >
            <Italic className="h-4 w-4" />
          </Button>
        )
      case 'underline':
        return (
          <Button
            key={index}
            {...buttonProps}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={cn(buttonProps.className, editor.isActive('underline') && "bg-accent")}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
        )
      case 'strikethrough':
        return (
          <Button
            key={index}
            {...buttonProps}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={cn(buttonProps.className, editor.isActive('strike') && "bg-accent")}
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
        )
      case 'code':
        return (
          <Button
            key={index}
            {...buttonProps}
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={cn(buttonProps.className, editor.isActive('code') && "bg-accent")}
          >
            <Code className="h-4 w-4" />
          </Button>
        )
      case 'h1':
        return (
          <Button
            key={index}
            {...buttonProps}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={cn(buttonProps.className, editor.isActive('heading', { level: 1 }) && "bg-accent")}
          >
            <Heading1 className="h-4 w-4" />
          </Button>
        )
      case 'h2':
        return (
          <Button
            key={index}
            {...buttonProps}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={cn(buttonProps.className, editor.isActive('heading', { level: 2 }) && "bg-accent")}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
        )
      case 'h3':
        return (
          <Button
            key={index}
            {...buttonProps}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={cn(buttonProps.className, editor.isActive('heading', { level: 3 }) && "bg-accent")}
          >
            <Heading3 className="h-4 w-4" />
          </Button>
        )
      case 'bulletList':
        return (
          <Button
            key={index}
            {...buttonProps}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn(buttonProps.className, editor.isActive('bulletList') && "bg-accent")}
          >
            <List className="h-4 w-4" />
          </Button>
        )
      case 'orderedList':
        return (
          <Button
            key={index}
            {...buttonProps}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn(buttonProps.className, editor.isActive('orderedList') && "bg-accent")}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        )
      case 'blockquote':
        return (
          <Button
            key={index}
            {...buttonProps}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={cn(buttonProps.className, editor.isActive('blockquote') && "bg-accent")}
          >
            <Quote className="h-4 w-4" />
          </Button>
        )
      case 'alignLeft':
        return (
          <Button
            key={index}
            {...buttonProps}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={cn(buttonProps.className, editor.isActive({ textAlign: 'left' }) && "bg-accent")}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
        )
      case 'alignCenter':
        return (
          <Button
            key={index}
            {...buttonProps}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={cn(buttonProps.className, editor.isActive({ textAlign: 'center' }) && "bg-accent")}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
        )
      case 'alignRight':
        return (
          <Button
            key={index}
            {...buttonProps}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={cn(buttonProps.className, editor.isActive({ textAlign: 'right' }) && "bg-accent")}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        )
      case 'alignJustify':
        return (
          <Button
            key={index}
            {...buttonProps}
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={cn(buttonProps.className, editor.isActive({ textAlign: 'justify' }) && "bg-accent")}
          >
            <AlignJustify className="h-4 w-4" />
          </Button>
        )
      case 'image':
        return (
          <Button key={index} {...buttonProps} onClick={addImage}>
            <ImageIcon className="h-4 w-4" />
          </Button>
        )
      case 'link':
        return (
          <Button
            key={index}
            {...buttonProps}
            onClick={addLink}
            className={cn(buttonProps.className, editor.isActive('link') && "bg-accent")}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        )
      case 'table':
        return (
          <Button key={index} {...buttonProps} onClick={addTable}>
            <TableIcon className="h-4 w-4" />
          </Button>
        )
      case 'highlight':
        return (
          <Button
            key={index}
            {...buttonProps}
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={cn(buttonProps.className, editor.isActive('highlight') && "bg-accent")}
          >
            <Highlighter className="h-4 w-4" />
          </Button>
        )
      case 'color':
        return (
          <Button key={index} {...buttonProps} onClick={setColor}>
            <Palette className="h-4 w-4" />
          </Button>
        )
      case 'undo':
        return (
          <Button
            key={index}
            {...buttonProps}
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className="h-4 w-4" />
          </Button>
        )
      case 'redo':
        return (
          <Button
            key={index}
            {...buttonProps}
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className="h-4 w-4" />
          </Button>
        )
      default:
        return null
    }
  }

  return (
    <div
      className={cn(
        "p-2 bg-muted/30",
        position === 'top' ? "border-b" : "border-t",
        className
      )}>
      <div className="flex items-center gap-1 flex-wrap">
        {options.map((option, index) => renderOption(option, index))}
      </div>
    </div>
  )
}

const TextEditor = React.forwardRef<HTMLDivElement, TextEditorProps>(
  ({
    className,
    toolbarClassName,
    value = "",
    onChange,
    placeholder,
    disabled = false,
    editable = true,
    toolbar = defaultToolbar,
    showToolbar = true,
    autoFocus = false,
    toolbarPosition = 'top',
    ...props
  }, ref) => {
    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3],
          },
        }),
        Placeholder.configure({
          placeholder: placeholder || "Start typing...",
          emptyNodeClass: 'is-editor-empty',
        }),
        Image.configure({
          inline: false,
          allowBase64: true,
        }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: 'text-primary underline',
          },
        }),
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        Underline,
        Highlight.configure({
          multicolor: true,
        }),
        Color,
        Table.configure({
          resizable: true,
        }),
        TableRow,
        TableHeader,
        TableCell,
      ],
      content: value,
      editable: editable && !disabled,
      immediatelyRender: false,
      autofocus: autoFocus,
      onUpdate: ({ editor }) => {
        const html = editor.getHTML()
        onChange?.(html)
      },
      editorProps: {
        attributes: {
          class: cn(
            "prose prose-sm max-w-none focus:outline-none",
            "min-h-[120px] p-3",
            "text-foreground",
            disabled && "opacity-50 cursor-not-allowed",
            "[&_h1]:text-foreground [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2",
            "[&_h2]:text-foreground [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-3 [&_h2]:mb-2",
            "[&_h3]:text-foreground [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-3 [&_h3]:mb-2",
            "[&_ul]:list-disc [&_ul]:list-outside [&_ul]:my-2 [&_ul]:ml-6",
            "[&_ol]:list-decimal [&_ol]:list-outside [&_ol]:my-2 [&_ol]:ml-6",
            "[&_li]:my-1",
            "[&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:py-2 [&_blockquote]:my-2 [&_blockquote]:italic [&_blockquote]:bg-muted/30",
            "[&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono",
            "[&_strong]:font-bold",
            "[&_em]:italic",
            "[&_u]:underline",
            "[&_s]:line-through",
            "[&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0",
            "[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded [&_img]:my-2",
            "[&_a]:text-primary [&_a]:underline [&_a]:hover:text-primary/80",
            "[&_table]:border-collapse [&_table]:w-full [&_table]:my-2",
            "[&_th]:border [&_th]:border-border [&_th]:p-2 [&_th]:bg-muted [&_th]:font-medium [&_th]:text-left",
            "[&_td]:border [&_td]:border-border [&_td]:p-2",
            "[&_.ProseMirror-selectednode]:outline [&_.ProseMirror-selectednode]:outline-2 [&_.ProseMirror-selectednode]:outline-ring",
            "[&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.is-editor-empty:first-child::before]:text-muted-foreground [&_.is-editor-empty:first-child::before]:pointer-events-none [&_.is-editor-empty:first-child::before]:h-0 [&_.is-editor-empty:first-child::before]:float-left"
          ),
        },
      },
    })

    React.useEffect(() => {
      if (editor && value !== editor.getHTML()) {
        editor.commands.setContent(value)
      }
    }, [editor, value])

    React.useEffect(() => {
      if (editor) {
        editor.setEditable(editable && !disabled)
      }
    }, [editor, editable, disabled])

    return (
      <div
        ref={ref}
        data-slot="texteditor"
        className={cn(
          "flex flex-col w-full min-w-0 max-w-full rounded-md border border-input bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm overflow-hidden",
          "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        {...props}
      >
        {showToolbar && editor && toolbarPosition === 'top' && (
          <Toolbar editor={editor} options={toolbar} position="top" className={toolbarClassName} />
        )}
        {editor ? (
          <EditorContent
            editor={editor}
            className="w-full min-w-0 max-w-full overflow-hidden"
          />
        ) : (
          <div className="p-3 text-muted-foreground min-h-[120px] flex items-start">
            {placeholder || "Start typing..."}
          </div>
        )}
        {showToolbar && editor && toolbarPosition === 'bottom' && (
          <Toolbar editor={editor} options={toolbar} position="bottom" />
        )}
      </div>
    )
  }
)

TextEditor.displayName = "TextEditor"

export { TextEditor }