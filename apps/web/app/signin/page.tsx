'use client';

import SignInWithGoogleProvider from '@/providers/SigninWithGoogleProvider';
import { Button } from '@chakra-ui/react';

export default function SignInPage() {
  return (
    <div>
      <h1>Sign in</h1>
      <SignInWithGoogleProvider>
        {(login, [user]) => (
          <>
            {user && <p>Welcome, {user.displayName}</p>}
            <Button colorScheme="green" onClick={login}>
              Sign in with Google
            </Button>
          </>
        )}
      </SignInWithGoogleProvider>
    </div>
  );
}
