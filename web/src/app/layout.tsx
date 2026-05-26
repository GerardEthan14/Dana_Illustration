import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import { headers } from 'next/headers';
import './globals.css';

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Dana Illustration · Illustratrice jeunesse',
    template: '%s · Dana Illustration',
  },
  description:
    "Albums, portraits sur mesure et petits trésors imprimés. Illustratrice jeunesse basée en Belgique.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read pathname from request headers (set by proxy.ts)
  // to determine the current locale for the <html lang> attribute.
  const h = await headers();
  const pathname = h.get('x-pathname') ?? '/';
  const langMatch = pathname.match(/^\/([a-z]{2})(?:\/|$)/);
  const lang = langMatch?.[1] ?? 'fr';

  return (
    <html
      lang={lang}
      className={`${fraunces.variable} ${inter.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>{children}</body>
    </html>
  );
}
