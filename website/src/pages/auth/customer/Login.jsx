import {useState} from 'react';
import { useNavigate, useLocation } from 'react-router';
import { EyeIcon, EyeOffIcon } from "../../../componets/Eye_Icon.jsx";
import { toast } from 'react-toastify';
import api from '../../../api/axios.js';



export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    phonenumber: "",
    password: ""
  })
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', form);
      //save token to localstorage
      localStorage.setItem('token', response.data.token);
      window.dispatchEvent(new Event('hbc-auth-login'));
      toast.success(response.data.message || "Login successful!");
      const redirectTo = location.state?.from || '/';
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "An error occurred during login.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #fff8f0 0%, #f0faf4 50%, #fff8f0 100%)" }}>

      {/* Decorative blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-40 pointer-events-none"
        style={{ background: "radial-gradient(circle, #ffc98b 0%, #ffe5c4 70%, transparent 100%)" }} />
      <div className="absolute -bottom-25 -right-20 w-96 h-96 rounded-full opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, #7dd9a8 0%, #c2f0d8 70%, transparent 100%)" }} />
      <div className="absolute top-1/2 -left-15 w-48 h-48 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #ffa94d 0%, transparent 100%)" }} />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div
          className="rounded-3xl p-10 shadow-2xl"
          style={{
            background: "rgba(255,255,255,0.82)",
            backdropFilter: "blur(18px)",
            border: "1.5px solid rgba(255,193,112,0.25)",
            boxShadow: "0 8px 48px 0 rgba(255,160,60,0.10), 0 2px 16px 0 rgba(80,200,130,0.08)"
          }}>

          {/* Logo / Brand */}
          <div className="flex flex-col items-center mb-8">
           
            <p className="text-sm mt-1" style={{ color: "#f4a04b", fontWeight: 600, letterSpacing: "0.08em" }}>
              Welcome back
            </p>
            {location.state?.reason === 'cart' && (
              <p className="text-xs mt-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-center">
                কার্টে পণ্য যোগ করতে লগইন করুন
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, #f4c88a)" }} />
            <span className="text-xs font-semibold" style={{ color: "#a0c4b0" }}>SIGN IN</span>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, #a8e6c1)" }} />
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold mb-1.5 tracking-widest uppercase"
                style={{ color: "#4a9e70" }}>
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" stroke="#f4a04b" strokeWidth="1.8"/>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Z" stroke="#f4a04b" strokeWidth="1.8"/>
                  </svg>
                </span>
                <input
                  type="tel"
                  name="phonenumber"
                  value={form.phonenumber}
                  onChange={handleChange}
                  required
                  placeholder="Enter phone number"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                  style={{
                    background: "#f0faf4",
                    border: "1.5px solid #f9d5a0",
                    color: "#3d3020",
                    fontFamily: "inherit"
                  }}
                  onFocus={e => { e.target.style.border = "1.5px solid #f4a04b"; e.target.style.boxShadow = "0 0 0 3px rgba(244,160,75,0.12)"; }}
                  onBlur={e => { e.target.style.border = "1.5px solid #f9d5a0"; e.target.style.boxShadow = "none"; }}
                />
                
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold mb-1.5 tracking-widest uppercase"
                style={{ color: "#4a9e70" }}>
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
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                  style={{
                    background: "#f0faf4",
                    border: "1.5px solid #f9d5a0",
                    color: "#3d3020",
                    fontFamily: "inherit"
                  }}
                  onFocus={e => { e.target.style.border = "1.5px solid #f4a04b"; e.target.style.boxShadow = "0 0 0 3px rgba(244,160,75,0.12)"; }}
                  onBlur={e => { e.target.style.border = "1.5px solid #f9d5a0"; e.target.style.boxShadow = "none"; }}
                />
                <button type="button" onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer focus:outline-none"
                  tabIndex={-1}>
                  {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-white text-base tracking-wide mt-2 transition-all duration-200 active:scale-95"
              style={{
                background: "linear-gradient(90deg, #f4a04b 0%, #5ec98a 100%)",
                boxShadow: "0 4px 18px 0 rgba(244,160,75,0.28)",
                border: "none",
                cursor: "pointer",
                letterSpacing: "0.04em"
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 24px 0 rgba(94,201,138,0.35)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 4px 18px 0 rgba(244,160,75,0.28)"}
            >
              Login →
            </button>

            {/* Links */}
            <div className="flex justify-between items-center pt-1">
              <a
                href="/forgot-password"
                className="text-xs font-semibold transition-colors duration-150"
                style={{ color: "#f4a04b", textDecoration: "none" }}
                onMouseEnter={e => e.currentTarget.style.color = "#d4880e"}
                onMouseLeave={e => e.currentTarget.style.color = "#f4a04b"}
              >
                Forgot Password?
              </a>
              <a
                href="/register"
                className="text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-150"
                style={{
                  color: "#2d6a4f",
                  background: "#e6f7ee",
                  border: "1px solid #a8e6c1",
                  textDecoration: "none"
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#c2f0d8"; e.currentTarget.style.color = "#1a4a33"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#e6f7ee"; e.currentTarget.style.color = "#2d6a4f"; }}
              >
                Register →
              </a>
            </div>
          </form>
        </div>

        
      </div>
    </div>
  );
}