import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { BrainCircuit, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await api.post(endpoint, { email, password });

      if (response.data.success) {
        if (isLogin) {
          const { token, user } = response.data.data;
          setAuth(token, user);
          navigate('/');
        } else {
          // After successful signup, switch to login mode
          setIsLogin(true);
          setError('Registration successful! Please log in.');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-6 transition-colors duration-500">
      <div className="w-full max-w-lg">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center justify-center p-1 bg-red-500 dark:bg-blue-600 rounded-[2rem] shadow-2xl mb-6 overflow-hidden">
             <div className="h-20 w-20 rounded-[1.8rem] overflow-hidden">
                <img src="/logo.png" alt="Logo" className="h-full w-full object-cover" />
             </div>
          </div>
          <h1 className="text-6xl font-black text-slate-950 dark:text-white tracking-tighter">Study<span className="text-red-500">OS</span></h1>
          <p className="text-slate-500 dark:text-slate-400 mt-4 text-xl font-medium">
            {isLogin ? 'Welcome back! Ready to study?' : 'Join us and master your time.'}
          </p>
        </div>

        <div className="glass p-10 rounded-[3rem] shadow-2xl glow-red dark:glow-blue animate-in zoom-in-95 duration-500">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label htmlFor="email" className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Terminal ID (Email)</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 dark:text-zinc-800" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 text-slate-950 dark:text-white pl-14 pr-6 py-4 rounded-2xl focus:ring-2 focus:ring-red-500 dark:focus:ring-blue-600 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-zinc-800"
                  placeholder="name@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="password" className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Access Key (Password)</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 dark:text-zinc-800" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 text-slate-950 dark:text-white pl-14 pr-6 py-4 rounded-2xl focus:ring-2 focus:ring-red-500 dark:focus:ring-blue-600 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-zinc-800"
                  placeholder="••••••••"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
              </div>
            </div>

            {error && (
              <div className={`p-4 rounded-2xl text-sm font-bold border animate-in slide-in-from-left-2 ${error.includes('successful') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-600'}`}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-red-500/20 dark:shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group text-lg"
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Initialize' : 'Register'}
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-white/5 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-blue-400 text-sm font-black uppercase tracking-widest transition-colors"
            >
              {isLogin ? "Request Access Code (Sign Up)" : "Existing Terminal (Log In)"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
