import type { Metadata, Viewport } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/layout/Providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const cairo = Cairo({ subsets: ['latin', 'arabic'], variable: '--font-cairo', display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: 'Manara — منارة | Libya Digital Government Services',
    template: '%s | Manara',
  },
  description:
    'One digital front-door for Libyan government services: documents, passports, payments, utilities, health and education — without queues or wasta.',
};

export const viewport: Viewport = {
  themeColor: '#116568',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={`${cairo.variable} font-sans`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
