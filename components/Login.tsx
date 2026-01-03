import React, { useState } from 'react';
import { api } from '../services/api';

interface LoginProps {
  onLoginSuccess: (token: string, admin: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { token, admin } = await api.auth.login({
          email: formData.email,
          password: formData.password
        });
        onLoginSuccess(token, admin);
      } else {
        await api.auth.register(formData);
        setIsLogin(true);
        setError('Registration successful. You can now login.');
      }
    } catch (err: any) {
      setError(err.message === 'Failed to fetch' ? 'Backend server is unreachable. Please ensure it is running on port 5000.' : err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-slate-400";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Insurify Admin</h1>
          <p className="text-slate-500 mt-2">{isLogin ? 'Secure Admin Login' : 'Register New Admin'}</p>
        </div>

        {error && (
          <div className={`p-3 rounded-lg text-sm mb-6 ${error.includes('successful') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700 border border-red-100'}`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Admin Name"
                autoComplete="name"
                className={inputClasses}
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="admin@insurify.com"
              autoComplete="email"
              className={inputClasses}
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              autoComplete="current-password"
              className={inputClasses}
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold shadow-lg hover:bg-blue-700 active:scale-[0.98] transition-all disabled:bg-slate-400"
          >
            {loading ? 'Authenticating...' : (isLogin ? 'Login' : 'Create Admin')}
          </button>
        </form>

        <div className="mt-8 text-center border-t pt-6">
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            {isLogin ? "Need an admin account? Register" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;