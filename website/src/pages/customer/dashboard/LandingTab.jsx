import { Button } from "antd";

const SUPPORT_PHONE = "01757121627";
const WHATSAPP_NUMBER = "8801757121627";

export default function LandingTab() {
  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">📄</span>
          </div>
          <h3 className="font-bold text-gray-900 text-sm sm:text-base">
            ল্যান্ডিং পেজ
          </h3>
          <p className="text-[11px] sm:text-xs text-gray-500 mt-1">
            যদি ল্যান্ডিং পেজ ওপেন করতে চান তাহলে ওয়েবসাইট এর অথরিটির সাথে
            যোগাযোগ করুন
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-4">
          <Button
            href={`tel:${SUPPORT_PHONE}`}
            type="primary"
            size="large"
            className="rounded-xl bg-orange-500 border-orange-500 font-semibold"
          >
            📞 কল করুন
          </Button>
          <Button
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            size="large"
            className="rounded-xl bg-emerald-600 border-emerald-600 text-white font-semibold hover:!bg-emerald-500 hover:!border-emerald-500"
          >
            💬 WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}
