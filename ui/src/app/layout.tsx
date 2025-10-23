"use client"

import { ThemeProvider } from 'next-themes'
import './globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui-library/ui/sonner'

// export const metadata: Metadata = {
//   title: 'Fortuna',
//   description: 'Fortuna app',
// }

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* <body className="min-h-screen [background:var(--app-background)]"> */}
      <body className="min-h-screen bg-background">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem
          value={{
            light: 'light',
            dark: 'dark',
          }}
        >
          <QueryClientProvider client={queryClient}>
            {children}
            <Toaster />
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
