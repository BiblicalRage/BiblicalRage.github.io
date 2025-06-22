import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const AuthScreen = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      if (onAuthSuccess) onAuthSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-white rounded-xl shadow-xl p-8 m-5 max-w-sm w-full flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6">{isSignUp ? 'Sign Up' : 'Log In to Your Account'}</h2>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5 mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-xl py-2 font-semibold shadow hover:from-blue-600 hover:to-blue-500 transition mt-2"
            disabled={loading}
          >
            {loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Log In')}
          </button>
        </form>
        <div className="border-t border-slate-200 w-full my-4"></div>
        <button
          className="mt-2 text-blue-600 hover:underline text-base font-medium"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
};

export default AuthScreen; 