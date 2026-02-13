import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Confess.exe | AI Interrogation System',
    description: 'AI 범인을 심문하여 자백을 이끌어내십시오.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ko">
            <body>{children}</body>
        </html>
    )
}
