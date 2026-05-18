import { useState } from "react";
import {
  Button,
  Tag,
  Form,
  Input,
  Select,
  Collapse,
  List,
  Empty,
  Modal,
} from "antd";
import {
  CustomerServiceOutlined,
  QuestionCircleOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import api from "../../../api/axios.js";
import { fmtDate } from "./constants.js";

const FAQ = [
  {
    q: "কীভাবে অর্ডার ট্র্যাক করব?",
    a: '"আমার অর্ডার" পেজ থেকে ট্র্যাক বাটনে ক্লিক করুন।',
  },
  {
    q: "পেমেন্ট ব্যর্থ হলে কী করব?",
    a: "ওয়ালেট বা বিকাশ দিয়ে পুনরায় চেষ্টা করুন।",
  },
  {
    q: "রিটার্ন পলিসি কী?",
    a: "ডেলিভারির ৭ দিনের মধ্যে রিটার্ন রিকোয়েস্ট দেওয়া যাবে।",
  },
  {
    q: "ক্যাশব্যাক কখন পাব?",
    a: "অর্ডার ডেলিভারির ২৪ ঘন্টার মধ্যে ওয়ালেটে যোগ হবে।",
  },
];

const STATUS_ICON = {
  open: <ClockCircleOutlined className="text-orange-500" />,
  resolved: <CheckCircleOutlined className="text-green-500" />,
};
const STATUS_COLOR = { open: "orange", resolved: "green" };

export default function SupportTab({ tickets = [], onRefresh }) {
  const [newOpen, setNewOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then(async (vals) => {
      setSubmitting(true);
      try {
        await api.post("/profile/support-tickets", vals);
        toast.success("টিকিট জমা হয়েছে");
        form.resetFields();
        setNewOpen(false);
        await onRefresh?.();
      } catch (e) {
        toast.error(e.response?.data?.message || "জমা দিতে ব্যর্থ");
      } finally {
        setSubmitting(false);
      }
    });
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <CustomerServiceOutlined className="text-orange-500 text-base sm:text-lg" />
          <h3 className="font-bold text-gray-900 text-sm sm:text-base">
            সাপোর্ট সেন্টার
          </h3>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="small"
          onClick={() => setNewOpen(true)}
          className="rounded-xl bg-orange-500 border-orange-500 text-xs"
        >
          নতুন টিকিট
        </Button>
      </div>

      {/* Tickets */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="px-4 sm:px-5 pt-4 pb-2 text-sm font-semibold text-gray-800">
          আমার টিকিটসমূহ
        </div>
        {tickets.length === 0 ? (
          <div className="px-5 pb-5">
            <Empty
              description="কোনো টিকিট নেই"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        ) : (
          <List
            dataSource={tickets}
            renderItem={(t) => (
              <List.Item className="px-4 sm:px-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between w-full gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                      {STATUS_ICON[t.status]}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-xs sm:text-sm text-gray-800 truncate">
                        {t.subject}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {t.id} · {t.category} · {fmtDate(t.date)}
                      </p>
                    </div>
                  </div>
                  <Tag
                    color={STATUS_COLOR[t.status]}
                    className="text-[10px] flex-shrink-0"
                  >
                    {t.status}
                  </Tag>
                </div>
              </List.Item>
            )}
          />
        )}
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <QuestionCircleOutlined className="text-orange-500" />
          <h3 className="font-bold text-gray-900 text-xs sm:text-sm">
            সাধারণ প্রশ্নোত্তর (FAQ)
          </h3>
        </div>
        <Collapse
          ghost
          expandIconPosition="end"
          items={FAQ.map((f, i) => ({
            key: i,
            label: (
              <span className="font-medium text-gray-800 text-xs sm:text-sm">
                {f.q}
              </span>
            ),
            children: (
              <p className="text-xs sm:text-sm text-gray-600 pl-2">{f.a}</p>
            ),
          }))}
        />
      </div>

      {/* New ticket modal */}
      <Modal
        title="নতুন সাপোর্ট টিকিট"
        open={newOpen}
        onCancel={() => setNewOpen(false)}
        onOk={handleSubmit}
        confirmLoading={submitting}
        okText="সাবমিট"
        cancelText="বাতিল"
        centered
        width="min(480px, 95vw)"
        okButtonProps={{
          className: "bg-orange-500 border-orange-500 rounded-xl",
        }}
      >
        <Form form={form} layout="vertical" className="mt-3" size="middle">
          <Form.Item
            label="ক্যাটেগরি"
            name="category"
            rules={[{ required: true }]}
          >
            <Select className="rounded-xl" placeholder="বিষয় নির্বাচন">
              <Select.Option value="Delivery">ডেলিভারি</Select.Option>
              <Select.Option value="Product">পণ্য</Select.Option>
              <Select.Option value="Payment">পেমেন্ট</Select.Option>
              <Select.Option value="Other">অন্যান্য</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="বিষয়" name="subject" rules={[{ required: true }]}>
            <Input className="rounded-xl" placeholder="সমস্যার সারসংক্ষেপ..." />
          </Form.Item>
          <Form.Item
            label="বিস্তারিত"
            name="description"
            rules={[{ required: true }]}
          >
            <Input.TextArea
              className="rounded-xl"
              rows={3}
              placeholder="সমস্যা বিস্তারিত লিখুন..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
