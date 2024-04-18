'use client';
import { ReactNode, Fragment, useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import { AuthStateHook, useAuthState } from 'react-firebase-hooks/auth';
import { firebaseAuth } from '../lib/firebase';
import SignInAction from '../actions/signinAction';

interface SignInWithGoogleProviderProps {
  children: (login: () => void, state: AuthStateHook) => ReactNode;
  onLogin?: (user: User) => void;
}

export default function SignInWithGoogleProvider({ children, onLogin }: SignInWithGoogleProviderProps) {
  const [user, loading, error] = useAuthState(firebaseAuth);

  useEffect(() => {
    if (!user) return;
    onLogin && onLogin(user);

    async function handleLogin(userCredential: User) {
      const tokenId = await userCredential.getIdToken();
      SignInAction(tokenId);
    }

    handleLogin(user);
  }, [user, onLogin]);

  return (
    <Fragment>
      {children(() => signInWithPopup(firebaseAuth, new GoogleAuthProvider()), [user, loading, error])}
    </Fragment>
  );
}
