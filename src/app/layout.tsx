import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

export const metadata: Metadata = {
  title: 'Twitter Clone',
  description: 'Twitter clone app with next',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <div className='bg-gray-900 min-h-screen flex'>{children}</div>
      </body>
    </html>
  )
}
