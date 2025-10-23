"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { TextEditor, type ToolbarOption } from "./texteditor"
import { Button } from "@/components/ui-library/ui/button"
import { Badge } from "@/components/ui-library/ui/badge"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui-library/ui/form"

interface FormData {
  content: string
  basicContent: string
  customContent: string
}

export function TextEditorExample() {
  const form = useForm<FormData>({
    defaultValues: {
      content: "",
      basicContent: "",
      customContent: "",
    },
  })

  const onSubmit = (data: FormData) => {
    console.log("Form data:", data)
  }

  const minimalToolbar: ToolbarOption[] = [
    { type: 'bold' },
    { type: 'italic' },
    { type: 'separator' },
    { type: 'bulletList' },
    { type: 'orderedList' },
  ]

  const customToolbar: ToolbarOption[] = [
    { type: 'undo' },
    { type: 'redo' },
    { type: 'separator' },
    { type: 'bold' },
    { type: 'italic' },
    { type: 'underline' },
    { type: 'separator' },
    {
      type: 'custom',
      element: (
        <Button
          key="custom-save"
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={() => alert('Custom save action!')}
        >
          Save Draft
        </Button>
      ),
    },
    { type: 'separator' },
    {
      type: 'custom',
      element: (
        <Badge key="custom-badge" variant="outline" className="h-6 text-xs">
          Draft
        </Badge>
      ),
    },
  ]

  return (
    <div className="max-w-4xl py-4 space-y-12">      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Featured Editor</FormLabel>
                <FormControl>
                  <TextEditor
                    placeholder="Try all the toolbar features: bold, italic, headings, lists, images, tables, colors..."
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  Full toolbar with all features: formatting, headings, lists, alignment, images, tables, and more.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="basicContent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimal Toolbar Editor</FormLabel>
                <FormControl>
                  <TextEditor
                    placeholder="Limited formatting options available..."
                    value={field.value}
                    onChange={field.onChange}
                    toolbar={minimalToolbar}
                  />
                </FormControl>
                <FormDescription>
                  Custom toolbar configuration with only basic formatting options.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customContent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Toolbar with Custom Elements</FormLabel>
                <FormControl>
                  <TextEditor
                    placeholder="Editor with custom toolbar elements..."
                    value={field.value}
                    onChange={field.onChange}
                    toolbar={customToolbar}
                  />
                </FormControl>
                <FormDescription>
                  Toolbar with custom buttons and elements mixed with standard formatting options.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit">Save All Content</Button>
        </form>
      </Form>

      <div>
        <h3 className="text-xl font-semibold mb-4">Bottom Toolbar Editor</h3>
        <TextEditor
          placeholder="Editor with toolbar at bottom..."
          toolbarPosition="bottom"
          onChange={(value) => console.log("Content changed:", value)}
        />
        <p className="text-sm text-muted-foreground mt-2">
          Toolbar positioned at the bottom of the editor.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Editor Without Toolbar</h3>
        <TextEditor
          placeholder="Clean editor without toolbar..."
          showToolbar={false}
          onChange={(value) => console.log("Content changed:", value)}
        />
        <p className="text-sm text-muted-foreground mt-2">
          Pure editor experience without any toolbar.
        </p>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Usage Examples</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">1. Default Full Toolbar:</h4>
            <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
{`<TextEditor
  placeholder="Start typing..."
  value={value}
  onChange={setValue}
/>`}
            </pre>
          </div>

          <div>
            <h4 className="font-medium mb-2">2. Minimal Toolbar:</h4>
            <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
{`const minimalToolbar = [
  { type: 'bold' },
  { type: 'italic' },
  { type: 'separator' },
  { type: 'bulletList' },
]

<TextEditor
  toolbar={minimalToolbar}
  value={value}
  onChange={setValue}
/>`}
            </pre>
          </div>

          <div>
            <h4 className="font-medium mb-2">3. Custom Elements in Toolbar:</h4>
            <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
{`const customToolbar = [
  { type: 'bold' },
  { type: 'italic' },
  { type: 'separator' },
  {
    type: 'custom',
    element: (
      <Button onClick={() => alert('Custom action!')}>
        Custom Action
      </Button>
    ),
  },
]

<TextEditor
  toolbar={customToolbar}
  value={value}
  onChange={setValue}
/>`}
            </pre>
          </div>

          <div>
            <h4 className="font-medium mb-2">4. Bottom Toolbar:</h4>
            <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
{`<TextEditor
  toolbarPosition="bottom"
  value={value}
  onChange={setValue}
/>`}
            </pre>
          </div>

          <div>
            <h4 className="font-medium mb-2">5. Without Toolbar:</h4>
            <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
{`<TextEditor
  showToolbar={false}
  value={value}
  onChange={setValue}
/>`}
            </pre>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Available Toolbar Options</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
          {[
            'bold', 'italic', 'underline', 'strikethrough', 'code',
            'h1', 'h2', 'h3', 'bulletList', 'orderedList', 'blockquote',
            'alignLeft', 'alignCenter', 'alignRight', 'alignJustify',
            'image', 'link', 'table', 'highlight', 'color',
            'undo', 'redo', 'separator', 'custom'
          ].map((option) => (
            <Badge key={option} variant="outline" className="justify-center">
              {option}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}