'use client';
import { createContext, useContext } from 'react';

export const LoggedInUserContext = createContext<string>('');

export default function useLoggedInUser() {
  const user = useContext(LoggedInUserContext);
  return user;
}
