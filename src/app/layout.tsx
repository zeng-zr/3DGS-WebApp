import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '3D Gaussian Splatting Web App',
  description: '基于3D Gaussian Splatting技术的点云重建应用',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body 
        className={`${inter.className} flex flex-col items-center justify-center p-4 sm:p-8 md:p-12`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  )
}
