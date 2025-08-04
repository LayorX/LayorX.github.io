
import React, { useState } from 'react';
import { authService } from '../services/authService';
import { User } from '../types';

interface AuthProps {
  onLoginSuccess: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('password'); // Default for demo
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      let user: User | null;
      if (isLoginMode) {
        user = authService.login(username, password);
        if (!user) {
          setError('無效的用戶名或密碼。');
          return;
        }
      } else {
        user = authService.register(username, password);
        if (!user) {
            setError('用戶名已存在或無效。');
            return;
        }
      }
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-dark-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-dark-surface rounded-lg shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center text-stone-900 dark:text-dark-primary-text mb-2">
          歡迎來到理性社群平台
        </h1>
        <p className="text-center text-stone-600 dark:text-dark-secondary-text mb-8">
          {isLoginMode ? '登入以繼續' : '建立一個新帳號'}
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-stone-700 dark:text-dark-secondary-text">用戶名</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-dark-background border border-stone-300 dark:border-dark-border rounded-md shadow-sm placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
              placeholder="例如：思辨者 A"
            />
          </div>
          <div>
             <label htmlFor="password" className="block text-sm font-medium text-stone-700 dark:text-dark-secondary-text">密碼</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-dark-background border border-stone-300 dark:border-dark-border rounded-md shadow-sm placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            />
             <p className="text-xs text-stone-400 dark:text-dark-secondary-text mt-1">為方便演示，所有初始用戶密碼均為 "password"。</p>
          </div>
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-700 hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
            >
              {isLoginMode ? '登入' : '註冊'}
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <button
            onClick={() => { setIsLoginMode(!isLoginMode); setError(''); }}
            className="text-sm text-sky-600 hover:underline dark:text-dark-primary"
          >
            {isLoginMode ? '沒有帳號嗎????？點此註冊' : '已經有帳號了？點此登入'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;