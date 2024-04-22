import type { Metadata } from 'next';
import { LufgaFont } from '@/lib/fonts';
import '../../app/globals.css';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { ChakraClientProvider } from '@/providers/ChakraClientProvider';
import { headers } from 'next/headers';
import AuthProvider from '@/components/shared/AuthProvider';

export const metadata: Metadata = {
  title: 'Create Turborepo',
  description: 'Generated by create turbo',
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  const userId = headers().get('x-user');

  return (
    <html lang="en">
      <body className={LufgaFont.className}>
        <ChakraClientProvider>
          <AuthProvider uid={userId || ''}>
            {/* <LoggedInUserProvider value={JSON.stringify(userId)}> */}
            <DashboardLayout>{children}</DashboardLayout>
            {/* </LoggedInUserProvider> */}
          </AuthProvider>
        </ChakraClientProvider>
      </body>
    </html>
  );
}
