import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Mail, Lock, AlertCircle, Sparkles, CheckCircle, Crown, User, Copy, Check } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import { supabase } from '../lib/supabase';

interface LoginProps {
  onNavigateToRegister: () => void;
}

export default function Login({ onNavigateToRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { signIn } = useAuth();

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const fillCredentials = (emailValue: string, passwordValue: string) => {
    setEmail(emailValue);
    setPassword(passwordValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetSuccess(false);
    setResetLoading(true);

    if (!resetEmail) {
      setError('Please enter your email address');
      setResetLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}`,
      });

      if (error) throw error;

      setResetSuccess(true);
      setResetEmail('');
    } catch (error: any) {
      setError(error.message || 'Failed to send reset email');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 gap-6">
      <AnimatedBackground />

      {/* Test Credentials Panel */}
      <div className="hidden lg:block w-80 animate-slide-in-right">
        <div className="glass rounded-2xl shadow-2xl p-6 space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-1">🔑 Test Credentials</h3>
            <p className="text-xs text-gray-600">For demo and testing purposes</p>
          </div>

          {/* Admin Account */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-5 h-5 text-purple-600" />
              <h4 className="font-bold text-purple-900">Admin Account</h4>
            </div>
            <div className="space-y-2">
              <div className="bg-white rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-mono text-gray-900 break-all">vlkathir23@gmail.com</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard('vlkathir23@gmail.com', 'admin-email')}
                    className="ml-2 p-1.5 hover:bg-gray-100 rounded transition-colors"
                    title="Copy email"
                  >
                    {copiedField === 'admin-email' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Password</p>
                    <p className="text-sm font-mono text-gray-900">123456</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard('123456', 'admin-pass')}
                    className="ml-2 p-1.5 hover:bg-gray-100 rounded transition-colors"
                    title="Copy password"
                  >
                    {copiedField === 'admin-pass' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
              <button
                onClick={() => fillCredentials('vlkathir23@gmail.com', '123456')}
                className="w-full mt-2 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Use Admin Login
              </button>
            </div>
          </div>

          {/* Demo Account */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-blue-600" />
              <h4 className="font-bold text-blue-900">Demo Account</h4>
            </div>
            <div className="space-y-2">
              <div className="bg-white rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-mono text-gray-900 break-all">dueltmp+8vkl7@gmail.com</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard('dueltmp+8vkl7@gmail.com', 'demo-email')}
                    className="ml-2 p-1.5 hover:bg-gray-100 rounded transition-colors"
                    title="Copy email"
                  >
                    {copiedField === 'demo-email' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Password</p>
                    <p className="text-sm font-mono text-gray-900">123456</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard('123456', 'demo-pass')}
                    className="ml-2 p-1.5 hover:bg-gray-100 rounded transition-colors"
                    title="Copy password"
                  >
                    {copiedField === 'demo-pass' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
              <button
                onClick={() => fillCredentials('dueltmp+8vkl7@gmail.com', '123456')}
                className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Use Demo Login
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              💡 Click "Use" button or copy credentials manually
            </p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md animate-scale-in">
        <div className="glass rounded-2xl shadow-2xl p-8 space-y-6 hover:shadow-3xl transition-shadow duration-300">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full mb-4 shadow-lg animate-float">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to access your account</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 animate-slide-in-bottom">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-400"
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-400"
                  placeholder="Enter your password"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline focus:outline-none"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-center text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={onNavigateToRegister}
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline focus:outline-none"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6 flex items-center justify-center gap-2 animate-fade-in">
          <Sparkles className="w-4 h-4" />
          Secure account management system
          <Sparkles className="w-4 h-4" />
        </p>

        {/* Mobile Test Credentials */}
        <div className="lg:hidden mt-6 glass rounded-xl p-4 space-y-3">
          <h4 className="text-sm font-bold text-gray-900 text-center mb-3">🔑 Quick Test Login</h4>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => fillCredentials('vlkathir23@gmail.com', '123456')}
              className="flex flex-col items-center gap-2 p-3 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-lg border border-purple-200 transition-all"
            >
              <Crown className="w-5 h-5 text-purple-600" />
              <span className="text-xs font-semibold text-purple-900">Admin</span>
            </button>
            <button
              onClick={() => fillCredentials('dueltmp+8vkl7@gmail.com', '123456')}
              className="flex flex-col items-center gap-2 p-3 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg border border-blue-200 transition-all"
            >
              <User className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-semibold text-blue-900">Demo</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center">Tap to auto-fill credentials</p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Reset Password</h2>
            <p className="text-gray-600 mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 mb-4">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {resetSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 mb-4">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-green-800 font-medium">Email sent!</p>
                  <p className="text-sm text-green-700 mt-1">
                    Check your inbox for the password reset link.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="resetEmail"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                    disabled={resetLoading}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setError('');
                    setResetSuccess(false);
                    setResetEmail('');
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
                  disabled={resetLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50"
                >
                  {resetLoading ? 'Sending...' : 'Send Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
