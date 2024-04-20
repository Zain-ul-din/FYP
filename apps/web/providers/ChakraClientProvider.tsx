'use client';
import theme from '@/lib/theme';
import { ChakraProvider } from '@chakra-ui/react';
export function ChakraClientProvider({ children }: { children: React.ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
