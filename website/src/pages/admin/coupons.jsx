import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Ticket,
  Copy,
  Check,
  Loader2,
  Percent,
  Banknote,
  Calendar,
  Users,
} from "lucide-react";
import api from "../../api/axios";
import { toast } from "react-toastify";

const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <p className="text-purple-200 text-sm mt-1">{subtitle}</p>
    </div>
    {action}
  </div>
);

const GlassCard = ({ children, className = "" }) => (
  <div
    className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl ${className}`}
  >
    {children}
  </div>
);

const labelClass = "text-sm font-semibold text-purple-200 mb-1.5 block";
const inputClass =
  "w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-400 focus:border-orange-300 focus:ring-2 focus:ring-orange-300/20 outline-none transition-all";

const EMPTY_FORM = {
  code: "",
  description: "",
  type: "percentage",
  value: "",
  maxDiscount: "",
  minOrderAmount: "0",
  usageLimit: "",
  startDate: "",
  endDate: "",
  status: "active",
};

const formatDiscount = (coupon) => {
  if (coupon.type === "percentage") {
    const cap =
      coupon.maxDiscount != null ? ` (max ৳${coupon.maxDiscount})` : "";
    return `${coupon.value}%${cap}`;
  }
  return `৳${coupon.value}`;
};

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getDisplayStatus = (coupon) => {
  if (coupon.status === "inactive") return { key: "inactive", label: "Inactive" };
  if (coupon.isExpired) return { key: "expired", label: "Expired" };
  if (coupon.isScheduled) return { key: "scheduled", label: "Scheduled" };
  if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
    return { key: "exhausted", label: "Limit reached" };
  }
  return { key: "active", label: "Active" };
};

const statusClass = {
  active: "bg-green-400/20 text-green-300 border-green-400/30",
  inactive: "bg-white/10 text-white/50 border-white/10",
  expired: "bg-red-400/20 text-red-300 border-red-400/30",
  scheduled: "bg-blue-400/20 text-blue-300 border-blue-400/30",
  exhausted: "bg-amber-400/20 text-amber-300 border-amber-400/30",
};

const StatusBadge = ({ coupon }) => {
  const { key, label } = getDisplayStatus(coupon);
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusClass[key]}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          key === "active" ? "bg-green-400" : key === "scheduled" ? "bg-blue-400" : "bg-current opacity-60"
        }`}
      />
      {label}
    </span>
  );
};

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [copiedCode, setCopiedCode] = useState("");

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await api.get("/coupons");
      setCoupons(res.data);
    } catch {
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadCoupons = async () => {
      await fetchCoupons();
    };
    loadCoupons();
  }, []);

  const stats = useMemo(() => {
    const active = coupons.filter((c) => getDisplayStatus(c).key === "active").length;
    const expired = coupons.filter((c) => getDisplayStatus(c).key === "expired").length;
    const totalUsed = coupons.reduce((s, c) => s + (c.usedCount || 0), 0);
    return { total: coupons.length, active, expired, totalUsed };
  }, [coupons]);

  const filtered = useMemo(() => {
    return coupons.filter((c) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        c.code.toLowerCase().includes(q) ||
        (c.description || "").toLowerCase().includes(q);
      const display = getDisplayStatus(c).key;
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && display === "active") ||
        (filterStatus === "inactive" && display === "inactive") ||
        (filterStatus === "expired" && display === "expired") ||
        (filterStatus === "scheduled" && display === "scheduled");
      const matchesType = filterType === "all" || c.type === filterType;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [coupons, search, filterStatus, filterType]);

  const resetModal = () => {
    setShowModal(false);
    setEditId(null);
    setFormData({ ...EMPTY_FORM });
  };

  const openCreate = () => {
    setEditId(null);
    setFormData({ ...EMPTY_FORM });
    setShowModal(true);
  };

  const openEdit = (coupon) => {
    setEditId(coupon._id);
    setFormData({
      code: coupon.code || "",
      description: coupon.description || "",
      type: coupon.type || "percentage",
      value: String(coupon.value ?? ""),
      maxDiscount: coupon.maxDiscount != null ? String(coupon.maxDiscount) : "",
      minOrderAmount: String(coupon.minOrderAmount ?? 0),
      usageLimit: coupon.usageLimit != null ? String(coupon.usageLimit) : "",
      startDate: coupon.startDate
        ? new Date(coupon.startDate).toISOString().slice(0, 10)
        : "",
      endDate: coupon.endDate
        ? new Date(coupon.endDate).toISOString().slice(0, 10)
        : "",
      status: coupon.status || "active",
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const code = formData.code.trim().toUpperCase();
    if (!code) {
      toast.error("Coupon code is required");
      return;
    }
    if (!formData.value || Number(formData.value) < 0) {
      toast.error("Enter a valid discount value");
      return;
    }
    if (formData.type === "percentage" && Number(formData.value) > 100) {
      toast.error("Percentage cannot exceed 100");
      return;
    }

    const payload = {
      code,
      description: formData.description,
      type: formData.type,
      value: Number(formData.value),
      maxDiscount: formData.maxDiscount !== "" ? Number(formData.maxDiscount) : null,
      minOrderAmount: Number(formData.minOrderAmount) || 0,
      usageLimit: formData.usageLimit !== "" ? Number(formData.usageLimit) : null,
      startDate: formData.startDate || null,
      endDate: formData.endDate || null,
      status: formData.status,
    };

    try {
      setSubmitting(true);
      if (editId) {
        await api.put(`/coupons/${editId}`, payload);
        toast.success("Coupon updated");
      } else {
        await api.post("/coupons", payload);
        toast.success("Coupon created");
      }
      resetModal();
      fetchCoupons();
    } catch (err) {
      const status = err?.response?.status;
      let message = err?.response?.data?.message;
      if (!message && !err?.response) {
        message = "Cannot reach API. Restart the backend server (npm run dev in /backend).";
      } else if (!message && status === 404) {
        message = "Coupon API not found. Restart the backend server to load new routes.";
      } else if (!message && status === 401) {
        message = "Session expired. Please log in to admin again.";
      }
      toast.error(message || "Failed to save coupon");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?._id) return;
    try {
      await api.delete(`/coupons/${deleteTarget._id}`);
      toast.success("Coupon deleted");
      setDeleteTarget(null);
      fetchCoupons();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete coupon");
    }
  };

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success("Code copied");
      setTimeout(() => setCopiedCode(""), 2000);
    } catch {
      toast.error("Could not copy code");
    }
  };

  return (
    <div className="min-h-screen bg-[#4A1942] p-6 md:p-8 space-y-6">
      <SectionHeader
        title="Coupons"
        subtitle="Create and manage discount codes for checkout"
        action={
          <button
            type="button"
            onClick={openCreate}
            className="px-5 py-2.5 rounded-2xl bg-linear-to-r from-orange-300 to-orange-400 text-[#4A1942] text-sm font-bold shadow-lg shadow-orange-500/20 hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
          >
            <Plus size={18} /> New Coupon
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total coupons", value: stats.total, icon: Ticket, color: "text-orange-300" },
          { label: "Active now", value: stats.active, icon: Check, color: "text-green-300" },
          { label: "Expired", value: stats.expired, icon: Calendar, color: "text-red-300" },
          { label: "Total redemptions", value: stats.totalUsed, icon: Users, color: "text-purple-200" },
        ].map(({ label, value, icon: Icon, color }) => (
          <GlassCard key={label} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-purple-300 uppercase tracking-wider">{label}</p>
                <p className="text-2xl font-bold text-white mt-1">{value}</p>
              </div>
              <Icon className={`w-8 h-8 ${color} opacity-80`} />
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300" size={18} />
          <input
            type="text"
            placeholder="Search by code or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:border-orange-300 focus:ring-2 focus:ring-orange-300/20 outline-none text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:border-orange-300 outline-none"
          >
            <option value="all" className="text-black">All statuses</option>
            <option value="active" className="text-black">Active</option>
            <option value="scheduled" className="text-black">Scheduled</option>
            <option value="expired" className="text-black">Expired</option>
            <option value="inactive" className="text-black">Inactive</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:border-orange-300 outline-none"
          >
            <option value="all" className="text-black">All types</option>
            <option value="percentage" className="text-black">Percentage</option>
            <option value="fixed" className="text-black">Fixed amount</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <GlassCard className="p-12 flex items-center justify-center gap-3 text-purple-200">
          <Loader2 className="animate-spin text-orange-300" size={24} />
          Loading coupons...
        </GlassCard>
      ) : filtered.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <Ticket className="mx-auto text-orange-300/60 mb-4" size={48} />
          <p className="text-white font-semibold">No coupons found</p>
          <p className="text-purple-300 text-sm mt-2">
            {coupons.length === 0
              ? "Create your first coupon to use at checkout."
              : "Try adjusting search or filters."}
          </p>
          {coupons.length === 0 && (
            <button
              type="button"
              onClick={openCreate}
              className="mt-6 px-5 py-2.5 rounded-2xl bg-linear-to-r from-orange-300 to-orange-400 text-[#4A1942] text-sm font-bold"
            >
              Create coupon
            </button>
          )}
        </GlassCard>
      ) : (
        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-225">
              <thead>
                <tr className="text-left text-xs font-semibold text-purple-300 uppercase tracking-wider bg-white/5">
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Discount</th>
                  <th className="px-6 py-4">Min order</th>
                  <th className="px-6 py-4">Usage</th>
                  <th className="px-6 py-4">Validity</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-orange-300">{coupon.code}</span>
                        <button
                          type="button"
                          onClick={() => copyCode(coupon.code)}
                          className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/10 text-purple-300 transition-all"
                          title="Copy code"
                        >
                          {copiedCode === coupon.code ? (
                            <Check size={14} className="text-green-400" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                      {coupon.description && (
                        <p className="text-xs text-purple-400 mt-1 max-w-50 truncate">
                          {coupon.description}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-white font-semibold">
                        {coupon.type === "percentage" ? (
                          <Percent size={16} className="text-orange-300" />
                        ) : (
                          <Banknote size={16} className="text-green-300" />
                        )}
                        {formatDiscount(coupon)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-purple-200">
                      {coupon.minOrderAmount > 0 ? `৳${coupon.minOrderAmount}` : "—"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="text-white font-semibold">{coupon.usedCount || 0}</span>
                      <span className="text-purple-400">
                        {coupon.usageLimit != null ? ` / ${coupon.usageLimit}` : " / ∞"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-purple-300">
                      <div>{formatDate(coupon.startDate)} → {formatDate(coupon.endDate)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge coupon={coupon} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => openEdit(coupon)}
                          className="p-2 rounded-xl hover:bg-orange-300/20 text-orange-300"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(coupon)}
                          className="p-2 rounded-xl hover:bg-red-400/20 text-red-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Create / Edit modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#5A2350] rounded-4xl p-8 w-full max-w-lg shadow-2xl border border-white/10 my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {editId ? "Edit Coupon" : "New Coupon"}
              </h3>
              <button
                type="button"
                onClick={resetModal}
                className="p-2 rounded-xl hover:bg-white/10 text-purple-300"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className={labelClass}>Coupon code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, code: e.target.value.toUpperCase() }))
                  }
                  placeholder="e.g. ACHAR10"
                  className={`${inputClass} font-mono uppercase`}
                />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Optional note for admins"
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))}
                    className={inputClass}
                  >
                    <option value="percentage" className="text-black">Percentage (%)</option>
                    <option value="fixed" className="text-black">Fixed (৳)</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>
                    Value * {formData.type === "percentage" ? "(%)" : "(৳)"}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={formData.type === "percentage" ? "100" : undefined}
                    value={formData.value}
                    onChange={(e) => setFormData((p) => ({ ...p, value: e.target.value }))}
                    className={inputClass}
                  />
                </div>
              </div>
              {formData.type === "percentage" && (
                <div>
                  <label className={labelClass}>Max discount (৳)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData((p) => ({ ...p, maxDiscount: e.target.value }))}
                    placeholder="Leave empty for no cap"
                    className={inputClass}
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Min order (৳)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData((p) => ({ ...p, minOrderAmount: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Usage limit</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData((p) => ({ ...p, usageLimit: e.target.value }))}
                    placeholder="Unlimited"
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Start date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData((p) => ({ ...p, startDate: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>End date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData((p) => ({ ...p, endDate: e.target.value }))}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
                  className={inputClass}
                >
                  <option value="active" className="text-black">Active</option>
                  <option value="inactive" className="text-black">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-6 mt-2">
              <button
                type="button"
                onClick={resetModal}
                className="flex-1 py-3 rounded-xl bg-white/10 text-purple-200 font-semibold hover:bg-white/20 border border-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 py-3 rounded-xl bg-linear-to-r from-green-300 to-green-400 text-[#4A1942] font-bold shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 size={18} className="animate-spin" />}
                {editId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#5A2350] rounded-4xl p-8 w-full max-w-md shadow-2xl border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Delete coupon</h3>
            <p className="text-purple-200 text-sm">
              Delete <span className="font-mono font-bold text-orange-300">{deleteTarget.code}</span>?
              This cannot be undone.
            </p>
            <div className="flex items-center gap-3 pt-6">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 rounded-xl bg-white/10 text-purple-200 font-semibold border border-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 py-3 rounded-xl bg-linear-to-r from-red-300 to-red-400 text-[#4A1942] font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
