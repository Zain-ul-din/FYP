'use client';

import SignInWithGoogleProvider from '@/providers/SigninWithGoogleProvider';

export default function SignInPage() {
  return (
    <div>
      <h1>Sign in</h1>
      <SignInWithGoogleProvider>
        {(login, [user]) => (
          <>
            {user && <p>Welcome, {user.displayName}</p>}
            <button onClick={login}>Sign in with Google</button>
          </>
        )}
      </SignInWithGoogleProvider>
    </div>
  );
}
