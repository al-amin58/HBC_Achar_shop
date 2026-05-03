import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { EyeIcon, EyeOffIcon } from "../../../componets/Eye_Icon.jsx";
import { toast } from 'react-toastify';
import api from '../../../api/axios.js';

const STEP_CONFIG = {
  1: { title: 'Reset Password',   sub: 'Enter your registered phone number', label: 'PHONE'    },
  2: { title: 'Verify OTP',       sub: 'Enter the 4-digit OTP sent to you',  label: 'OTP'      },
  3: { title: 'Set New Password', sub: 'Choose a strong new password',        label: 'PASSWORD' },
};

const OTP_TTL = 5 * 60; // 5 minutes in seconds

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep]               = useState(1);
  const [phone, setPhone]             = useState('');
  const [otp, setOtp]                 = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showNew, setShowNew]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [timer, setTimer]             = useState(OTP_TTL);
  const [otpExpired, setOtpExpired]   = useState(false);
  const [loading, setLoading]         = useState(false);

  const timerRef = useRef(null);
  const timerValueRef = useRef(OTP_TTL);

  /* ── timer: only start when step becomes 2 ── */
  const startTimer = () => {
    clearInterval(timerRef.current);
    timerValueRef.current = OTP_TTL;

    timerRef.current = setInterval(() => {
      timerValueRef.current -= 1;
      setTimer(timerValueRef.current);
      if (timerValueRef.current <= 0) {
        clearInterval(timerRef.current);
        setOtpExpired(true);
      }
    }, 1000);
  };

  const fmtTimer = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  /* ── Step 1: request OTP ── */
  const handleGetCode = async () => {
    if (!phone || phone.length < 6) {
      toast.error('Please enter a valid phone number.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/forgot-password/send-otp', { phonenumber: phone });
      toast.success('OTP sent successfully!');
      setTimer(OTP_TTL);
      setOtpExpired(false);
      setStep(2);
      startTimer();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Phone number not found.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 2: verify OTP ── */
  const handleVerifyOtp = async () => {
    if (otpExpired) { toast.error('OTP has expired. Please request a new one.'); return; }
    if (!/^\d{4}$/.test(otp)) { toast.error('Please enter a valid 4-digit OTP.'); return; }
    setLoading(true);
    try {
      await api.post('/auth/forgot-password/verify-otp', { phonenumber: phone, otp });
      toast.success('OTP verified!');
      clearInterval(timerRef.current);
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 3: reset password ── */
  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPass) {
      toast.error('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/forgot-password/reset', { phonenumber: phone, otp, newPassword });
      toast.success('Password reset successful!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  const goBack = toStep => {
    clearInterval(timerRef.current);
    setOtp('');
    setTimer(OTP_TTL);
    setOtpExpired(false);
    setStep(toStep);
  };

  /* ── shared styles ── */
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

  const cfg = STEP_CONFIG[step] || {};

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #fff8f0 0%, #f0faf4 50%, #fff8f0 100%)' }}
    >
      {/* Decorative blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-40 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #ffc98b 0%, #ffe5c4 70%, transparent 100%)' }} />
      <div className="absolute -bottom-25 -right-20 w-96 h-96 rounded-full opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7dd9a8 0%, #c2f0d8 70%, transparent 100%)' }} />
      <div className="absolute top-1/2 -left-15 w-48 h-48 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #ffa94d 0%, transparent 100%)' }} />

      {/* Card */}
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
          {/* ── Step Indicator ── */}
          <div className="flex items-center justify-center gap-0 mb-8">
            {[1, 2, 3].map((n, i) => (
              <div key={n} className="flex items-center">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                  style={
                    step > n
                      ? { background: '#5ec98a', color: 'white', border: '2px solid transparent' }
                      : step === n
                      ? {
                          background: 'linear-gradient(135deg, #f4a04b, #5ec98a)',
                          color: 'white',
                          border: '2px solid transparent',
                          boxShadow: '0 0 0 4px rgba(244,160,75,0.15)',
                        }
                      : { background: '#fff8f0', color: '#c8a060', border: '2px solid #f9d5a0' }
                  }
                >
                  {step > n ? (
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : n}
                </div>
                {i < 2 && (
                  <div
                    className="w-9 h-0.5 rounded transition-all duration-300"
                    style={{ background: step > n ? '#5ec98a' : '#f9d5a0' }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* ── Header ── */}
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-xl font-extrabold" style={{ color: '#2d6a4f' }}>{cfg.title}</h2>
            <p className="text-sm mt-1" style={{ color: '#7aab90' }}>{cfg.sub}</p>
          </div>

          {/* ── Divider ── */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #f4c88a)' }} />
            <span className="text-xs font-semibold" style={{ color: '#a0c4b0' }}>{cfg.label}</span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #a8e6c1)' }} />
          </div>

          {/* ══════════════ STEP 1 ══════════════ */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold mb-1.5 tracking-widest uppercase"
                  style={{ color: '#4a9e70' }}>
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"
                        stroke="#f4a04b" strokeWidth="1.8" />
                    </svg>
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                    style={inputStyle}
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                  />
                </div>
              </div>

              <button
                onClick={handleGetCode}
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-white text-base tracking-wide transition-all duration-200 active:scale-95"
                style={{
                  background: 'linear-gradient(90deg, #f4a04b 0%, #5ec98a 100%)',
                  boxShadow: '0 4px 18px 0 rgba(244,160,75,0.28)',
                  border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Sending...' : 'Get Code →'}
              </button>

              <div className="text-center pt-1">
                <a
                  href="/login"
                  className="text-xs font-semibold transition-colors duration-150"
                  style={{ color: '#f4a04b', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#d4880e')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#f4a04b')}
                >
                  ← Back to Login
                </a>
              </div>
            </div>
          )}

          {/* ══════════════ STEP 2 ══════════════ */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold mb-1.5 tracking-widest uppercase"
                  style={{ color: '#4a9e70' }}>
                  OTP Code
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <rect x="5" y="11" width="14" height="10" rx="2" stroke="#f4a04b" strokeWidth="1.8" />
                      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#f4a04b" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </span>
                  <input
                    type="number"
                    value={otp}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setOtp(val);
                    }}
                    placeholder="Enter 4-digit OTP"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                    style={{ ...inputStyle, letterSpacing: '0.3em', fontSize: '16px' }}
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                    maxLength={4}
                    inputMode="numeric"
                    pattern="\d{4}"
                  />
                </div>

                {/* Timer */}
                <div className="text-center mt-2">
                  {otpExpired ? (
                    <span className="text-xs font-semibold" style={{ color: '#e07070' }}>
                      ⚠️ OTP expired. Go back and try again.
                    </span>
                  ) : (
                    <span className="text-xs font-semibold" style={{ color: '#f4a04b' }}>
                      ⏱ {fmtTimer(timer)} remaining
                    </span>
                  )}
                </div>
                <p className="text-xs text-center mt-1" style={{ color: '#7aab90' }}>
                  A 4-digit OTP has been generated and saved. Only numbers allowed.
                </p>
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={loading || otpExpired}
                className="w-full py-3 rounded-xl font-bold text-white text-base tracking-wide transition-all duration-200 active:scale-95"
                style={{
                  background: otpExpired
                    ? 'linear-gradient(90deg, #ccc 0%, #bbb 100%)'
                    : 'linear-gradient(90deg, #f4a04b 0%, #5ec98a 100%)',
                  boxShadow: '0 4px 18px 0 rgba(244,160,75,0.28)',
                  border: 'none', cursor: loading || otpExpired ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Verifying...' : 'Verify OTP →'}
              </button>

              <div className="text-center pt-1">
                <button
                  onClick={() => goBack(1)}
                  className="text-xs font-semibold transition-colors duration-150 bg-transparent border-none cursor-pointer"
                  style={{ color: '#f4a04b' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#d4880e')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#f4a04b')}
                >
                  ← Back
                </button>
              </div>
            </div>
          )}

          {/* ══════════════ STEP 3 ══════════════ */}
          {step === 3 && (
            <div className="space-y-5">
              {/* New Password */}
              <div>
                <label className="block text-xs font-bold mb-1.5 tracking-widest uppercase"
                  style={{ color: '#4a9e70' }}>
                  New Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <rect x="5" y="11" width="14" height="10" rx="2" stroke="#f4a04b" strokeWidth="1.8" />
                      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#f4a04b" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </span>
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                    style={inputStyle}
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer focus:outline-none bg-transparent border-none"
                    tabIndex={-1}
                  >
                    {showNew ? <EyeIcon /> : <EyeOffIcon />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold mb-1.5 tracking-widest uppercase"
                  style={{ color: '#4a9e70' }}>
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <rect x="5" y="11" width="14" height="10" rx="2" stroke="#f4a04b" strokeWidth="1.8" />
                      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#f4a04b" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </span>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPass}
                    onChange={e => setConfirmPass(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                    style={inputStyle}
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer focus:outline-none bg-transparent border-none"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeIcon /> : <EyeOffIcon />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-white text-base tracking-wide transition-all duration-200 active:scale-95"
                style={{
                  background: 'linear-gradient(90deg, #f4a04b 0%, #5ec98a 100%)',
                  boxShadow: '0 4px 18px 0 rgba(244,160,75,0.28)',
                  border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Resetting...' : 'Reset Password →'}
              </button>

              <div className="text-center pt-1">
                <button
                  onClick={() => goBack(2)}
                  className="text-xs font-semibold transition-colors duration-150 bg-transparent border-none cursor-pointer"
                  style={{ color: '#f4a04b' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#d4880e')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#f4a04b')}
                >
                  ← Back
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}