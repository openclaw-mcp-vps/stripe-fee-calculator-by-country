import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Stripe Fee Calculator by Country | Global Payment Cost Tool',
  description: 'Calculate exact Stripe processing fees by country, payment method, and currency. Real-time rates with tax implications for SaaS founders expanding internationally.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script defer src="https://umami.microtool.dev/script.js" data-website-id="ddf1e055-3755-472d-a9cf-f06239c798e2"></script>
      </head>
      <body>{children}</body>
    </html>
  )
}
