import { useState } from "react";
import {
  Statistic,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Table,
  Tag,
  Typography,
} from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { fmtBDT, fmtDate } from "./constants.js";

const { Title } = Typography;

const METHODS = [
  { id: "bkash", label: "bKash", emoji: "📱" },
  { id: "nagad", label: "Nagad", emoji: "💳" },
  { id: "rocket", label: "Rocket", emoji: "🚀" },
  { id: "card", label: "Card", emoji: "💳" },
];

export default function WalletTab({ wallet, onRefresh }) {
  const balance = wallet?.balance ?? 0;
  const cashback = wallet?.cashback ?? 0;
  const transactions = wallet?.transactions ?? [];
  const chartData = wallet?.chart ?? [];
  const [addOpen, setAddOpen] = useState(false);
  const [wdOpen, setWdOpen] = useState(false);
  const [addForm] = Form.useForm();
  const [wdForm] = Form.useForm();

  const txnCols = [
    {
      title: "বিবরণ",
      dataIndex: "label",
      key: "label",
      render: (v, r) => (
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs ${r.type === "credit" ? "bg-green-500" : "bg-red-500"}`}
          >
            {r.type === "credit" ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
          </div>
          <span className="text-xs sm:text-sm">{v}</span>
        </div>
      ),
    },
    {
      title: "তারিখ",
      dataIndex: "date",
      key: "date",
      responsive: ["sm"],
      render: (v) => (
        <span className="text-xs text-gray-400">{fmtDate(v)}</span>
      ),
    },
    {
      title: "পরিমাণ",
      dataIndex: "amount",
      key: "amount",
      align: "right",
      render: (v, r) => (
        <span
          className={`text-xs sm:text-sm font-bold ${r.type === "credit" ? "text-green-600" : "text-red-500"}`}
        >
          {r.type === "credit" ? "+" : "-"}
          {fmtBDT(v)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Balance hero */}
      <div
        className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)",
        }}
      >
        <div className="absolute -top-8 -right-8 w-36 sm:w-48 h-36 sm:h-48 bg-orange-500/20 rounded-full blur-3xl" />
        <p className="text-white/60 text-xs sm:text-sm mb-1">মোট ব্যালেন্স</p>
        <p className="text-white text-3xl sm:text-4xl font-black">
          {fmtBDT(balance)}
        </p>
        <p className="text-yellow-400 text-xs mt-1">
          ক্যাশব্যাক: {fmtBDT(cashback)}
        </p>
        <div className="flex gap-3 mt-4">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="small"
            onClick={() => setAddOpen(true)}
            className="rounded-xl bg-orange-500 border-orange-500 font-semibold text-xs sm:text-sm"
          >
            টপ আপ
          </Button>
          <Button
            icon={<ArrowUpOutlined />}
            size="small"
            onClick={() => setWdOpen(true)}
            ghost
            className="rounded-xl border-white/30 text-white text-xs sm:text-sm"
          >
            উইথড্র
          </Button>
        </div>
      </div>

      {/* Stats — 3 cols always */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {[
          {
            label: "এ মাসে যোগ",
            value: wallet?.addedThisMonth ?? 0,
            color: "#16a34a",
          },
          {
            label: "এ মাসে খরচ",
            value: wallet?.spentThisMonth ?? 0,
            color: "#ef4444",
          },
          {
            label: "পেন্ডিং উইথড্র",
            value: wallet?.pendingWithdraw ?? 0,
            color: "#f59e0b",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm text-center"
          >
            <p className="text-[10px] sm:text-xs text-gray-500 mb-1">
              {s.label}
            </p>
            <p
              className="font-bold text-sm sm:text-lg"
              style={{ color: s.color }}
            >
              {fmtBDT(s.value)}
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-5">
        <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-3">
          এই সপ্তাহের ব্যালেন্স
        </p>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="wg2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip formatter={(v) => [`৳${v}`, "ব্যালেন্স"]} />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#f97316"
              strokeWidth={2.5}
              fill="url(#wg2)"
              dot={{ r: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Transaction table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="px-4 sm:px-5 pt-4 sm:pt-5 pb-2">
          <h3 className="font-bold text-gray-900 text-sm sm:text-base">
            ট্রানজেকশন ইতিহাস
          </h3>
        </div>
        <Table
          dataSource={transactions}
          columns={txnCols}
          rowKey="id"
          pagination={false}
          size="small"
          locale={{ emptyText: "কোনো ট্রানজেকশন নেই" }}
        />
      </div>

      {/* Add money modal */}
      <Modal
        title="ওয়ালেটে টাকা যোগ"
        open={addOpen}
        onCancel={() => setAddOpen(false)}
        footer={null}
        centered
      >
        <Form form={addForm} layout="vertical" className="mt-4">
          <Form.Item
            label="পরিমাণ (৳)"
            name="amount"
            rules={[{ required: true }]}
          >
            <Input
              prefix="৳"
              type="number"
              className="rounded-xl"
              placeholder="500"
            />
          </Form.Item>
          <Form.Item label="পদ্ধতি" name="method" rules={[{ required: true }]}>
            <Select className="rounded-xl" placeholder="নির্বাচন করুন">
              {METHODS.map((m) => (
                <Select.Option key={m.id} value={m.id}>
                  {m.emoji} {m.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Button
            block
            type="primary"
            size="large"
            className="rounded-xl bg-orange-500 border-orange-500 font-bold"
          >
            রিচার্জ করুন
          </Button>
        </Form>
      </Modal>

      {/* Withdraw modal */}
      <Modal
        title="উইথড্র রিকোয়েস্ট"
        open={wdOpen}
        onCancel={() => setWdOpen(false)}
        footer={null}
        centered
      >
        <Form form={wdForm} layout="vertical" className="mt-4">
          <Form.Item label="পরিমাণ (৳)" name="wa" rules={[{ required: true }]}>
            <Input
              prefix="৳"
              type="number"
              className="rounded-xl"
              placeholder="500"
            />
          </Form.Item>
          <Form.Item
            label="মোবাইল নম্বর"
            name="wp"
            rules={[{ required: true }]}
          >
            <Input className="rounded-xl" placeholder="01XXXXXXXXX" />
          </Form.Item>
          <Form.Item label="পদ্ধতি" name="wm" rules={[{ required: true }]}>
            <Select className="rounded-xl" placeholder="নির্বাচন করুন">
              {METHODS.slice(0, 3).map((m) => (
                <Select.Option key={m.id} value={m.id}>
                  {m.emoji} {m.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Button
            block
            type="primary"
            danger
            size="large"
            className="rounded-xl font-bold"
          >
            রিকোয়েস্ট পাঠান
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
