import { useState } from 'react';
import { Card, Button, Modal, Form, Input, Select, Tag, Empty } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EnvironmentOutlined, CheckCircleFilled } from '@ant-design/icons';
import { toast } from 'react-toastify';
import api from '../../../api/axios.js';
import {
  getDivisions, getDistrictsByDivision, getUpazilasByDistrict,
  getDivisionById, getDistrictById, getUpazilaById, locationLabel,
} from '../../../utils/bdGeo.js';

function enrichAddress(addr) {
  const divName = addr.divName || locationLabel(getDivisionById(addr.division));
  const distName = addr.distName || locationLabel(getDistrictById(addr.district));
  const thanaName = addr.thanaName || locationLabel(getUpazilaById(addr.thana));
  return { ...addr, divName, distName, thanaName };
}

function withGeoNames(vals, divisions, districts, upazilas) {
  const divObj = divisions.find((d) => String(d.id) === String(vals.division));
  const distObj = districts.find((d) => String(d.id) === String(vals.district));
  const upObj = upazilas.find((u) => String(u.id) === String(vals.thana));
  return {
    ...vals,
    divName: locationLabel(divObj),
    distName: locationLabel(distObj),
    thanaName: locationLabel(upObj),
  };
}

export default function AddressTab({ addresses = [], onRefresh }) {
  const list = addresses.map(enrichAddress);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [divId, setDivId] = useState('');
  const [distId, setDistId] = useState('');

  const divisions = getDivisions();
  const districts = divId ? getDistrictsByDivision(divId) : [];
  const upazilas = distId ? getUpazilasByDistrict(distId) : [];

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    setDivId('');
    setDistId('');
    setOpen(true);
  };

  const openEdit = (addr) => {
    setEditing(addr);
    setDivId(addr.division);
    setDistId(addr.district);
    form.setFieldsValue({
      label: addr.label,
      address: addr.address,
      area: addr.area,
      division: addr.division,
      district: addr.district,
      thana: addr.thana,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    const vals = await form.validateFields();
    const payload = withGeoNames(vals, divisions, districts, upazilas);
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/profile/addresses/${editing.id}`, payload);
        toast.success('ঠিকানা আপডেট হয়েছে');
      } else {
        await api.post('/profile/addresses', payload);
        toast.success('ঠিকানা যোগ হয়েছে');
      }
      setOpen(false);
      await onRefresh?.();
    } catch (e) {
      toast.error(e.response?.data?.message || 'সংরক্ষণ ব্যর্থ');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/profile/addresses/${id}`);
      toast.success('ঠিকানা মুছে ফেলা হয়েছে');
      await onRefresh?.();
    } catch (e) {
      toast.error(e.response?.data?.message || 'মুছতে ব্যর্থ');
    }
  };

  const handleDefault = async (id) => {
    try {
      await api.patch(`/profile/addresses/${id}/default`);
      await onRefresh?.();
    } catch (e) {
      toast.error(e.response?.data?.message || 'ডিফল্ট সেট ব্যর্থ');
    }
  };

  return (
    <div className="space-y-5">
      
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 text-lg">আমার ঠিকানাসমূহ</h3>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd} className="rounded-xl bg-orange-500 border-orange-500 font-semibold">
          নতুন ঠিকানা
        </Button>
      </div>
      {list.length === 0 ? (
        <Card className="rounded-2xl border-0 shadow-sm">
          <Empty description="কোনো ঠিকানা নেই" image={Empty.PRESENTED_IMAGE_SIMPLE}>
            <Button type="primary" onClick={openAdd} className="bg-orange-500 border-orange-500 rounded-xl">যোগ করুন</Button>
          </Empty>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {list.map((a) => (
            <div key={a.id} className={`relative rounded-2xl border-2 p-4 transition-all ${a.isDefault ? 'border-orange-400 bg-orange-50/60' : 'border-gray-200 bg-white hover:border-orange-200'}`}>
              {a.isDefault && (
                <div className="absolute top-3 right-3">
                  <Tag color="orange" icon={<CheckCircleFilled />} className="text-[10px]">ডিফল্ট</Tag>
                </div>
              )}
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.isDefault ? 'bg-orange-500' : 'bg-gray-200'}`}>
                  <EnvironmentOutlined className={a.isDefault ? 'text-white' : 'text-gray-500'} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-gray-800">{a.label}</span>
                  </div>
                  <p className="text-sm text-gray-600">{a.address}</p>
                  {a.area && <p className="text-xs text-gray-400 mt-0.5">{a.area}</p>}
                  <p className="text-xs text-gray-400 mt-0.5">{[a.thanaName, a.distName, a.divName].filter(Boolean).join(', ')}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                {!a.isDefault && (
                  <Button size="small" onClick={() => handleDefault(a.id)} className="rounded-xl text-xs flex-1">ডিফল্ট করুন</Button>
                )}
                <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(a)} className="rounded-xl text-xs flex-1">এডিট</Button>
                <Button size="small" icon={<DeleteOutlined />} danger onClick={() => handleDelete(a.id)} className="rounded-xl text-xs"><span className="hidden sm:inline">ডিলিট</span></Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal title={editing ? 'ঠিকানা এডিট করুন' : 'নতুন ঠিকানা যোগ করুন'} open={open} onCancel={() => setOpen(false)} onOk={handleSave} okText="সংরক্ষণ করুন" cancelText="বাতিল" centered confirmLoading={saving} okButtonProps={{ className: 'bg-orange-500 border-orange-500 rounded-xl' }}>
        <Form form={form} layout="vertical" className="mt-4 space-y-1">
          <Form.Item label="লেবেল (যেমন: বাড়ি, অফিস)" name="label" rules={[{ required: true }]}>
            <Input className="rounded-xl" placeholder="বাড়ি" />
          </Form.Item>
          <Form.Item label="সম্পূর্ণ ঠিকানা" name="address" rules={[{ required: true }]}>
            <Input.TextArea className="rounded-xl" rows={2} placeholder="বাড়ি নম্বর, রোড, এলাকা..." />
          </Form.Item>
          <Form.Item label="এলাকা" name="area">
            <Input className="rounded-xl" placeholder="মিরপুর-১০" />
          </Form.Item>
          <Form.Item label="বিভাগ" name="division" rules={[{ required: true }]}>
            <Select className="rounded-xl" placeholder="বিভাগ নির্বাচন করুন" onChange={(v) => { setDivId(v); setDistId(''); form.setFieldsValue({ district: undefined, thana: undefined }); }}>
              {divisions.map((d) => <Select.Option key={d.id} value={d.id}>{locationLabel(d)}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item label="জেলা" name="district" rules={[{ required: true }]}>
            <Select className="rounded-xl" placeholder="জেলা নির্বাচন করুন" disabled={!divId} onChange={(v) => { setDistId(v); form.setFieldsValue({ thana: undefined }); }}>
              {districts.map((d) => <Select.Option key={d.id} value={d.id}>{locationLabel(d)}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item label="থানা/উপজেলা" name="thana" rules={[{ required: true }]}>
            <Select className="rounded-xl" placeholder="থানা নির্বাচন করুন" disabled={!distId}>
              {upazilas.map((u) => <Select.Option key={u.id} value={u.id}>{locationLabel(u)}</Select.Option>)}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
}
