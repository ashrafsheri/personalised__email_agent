import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Paismo Email Generator',
  description: 'Internal email generation tool for Paismo team',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body 
        className="bg-gray-50"
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  )
}