import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Transfer.ai - Your Community College Progress Partner',
    description: 'From enrollment to excellence. Optimize your transfer journey with personalized course recommendations, guaranteed transfer routes, and comprehensive transfer analysis.',
    keywords: 'community college, transfer, university, course selection, transfer credits, academic planning',
    authors: [{ name: 'Transfer.ai Team' }],
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthProvider>
                    {children}
                    <Toaster position="top-right" richColors />
                </AuthProvider>
            </body>
        </html>
    )
} 