import "~/styles/globals.css";
import { Inter } from "next/font/google"
import { Providers } from "~/lib/provider"
import type React from "react" // Added import for React

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Google Drive Clone",
  description: "A Google Drive clone with dark mode support",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

