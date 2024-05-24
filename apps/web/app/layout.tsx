import { ChakraClientProvider } from '@/providers/ChakraClientProvider';
import type { Metadata } from 'next';
import '../app/globals.css';
import { LufgaFont } from '@/lib/fonts';

export const metadata: Metadata = {
  title: 'Create Turborepo',
  description: 'Generated by create turbo',
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="en">
      <body className={LufgaFont.className}>
        <ChakraClientProvider>{children}</ChakraClientProvider>
      </body>
    </html>
  );
}
