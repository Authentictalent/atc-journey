import type { Metadata } from 'next'
import { IBM_Plex_Mono, Jost, Nunito_Sans } from 'next/font/google'
import { StoreProvider } from '@/lib/store'
import './globals.css'

const jost = Jost({ subsets: ['latin'], variable: '--font-jost' })
const nunito = Nunito_Sans({ subsets: ['latin'], variable: '--font-nunito' })
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-plex-mono' })

export const metadata: Metadata = {
  title: 'ATC Journey · Authentic Talent Consulting',
  description: "Le parcours Assessment & Development Center d'Authentic Talent Consulting, de l'invitation au feedback.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${jost.variable} ${nunito.variable} ${plexMono.variable}`}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  )
}
