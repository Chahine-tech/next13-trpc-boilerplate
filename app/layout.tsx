import './globals.css'
import { TrpcProvider } from "@/utils/trpc-provider";


export const metadata = {
  title: 'Next13 Trpc Example',
  description: 'Next13 Trpc Boilerplate',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <TrpcProvider>{children}</TrpcProvider>
      </body>
    </html>
  )
}
