import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SignInForm } from '../../components/auth/SignInForm';
import { SignUpForm } from '../../components/auth/SignUpForm';

export function AuthPage() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const [isSignIn, setIsSignIn] = useState(mode !== 'signup');

  useEffect(() => {
    setIsSignIn(mode !== 'signup');
  }, [mode]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4">
      <div className={`w-full ${isSignIn ? 'max-w-md' : 'max-w-[900px]'}`}>
        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-semibold text-white text-center mb-8">
            {isSignIn ? 'Connexion' : 'Créer un compte'}
          </h2>

          {isSignIn ? <SignInForm /> : <SignUpForm />}
        </div>
      </div>
    </div>
  );
}