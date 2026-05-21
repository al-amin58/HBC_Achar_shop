import { useState, useEffect } from 'react';
import { User, Mail, Lock, Save, Eye, EyeOff } from 'lucide-react';
import axios from '../../api/axios.js';

const AdminProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('/api/auth/admin/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setProfile(prev => ({
          ...prev,
          name: response.data.admin.name || '',
          email: response.data.admin.email || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      // If API doesn't exist yet, use mock data
      setProfile(prev => ({
        ...prev,
        name: 'Admin User',
        email: 'admin@hbcachar.com'
      }));
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!profile.name.trim()) {
      newErrors.name = 'নাম প্রয়োজন';
    }

    if (!profile.email.trim()) {
      newErrors.email = 'ইমেইল প্রয়োজন';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      newErrors.email = 'সঠিক ইমেইল দিন';
    }

    // Password change validation
    if (profile.newPassword || profile.confirmPassword || profile.currentPassword) {
      if (!profile.currentPassword) {
        newErrors.currentPassword = 'বর্তমান পাসওয়ার্ড প্রয়োজন';
      }

      if (!profile.newPassword) {
        newErrors.newPassword = 'নতুন পাসওয়ার্ড প্রয়োজন';
      } else if (profile.newPassword.length < 8) {
        newErrors.newPassword = 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষর হতে হবে';
      }

      if (!profile.confirmPassword) {
        newErrors.confirmPassword = 'পাসওয়ার্ড নিশ্চিত করুন';
      } else if (profile.newPassword !== profile.confirmPassword) {
        newErrors.confirmPassword = 'পাসওয়ার্ড মিলছে না';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setSuccessMessage('');
      
      const token = localStorage.getItem('adminToken');
      const updateData = {
        name: profile.name,
        email: profile.email
      };

      // Only include password fields if they are being changed
      if (profile.currentPassword && profile.newPassword) {
        updateData.currentPassword = profile.currentPassword;
        updateData.newPassword = profile.newPassword;
      }

      const response = await axios.put('/api/auth/admin/profile', updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setSuccessMessage('প্রোফাইল সফলভাবে আপডেট করা হয়েছে');
        
        // Clear password fields
        setProfile(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        
        // Update local storage if token was refreshed
        if (response.data.token) {
          localStorage.setItem('adminToken', response.data.token);
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response?.data?.message) {
        setErrors({ submit: error.response.data.message });
      } else {
        setErrors({ submit: 'প্রোফাইল আপডেট করতে সমস্যা হয়েছে' });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white/60">লোড হচ্ছে...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">অ্যাডমিন প্রোফাইল</h1>
        <p className="text-white/60">আপনার ব্যক্তিগত তথ্য এবং পাসওয়ার্ড আপডেট করুন</p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-2xl text-green-400">
          {successMessage}
        </div>
      )}

      {errors.submit && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl text-red-400">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <User size={18} />
            ব্যক্তিগত তথ্য
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                পুরো নাম
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={18} />
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 bg-white/10 border ${
                    errors.name ? 'border-red-500' : 'border-white/10'
                  } rounded-xl text-white placeholder-white/40 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all`}
                  placeholder="আপনার পুরো নাম"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                ইমেইল ঠিকানা
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={18} />
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 bg-white/10 border ${
                    errors.email ? 'border-red-500' : 'border-white/10'
                  } rounded-xl text-white placeholder-white/40 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all`}
                  placeholder="admin@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>
          </div>
        </div>

        {/* Password Change Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Lock size={18} />
            পাসওয়ার্ড পরিবর্তন
          </h2>
          <p className="text-white/60 text-sm mb-4">
            পাসওয়ার্ড পরিবর্তন করতে নিচের ফিল্ডগুলো পূরণ করুন। পাসওয়ার্ড পরিবর্তন না করতে চাইলে ফিল্ডগুলো খালি রাখুন।
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                বর্তমান পাসওয়ার্ড
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={18} />
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={profile.currentPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 bg-white/10 border ${
                    errors.currentPassword ? 'border-red-500' : 'border-white/10'
                  } rounded-xl text-white placeholder-white/40 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all`}
                  placeholder="বর্তমান পাসওয়ার্ড"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white"
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="mt-1 text-sm text-red-400">{errors.currentPassword}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  নতুন পাসওয়ার্ড
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={18} />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={profile.newPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 bg-white/10 border ${
                      errors.newPassword ? 'border-red-500' : 'border-white/10'
                    } rounded-xl text-white placeholder-white/40 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all`}
                    placeholder="নতুন পাসওয়ার্ড"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-400">{errors.newPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  পাসওয়ার্ড নিশ্চিত করুন
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={18} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={profile.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 bg-white/10 border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-white/10'
                    } rounded-xl text-white placeholder-white/40 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all`}
                    placeholder="পাসওয়ার্ড নিশ্চিত করুন"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-orange-500 to-orange-400 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                সেভ হচ্ছে...
              </>
            ) : (
              <>
                <Save size={18} />
                পরিবর্তনগুলো সেভ করুন
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProfile;