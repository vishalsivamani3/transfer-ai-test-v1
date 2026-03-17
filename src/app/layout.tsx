import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/AuthContext'

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
            <body>
                <AuthProvider fallbackUser={{
                    id: 'dev-user-123',
                    email: 'dev@example.com',
                    aud: 'authenticated',
                    role: 'authenticated',
                    email_confirmed_at: new Date().toISOString(),
                    phone: '',
                    confirmed_at: new Date().toISOString(),
                    last_sign_in_at: new Date().toISOString(),
                    app_metadata: { provider: 'email', providers: ['email'] },
                    user_metadata: {
                        firstName: 'Dev',
                        lastName: 'User',
                        currentCollege: 'Community College',
                        academicYear: 'Freshman'
                    },
                    identities: [],
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                } as any}>
                    {children}
                    <Toaster position="top-right" richColors />
                </AuthProvider>
            </body>
        </html>
    )
} 