'use client';
import { LoggedInUserContext } from '@/lib/hooks/useLoggedInUser';
import { ReactNode } from 'react';

export default function AuthProvider({ uid, children }: { children: ReactNode; uid: string }) {
  return <LoggedInUserContext.Provider value={uid}>{children}</LoggedInUserContext.Provider>;
}
