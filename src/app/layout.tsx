import './globals.css';
import type { Metadata } from 'next';

import { Inter, Poppins, Roboto } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});
export const metadata: Metadata = {
  title: 'AI Cold Email Generator | Personalized Outreach for Founders',
  description: 'Generate personalized cold emails for startup founders using AI. Research, personalize, and send outreach emails that convert.',
  keywords: 'cold email, AI, startup, founder, outreach, personalized email, email generator',
  authors: [{ name: 'AI Email Generator' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}