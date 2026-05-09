import { useState } from 'react';
import { useNavigate, Navigate  } from 'react-router';
import { EyeIcon, EyeOffIcon } from "../../../componets/Eye_Icon.jsx";
import { toast } from 'react-toastify';
import api from '../../../api/axios.js';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm]               = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);

  // ──  login করা থাকলে dashboard এ পাঠাও ──
  if (localStorage.getItem('adminToken')) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/admin/login', form);
      // Keep shared axios auth flow compatible without editing axios.js.
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('token', response.data.token);
      toast.success('Welcome, Admin!');
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: '#f0faf4',
    border: '1.5px solid #f9d5a0',
    color: '#3d3020',
    fontFamily: 'inherit',
  };
  const inputFocus = e => {
    e.target.style.border = '1.5px solid #f4a04b';
    e.target.style.boxShadow = '0 0 0 3px rgba(244,160,75,0.12)';
  };
  const inputBlur = e => {
    e.target.style.border = '1.5px solid #f9d5a0';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #fff8f0 0%, #f0faf4 50%, #fff8f0 100%)' }}
    >
      {/* Blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-40 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #ffc98b 0%, #ffe5c4 70%, transparent 100%)' }} />
      <div className="absolute -bottom-25 -right-20 w-96 h-96 rounded-full opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7dd9a8 0%, #c2f0d8 70%, transparent 100%)' }} />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div
          className="rounded-3xl p-10 shadow-2xl"
          style={{
            background: 'rgba(255,255,255,0.82)',
            backdropFilter: 'blur(18px)',
            border: '1.5px solid rgba(255,193,112,0.25)',
            boxShadow: '0 8px 48px 0 rgba(255,160,60,0.10), 0 2px 16px 0 rgba(80,200,130,0.08)',
          }}
        >
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
            >
              <img src="/logo.svg" alt="logo"  />
            </div>
            <p className="text-xs font-bold tracking-widest" style={{ color: '#f4a04b' }}>
              ADMIN PANEL
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #f4c88a)' }} />
            <span className="text-xs font-semibold" style={{ color: '#a0c4b0' }}>SIGN IN</span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #a8e6c1)' }} />
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold mb-1.5 tracking-widest uppercase"
                style={{ color: '#4a9e70' }}>
                Email
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z"
                      stroke="#f4a04b" strokeWidth="1.8"/>
                    <path d="M22 6l-10 7L2 6" stroke="#f4a04b" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Admin email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                  style={inputStyle}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold mb-1.5 tracking-widest uppercase"
                style={{ color: '#4a9e70' }}>
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <rect x="5" y="11" width="14" height="10" rx="2" stroke="#f4a04b" strokeWidth="1.8"/>
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#f4a04b" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Admin password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                  style={inputStyle}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer focus:outline-none bg-transparent border-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white text-base tracking-wide mt-2 transition-all duration-200 active:scale-95"
              style={{
                background: 'linear-gradient(90deg, #f4a04b 0%, #5ec98a 100%)',
                boxShadow: '0 4px 18px 0 rgba(244,160,75,0.28)',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Signing in...' : 'Login →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}