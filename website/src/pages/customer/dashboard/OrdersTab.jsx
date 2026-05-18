import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Table, Tag, Button, Input, Select, DatePicker, Space,
  Drawer, Image, Steps, Descriptions, Tooltip, Popconfirm,
} from 'antd';
import {
  SearchOutlined, DownloadOutlined, ReloadOutlined,
  CloseCircleOutlined, EyeOutlined, CarOutlined, FilterOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import api from '../../../api/axios.js';
import { fmtBDT, fmtDate, STATUS_COLOR } from './constants.js';

const { RangePicker } = DatePicker;
const { Option } = Select;

const STEPS = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
const stepIdx = (s) => ({ pending:0, confirmed:1, processing:2, shipped:3, delivered:4 }[s?.toLowerCase()] ?? 0);
const canCancel = (status) => ['pending', 'confirmed', 'processing'].includes(status?.toLowerCase());

function MobileCard({ r, onDetail, onInvoice, onTrack, onReorder, onCancel, cancelling }) {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-3 sm:p-4 space-y-3">
      <div className="flex items-start gap-3">
        <Image src={r.image} width={50} height={50} className="rounded-xl object-cover flex-shrink-0" preview={false} fallback="https://placehold.co/50" />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-gray-800 truncate">{r.product}</p>
          <p className="text-xs text-gray-400 truncate">{r.variation} · {r.qty}টি</p>
          <p className="text-[10px] text-gray-400 font-mono mt-0.5">{r.orderNumber || r.id}</p>
        </div>
        <p className="font-bold text-orange-600 text-sm flex-shrink-0">{fmtBDT(r.price)}</p>
      </div>
      <div className="flex flex-wrap gap-1">
        <Tag color={STATUS_COLOR[r.paymentStatus]} className="text-[10px]">{r.paymentStatus}</Tag>
        <Tag color={STATUS_COLOR[r.deliveryStatus]} className="text-[10px]">{r.deliveryStatus}</Tag>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button size="small" icon={<EyeOutlined />} onClick={() => onDetail(r)} className="rounded-xl text-[11px]">বিস্তারিত</Button>
        <Button size="small" icon={<DownloadOutlined />} onClick={() => onInvoice(r)} className="rounded-xl text-[11px]">ইনভয়েস</Button>
        <Button size="small" icon={<CarOutlined />} onClick={() => onTrack(r)} className="rounded-xl text-[11px]">ট্র্যাক</Button>
        <Button size="small" icon={<ReloadOutlined />} onClick={() => onReorder(r)} className="rounded-xl text-[11px]">রিঅর্ডার</Button>
        {canCancel(r.status) && (
          <Popconfirm title="অর্ডার বাতিল করবেন?" onConfirm={() => onCancel(r)} okText="হ্যাঁ" cancelText="না">
            <Button size="small" icon={<CloseCircleOutlined />} danger loading={cancelling === r.id} className="rounded-xl text-[11px] col-span-2">ক্যান্সেল</Button>
          </Popconfirm>
        )}
      </div>
    </div>
  );
}

export default function OrdersTab({ orders = [], onRefresh }) {
  const navigate = useNavigate();
  const all = orders;
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('all');
  const [drawer, setDrawer] = useState(null);
  const [cancelling, setCancelling] = useState(null);
  const [reordering, setReordering] = useState(null);

  const filtered = all.filter((o) => {
    const q = search.toLowerCase();
    const qOk = !q || (o.orderNumber||o.id)?.toLowerCase().includes(q) || o.product?.toLowerCase().includes(q);
    const sOk = statusF === 'all' || o.status === statusF;
    return qOk && sOk;
  });

  const openInvoice = (order) => navigate(`/invoice?id=${order.id}`);
  const openTrack = (order) => navigate(`/track-order?id=${order.id}&orderNumber=${encodeURIComponent(order.orderNumber || '')}`);

  const handleReorder = async (order) => {
    const items = order.items || [];
    if (!items.length) { toast.error('পণ্য পাওয়া যায়নি'); return; }
    setReordering(order.id);
    try {
      for (const it of items) {
        await api.post('/cart/items', {
          productId: it.productId, variationId: it.variationId || null,
          name: it.name, image: it.image || '', price: it.price,
          variationLabel: it.variationLabel || it.variation || '', qty: it.qty || 1,
        });
      }
      toast.success('কার্টে যোগ হয়েছে');
      navigate('/cart');
    } catch (e) {
      toast.error(e.response?.data?.message || 'রিঅর্ডার ব্যর্থ');
    } finally { setReordering(null); }
  };

  const handleCancel = async (order) => {
    setCancelling(order.id);
    try {
      await api.patch(`/orders/${order.id}/cancel`);
      toast.success('অর্ডার বাতিল হয়েছে');
      setDrawer(null);
      await onRefresh?.();
    } catch (e) {
      toast.error(e.response?.data?.message || 'বাতিল ব্যর্থ');
    } finally { setCancelling(null); }
  };

  const columns = [
    { title: 'অর্ডার', key: 'order', fixed: 'left', width: 180, render: (_, r) => (
      <div className="flex items-center gap-2">
        <Image src={r.image} width={40} height={40} className="rounded-xl object-cover" preview={false} />
        <div className="min-w-0">
          <p className="text-xs font-bold text-gray-800 truncate max-w-[100px]">{r.orderNumber||r.id}</p>
          <p className="text-[10px] text-gray-400 truncate max-w-[100px]">{r.product}</p>
        </div>
      </div>
    )},
    { title: 'পরিমাণ', dataIndex: 'qty', width: 60, render: (v) => <span className="text-sm font-semibold">{v}</span> },
    { title: 'মূল্য', dataIndex: 'price', width: 90, render: (v) => <span className="text-sm font-bold text-orange-600">{fmtBDT(v||0)}</span> },
    { title: 'পেমেন্ট', dataIndex: 'paymentStatus', width: 90, render: (v) => <Tag color={STATUS_COLOR[v]||'default'} className="text-[10px]">{v}</Tag> },
    { title: 'ডেলিভারি', dataIndex: 'deliveryStatus', width: 90, render: (v) => <Tag color={STATUS_COLOR[v]||'default'} className="text-[10px]">{v}</Tag> },
    { title: 'তারিখ', key: 'date', width: 90, render: (_, r) => <span className="text-xs text-gray-400">{fmtDate(r.date||r.createdAt)}</span> },
    { title: 'অ্যাকশন', key: 'action', width: 130, fixed: 'right', render: (_, r) => (
      <Space size={4} wrap>
        <Tooltip title="বিস্তারিত"><Button size="small" icon={<EyeOutlined />} onClick={() => setDrawer(r)} className="rounded-lg" /></Tooltip>
        <Tooltip title="ইনভয়েস"><Button size="small" icon={<DownloadOutlined />} onClick={() => openInvoice(r)} className="rounded-lg" /></Tooltip>
        <Tooltip title="ট্র্যাক"><Button size="small" icon={<CarOutlined />} onClick={() => openTrack(r)} className="rounded-lg" /></Tooltip>
        <Tooltip title="রিঅর্ডার"><Button size="small" icon={<ReloadOutlined />} loading={reordering === r.id} onClick={() => handleReorder(r)} className="rounded-lg" /></Tooltip>
      </Space>
    )},
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
          <Input prefix={<SearchOutlined className="text-gray-400" />} placeholder="অর্ডার বা পণ্য খুঁজুন..." value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-xl" />
          <Select value={statusF} onChange={setStatusF} className="rounded-xl" style={{ width: 150 }} suffixIcon={<FilterOutlined />}>
            <Option value="all">সব স্ট্যাটাস</Option>
            <Option value="pending">Pending</Option>
            <Option value="confirmed">Confirmed</Option>
            <Option value="processing">Processing</Option>
            <Option value="shipped">Shipped</Option>
            <Option value="delivered">Delivered</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>
        </div>
      </div>
      <div className="hidden sm:block">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <Table dataSource={filtered} columns={columns} rowKey="id" pagination={{ pageSize: 8, showSizeChanger: false, size: 'small' }} scroll={{ x: 800 }} size="small" locale={{ emptyText: 'কোনো অর্ডার নেই' }} />
        </div>
      </div>
      <div className="sm:hidden space-y-3">
        {filtered.length === 0 ? <div className="text-center py-10 text-gray-400 text-sm">কোনো অর্ডার পাওয়া যায়নি</div> : filtered.map((r) => (
          <MobileCard key={r.id} r={r} onDetail={setDrawer} onInvoice={openInvoice} onTrack={openTrack} onReorder={handleReorder} onCancel={handleCancel} cancelling={cancelling} />
        ))}
      </div>
      <Drawer title={<span className="font-bold text-sm">অর্ডার বিস্তারিত — {drawer?.orderNumber||drawer?.id}</span>} open={!!drawer} onClose={() => setDrawer(null)} width="min(480px, 100vw)">
        {drawer && (
          <div className="space-y-5">
            <Steps current={stepIdx(drawer.status)} size="small" items={STEPS.map((l) => ({ title: <span className="text-[10px]">{l}</span> }))} />
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-2xl">
              <Image src={drawer.image} width={56} height={56} className="rounded-xl object-cover flex-shrink-0" />
              <div>
                <p className="font-bold text-gray-800 text-sm">{drawer.product}</p>
                <p className="text-xs text-gray-500">{drawer.variation} · {drawer.qty}টি</p>
                <p className="text-base font-bold text-orange-600 mt-1">{fmtBDT(drawer.price)}</p>
              </div>
            </div>
            <Descriptions column={1} size="small" bordered labelStyle={{ fontWeight: 600, width: 120, fontSize: 12 }}>
              <Descriptions.Item label="অর্ডার আইডি">{drawer.orderNumber||drawer.id}</Descriptions.Item>
              <Descriptions.Item label="তারিখ">{fmtDate(drawer.date||drawer.createdAt)}</Descriptions.Item>
              <Descriptions.Item label="পেমেন্ট"><Tag color={STATUS_COLOR[drawer.paymentStatus]}>{drawer.paymentStatus}</Tag></Descriptions.Item>
              <Descriptions.Item label="ডেলিভারি"><Tag color={STATUS_COLOR[drawer.deliveryStatus]}>{drawer.deliveryStatus}</Tag></Descriptions.Item>
            </Descriptions>
            <div className="grid grid-cols-2 gap-2">
              <Button block icon={<DownloadOutlined />} onClick={() => openInvoice(drawer)} className="rounded-xl text-xs">ইনভয়েস</Button>
              <Button block icon={<CarOutlined />} onClick={() => openTrack(drawer)} className="rounded-xl text-xs">ট্র্যাক</Button>
              <Button block icon={<ReloadOutlined />} type="primary" loading={reordering === drawer.id} onClick={() => handleReorder(drawer)} className="rounded-xl bg-orange-500 border-orange-500 text-xs">রিঅর্ডার</Button>
              {canCancel(drawer.status) ? (
                <Popconfirm title="অর্ডার বাতিল করবেন?" onConfirm={() => handleCancel(drawer)} okText="হ্যাঁ" cancelText="না">
                  <Button block icon={<CloseCircleOutlined />} danger loading={cancelling === drawer.id} className="rounded-xl text-xs">ক্যান্সেল</Button>
                </Popconfirm>
              ) : <Button block disabled className="rounded-xl text-xs">ক্যান্সেল</Button>}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
