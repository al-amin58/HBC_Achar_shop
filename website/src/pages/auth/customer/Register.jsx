import { useState } from "react";
import api from '../../../api/axios.js';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router";
import { EyeIcon, EyeOffIcon } from "../../../componets/Eye_Icon.jsx";


export default function Register() {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);

  const navigate = useNavigate();

  const [form, setform] = useState({
    name: "",
    phonenumber: "",
    password: "",
    confirmPassword: "",
  })

 

  const handleChange = (e) => {
    setform({
       ...form,
       [e.target.name]: e.target.value
    });
  }

  const handleSubmit = async (e) => {
     e.preventDefault();
      if (!form.name || form.name.length < 3) {
        return toast.error("Name must be at least 3 characters");
      }

      const phoneRegex = /^01[0-9]{9}$/;
      if (!phoneRegex.test(form.phonenumber)) {
        return toast.error("Phone must be 11 digits and start with 01");
      }
      if (form.password.length < 8 || form.password.length > 12) {
        return toast.error("Password must be 8-12 characters");
      }

      if (form.password !== form.confirmPassword) {
        return toast.error("Passwords do not match");
      }
     try{
        const response = await api.post("/auth/signup", form);
        toast.success(response.data.message || "Registration successful!"); 
        setTimeout(() => {
          navigate("/login");
        }, 500);  
     }catch(error){
        toast.error(error.response?.data?.message || error.message || "An error occurred.");
     }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden py-10"
      style={{ background: "linear-gradient(135deg, #fff8f0 0%, #f0faf4 50%, #fff8f0 100%)" }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-40 pointer-events-none"
        style={{ background: "radial-gradient(circle, #ffc98b 0%, #ffe5c4 70%, transparent 100%)" }}
      />
      <div
        className="absolute -bottom-25 -left-20 w-96 h-96 rounded-full opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, #7dd9a8 0%, #c2f0d8 70%, transparent 100%)" }}
      />
      <div
        className="absolute top-1/3 -right-15 w-56 h-56 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #ffa94d 0%, transparent 100%)" }}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div
          className="rounded-3xl p-10 shadow-2xl"
          style={{
            background: "rgba(255,255,255,0.82)",
            backdropFilter: "blur(18px)",
            border: "1.5px solid rgba(255,193,112,0.25)",
            boxShadow:
              "0 8px 48px 0 rgba(255,160,60,0.10), 0 2px 16px 0 rgba(80,200,130,0.08)",
          }}
        >
          {/* Logo / Brand */}
          <div className="flex flex-col items-center mb-7">
            <p className="text-sm mt-1" style={{ color: "#f4a04b", fontWeight: 600, letterSpacing: "0.08em" }}>
              Create your account 
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, #f4c88a)" }} />
            <span className="text-xs font-semibold" style={{ color: "#a0c4b0" }}>REGISTER</span>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, #a8e6c1)" }} />
          </div>

          <form onSubmit={handleSubmit}  className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold mb-1.5 tracking-widest uppercase" style={{ color: "#4a9e70" }}>
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="4" stroke="#f4a04b" strokeWidth="1.8" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#f4a04b" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </span>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                  style={{
                     background: "#f0faf4",
                    border: "1.5px solid #f9d5a0",
                    color: "#3d3020", }}
                  onFocus={e => { e.target.style.border = "1.5px solid #f4a04b"; e.target.style.boxShadow = "0 0 0 3px rgba(244,160,75,0.12)"; }}
                  onBlur={e => { e.target.style.border = "1.5px solid #f9d5a0"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold mb-1.5 tracking-widest uppercase" style={{ color: "#4a9e70" }}>
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <rect x="7" y="2" width="10" height="20" rx="2" stroke="#f4a04b" strokeWidth="1.8" />
                    <circle cx="12" cy="18" r="1" fill="#f4a04b" />
                  </svg>
                </span>
                <input
                  type="tel"
                  name="phonenumber"
                  value={form.phonenumber}
                  onChange={handleChange}
                  required
                  placeholder="+880 XXXXXXXXXX"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                  style={{ background: "#f0faf4",
                    border: "1.5px solid #f9d5a0",
                    color: "#3d3020", }}
                  onFocus={e => { e.target.style.border = "1.5px solid #f4a04b"; e.target.style.boxShadow = "0 0 0 3px rgba(244,160,75,0.12)"; }}
                  onBlur={e => { e.target.style.border = "1.5px solid #f9d5a0"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold mb-1.5 tracking-widest uppercase" style={{ color: "#4a9e70" }}>
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <rect x="5" y="11" width="14" height="10" rx="2" stroke="#f4a04b" strokeWidth="1.8" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#f4a04b" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                  style={{ background: "#f0faf4", border: "1.5px solid #f9d5a0", color: "#3d3020" }}
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

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold mb-1.5 tracking-widest uppercase" style={{ color: "#4a9e70" }}>
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <rect x="5" y="11" width="14" height="10" rx="2" stroke="#f4a04b" strokeWidth="1.8" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#f4a04b" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M9 16l2 2 4-4" stroke="#f4a04b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                  style={{ background: "#f0faf4",
                    border: "1.5px solid #f9d5a0",
                    color: "#3d3020", }}
                  onFocus={e => { e.target.style.border = "1.5px solid #f4a04b"; e.target.style.boxShadow = "0 0 0 3px rgba(244,160,75,0.12)"; }}
                  onBlur={e => { e.target.style.border = "1.5px solid #f9d5a0"; e.target.style.boxShadow = "none"; }}
                />
                <button type="button" onClick={() => setShowConfirm(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer focus:outline-none"
                  tabIndex={-1}>
                  {showConfirm ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                id="terms"
                className="mt-0.5 w-4 h-4 rounded accent-green-500 cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs leading-relaxed cursor-pointer" style={{ color: "#5a7a68" }}>
                I agree to the{" "}
                <a href="/terms" style={{ color: "#f4a04b", fontWeight: 700, textDecoration: "none" }}>
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a href="/privacy" style={{ color: "#4a9e70", fontWeight: 700, textDecoration: "none" }}>
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-white text-base tracking-wide mt-1 transition-all duration-200 active:scale-95"
              style={{
                background: "linear-gradient(90deg, #80d9a8 0%, #f4a04b 100%)",
                boxShadow: "0 4px 18px 0 rgba(94,201,138,0.28)",
                border: "none",
                cursor: "pointer",
                letterSpacing: "0.04em",
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 6px 24px 0 rgba(244,160,75,0.35)")}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 18px 0 rgba(94,201,138,0.28)")}
            >
              Create Account →
            </button>

            {/* Already have account */}
            <div className="flex justify-center items-center pt-1 gap-2">
              <span className="text-xs" style={{ color: "#a0b8a8" }}>Already have an account?</span>
              <a
                href="/login"
                className="text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-150"
                style={{
                  color: "#2d6a4f",
                  background: "#e6f7ee",
                  border: "1px solid #a8e6c1",
                  textDecoration: "none",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#c2f0d8"; e.currentTarget.style.color = "#1a4a33"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#e6f7ee"; e.currentTarget.style.color = "#2d6a4f"; }}
              >
                Login →
              </a>
            </div>
          </form>
        </div>

        
      </div>
    </div>
  );
}