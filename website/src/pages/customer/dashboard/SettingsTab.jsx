import { useState, useRef, useEffect } from 'react';
import { Button, Form, Input, Switch, List, Avatar } from 'antd';
import {
  UserOutlined, LockOutlined, BellOutlined, CameraOutlined,
  MobileOutlined, MailOutlined, SafetyOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import api from '../../../api/axios.js';
import { fmtDate } from './constants.js';

export default function SettingsTab({
  profile, devices = [], onProfileUpdate, onDevicesRefresh, onNotificationSettingsChange,
}) {
  const user = profile?.user || {};
  const [profileForm] = Form.useForm();
  const [passForm]    = Form.useForm();
  const fileRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState(user.image || '');
  const [uploadingImg, setUploadingImg] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [savingP, setSavingP] = useState(false);
  const [notifs, setNotifs]   = useState(
    profile?.notificationSettings || { order: true, wallet: true, flash: false, landing: true }
  );

  useEffect(() => {
    setAvatarUrl(user.image || '');
  }, [user.image]);

  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('শুধু ছবির ফাইল গ্রহণযোগ্য');
      return;
    }
    if (file.size > 1.5 * 1024 * 1024) {
      toast.error('ছবি সর্বোচ্চ ১.৫MB হতে হবে');
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result;
      setAvatarUrl(dataUrl);
      setUploadingImg(true);
      try {
        const res = await api.put('/auth/profile', { image: dataUrl });
        onProfileUpdate?.({ ...profile, user: { ...user, ...(res.data?.user || { image: dataUrl }) } });
        toast.success('প্রোফাইল ছবি আপডেট হয়েছে');
      } catch (err) {
        toast.error(err.response?.data?.message || 'ছবি আপলোড ব্যর্থ');
        setAvatarUrl(user.image || '');
      } finally {
        setUploadingImg(false);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveDevice = async (id) => {
    try {
      await api.delete(`/profile/devices/${id}`);
      toast.success('ডিভাইস সরানো হয়েছে');
      await onDevicesRefresh?.();
    } catch (e) {
      toast.error(e.response?.data?.message || 'সরাতে ব্যর্থ');
    }
  };

  const handleProfileSave = async () => {
    const vals = await profileForm.validateFields();
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', vals);
      onProfileUpdate?.({ ...profile, user: { ...user, ...(res.data?.user || vals) } });
      toast.success('প্রোফাইল আপডেট হয়েছে');
    } catch (e) {
      toast.error(e.response?.data?.message || 'আপডেট ব্যর্থ');
    } finally { setSaving(false); }
  };

  const handlePassSave = async () => {
    const vals = await passForm.validateFields();
    if (vals.newPass !== vals.confirmPass) { toast.error('পাসওয়ার্ড মিলছে না'); return; }
    setSavingP(true);
    try {
      await api.put('/auth/change-password', { oldPassword: vals.oldPass, newPassword: vals.newPass });
      toast.success('পাসওয়ার্ড পরিবর্তন হয়েছে');
      passForm.resetFields();
    } catch (e) {
      toast.error(e.response?.data?.message || 'পরিবর্তন ব্যর্থ');
    } finally { setSavingP(false); }
  };

  const Section = ({ icon, title, children }) => (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-orange-500 text-base sm:text-lg">{icon}</span>
        <h3 className="font-bold text-gray-900 text-sm sm:text-base">{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-5">

      {/* Profile info */}
      <Section icon={<UserOutlined />} title="প্রোফাইল তথ্য">
        {/* Avatar */}
        <div className="flex items-center gap-3 sm:gap-4 mb-5">
          <div className="relative flex-shrink-0">
            <Avatar
              size={60}
              src={avatarUrl || undefined}
              style={{ background: 'linear-gradient(135deg,#f97316,#ef4444)', fontSize: 24, fontWeight: 700 }}
            >
              {(user.name || 'C').charAt(0).toUpperCase()}
            </Avatar>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
            <button
              type="button"
              disabled={uploadingImg}
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center shadow-md hover:bg-orange-600 transition disabled:opacity-60"
            >
              <CameraOutlined className="text-white text-[10px]" />
            </button>
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm sm:text-base">{user.name || 'Customer'}</p>
            <p className="text-gray-400 text-xs">{user.phonenumber || ''}</p>
          </div>
        </div>

        <Form
          form={profileForm}
          layout="vertical"
          initialValues={{ name: user.name, phonenumber: user.phonenumber, email: user.email }}
          size="middle"
        >
          {/* 1 col on mobile, 2 col on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 sm:gap-4">
            <Form.Item label="পূর্ণ নাম" name="name" rules={[{ required: true }]}>
              <Input prefix={<UserOutlined />} className="rounded-xl" />
            </Form.Item>
            <Form.Item label="ফোন নম্বর" name="phonenumber">
              <Input prefix={<MobileOutlined />} className="rounded-xl" disabled />
            </Form.Item>
          </div>
          <Form.Item label="ইমেইল" name="email">
            <Input prefix={<MailOutlined />} className="rounded-xl" />
          </Form.Item>
          <Button
            type="primary"
            loading={saving}
            onClick={handleProfileSave}
            className="rounded-xl bg-orange-500 border-orange-500 font-semibold w-full sm:w-auto"
          >
            সংরক্ষণ করুন
          </Button>
        </Form>
      </Section>

      {/* Password */}
      <Section icon={<LockOutlined />} title="পাসওয়ার্ড পরিবর্তন">
        <Form form={passForm} layout="vertical" size="middle">
          <Form.Item label="বর্তমান পাসওয়ার্ড" name="oldPass" rules={[{ required: true }]}>
            <Input.Password className="rounded-xl" />
          </Form.Item>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 sm:gap-4">
            <Form.Item label="নতুন পাসওয়ার্ড" name="newPass" rules={[{ required: true, min: 6 }]}>
              <Input.Password className="rounded-xl" />
            </Form.Item>
            <Form.Item label="নিশ্চিত করুন" name="confirmPass" rules={[{ required: true }]}>
              <Input.Password className="rounded-xl" />
            </Form.Item>
          </div>
          <Button
            type="primary"
            danger
            loading={savingP}
            onClick={handlePassSave}
            className="rounded-xl font-semibold w-full sm:w-auto"
          >
            পাসওয়ার্ড আপডেট
          </Button>
        </Form>
      </Section>

      {/* Notifications */}
      <Section icon={<BellOutlined />} title="নোটিফিকেশন সেটিং">
        <div className="space-y-3">
          {[
            { key: 'order',   label: 'অর্ডার আপডেট',         desc: 'শিপমেন্ট ও ডেলিভারি' },
            { key: 'wallet',  label: 'ওয়ালেট আপডেট',        desc: 'ক্রেডিট, ডেবিট ও ক্যাশব্যাক' },
            { key: 'flash',   label: 'ফ্ল্যাশ সেল অ্যালার্ট', desc: 'নতুন ডিল ও অফার' },
            { key: 'landing', label: 'ল্যান্ডিং পেজ স্ট্যাটাস', desc: 'অ্যাপ্রুভাল নোটিফিকেশন' },
          ].map((n) => (
            <div key={n.key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="min-w-0 pr-3">
                <p className="text-xs sm:text-sm font-semibold text-gray-800">{n.label}</p>
                <p className="text-[10px] sm:text-xs text-gray-400">{n.desc}</p>
              </div>
              <Switch
                checked={notifs[n.key]}
                onChange={async (v) => {
                  const next = { ...notifs, [n.key]: v };
                  setNotifs(next);
                  try {
                    await onNotificationSettingsChange?.(next);
                  } catch {
                    setNotifs(notifs);
                  }
                }}
                style={notifs[n.key] ? { background: '#f97316' } : {}}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Device history */}
      <Section icon={<SafetyOutlined />} title="লগইন ডিভাইস ইতিহাস">
        <List
          locale={{ emptyText: 'কোনো ডিভাইস রেকর্ড নেই' }}
          dataSource={devices}
          renderItem={(d) => (
            <List.Item className="px-0">
              <div className="flex items-center justify-between w-full gap-3">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{d.name}</p>
                  <p className="text-[10px] sm:text-xs text-gray-400">
                    IP: {d.ip || '—'} · {fmtDate(d.date)}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {d.current
                    ? <span className="bg-green-100 text-green-700 text-[10px] font-semibold px-2 py-1 rounded-full">বর্তমান</span>
                    : (
                      <Button size="small" danger className="rounded-xl text-[10px]" onClick={() => handleRemoveDevice(d.id)}>
                        সরান
                      </Button>
                    )}
                </div>
              </div>
            </List.Item>
          )}
        />
      </Section>
    </div>
  );
}
