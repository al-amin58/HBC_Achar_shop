import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Image,
  Megaphone,
  LayoutPanelTop,
  X,
  Loader2,
  Upload,
} from "lucide-react";
import api from "../../api/axios";
import { toast } from "react-toastify";

const statusClass = {
  Active: "bg-green-400/20 text-green-300 border border-green-400/30",
  Scheduled: "bg-blue-400/20 text-blue-300 border border-blue-400/30",
  Draft: "bg-amber-400/20 text-amber-300 border border-amber-400/30",
  Paused: "bg-red-400/20 text-red-300 border border-red-400/30",
};

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
const btnPrimary =
  "inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-linear-to-r from-orange-300 to-orange-400 text-[#4A1942] text-sm font-bold shadow-lg shadow-orange-500/20 hover:shadow-xl hover:scale-105 transition-all";
const btnSave =
  "flex-1 py-3 rounded-xl bg-linear-to-r from-green-300 to-green-400 text-[#4A1942] font-bold shadow-lg shadow-green-500/20 hover:shadow-xl transition-all disabled:opacity-50";
const btnSecondary =
  "flex-1 py-3 rounded-xl bg-white/10 text-purple-200 font-semibold hover:bg-white/20 transition-colors border border-white/10 disabled:opacity-50";

const DEFAULT_CAMPAIGN_BANNER = {
  title: "",
  subtitle: "",
  emoji: "🎉",
  link: "",
  linkText: "",
  isActive: true,
};

const mergeConfig = (data) => ({
  heroSlides: Array.isArray(data?.heroSlides) ? data.heroSlides : [],
  campaignBanner: {
    ...DEFAULT_CAMPAIGN_BANNER,
    ...(data?.campaignBanner && typeof data.campaignBanner === "object"
      ? data.campaignBanner
      : {}),
  },
  ads: Array.isArray(data?.ads) ? data.ads : [],
});

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsDataURL(file);
  });

const ImageFileField = ({ label, value, onChange }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (JPG, PNG, WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB.");
      return;
    }
    setUploading(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      onChange(dataUrl);
      toast.success("Image uploaded.");
    } catch {
      toast.error("Failed to read image file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
        disabled={uploading}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="mt-1 flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/20 bg-white/5 px-4 py-5 text-sm text-purple-200 transition hover:border-orange-300/50 hover:bg-white/10 disabled:opacity-60"
      >
        {uploading ? (
          <Loader2 className="animate-spin text-orange-300" size={22} />
        ) : value ? (
          <img
            src={value}
            alt="Preview"
            className="max-h-36 w-full rounded-lg object-contain"
          />
        ) : (
          <>
            <Upload size={22} className="text-orange-300" />
            <span className="text-white">Click to upload image</span>
            <span className="text-xs text-purple-400">JPG, PNG, WebP · max 5MB</span>
          </>
        )}
      </button>
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="mt-2 text-xs font-semibold text-red-300 hover:text-red-200"
        >
          Remove image
        </button>
      )}
    </div>
  );
};

export default function Campaignbanner() {
  const [config, setConfig] = useState({
    heroSlides: [],
    campaignBanner: { ...DEFAULT_CAMPAIGN_BANNER },
    ads: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSlideModal, setShowSlideModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [modalType, setModalType] = useState("slide");

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await api.get("/settings/web-config");
      setConfig(mergeConfig(res.data));
    } catch {
      toast.error("Failed to load configuration");
    } finally {
      setLoading(false);
    }
  };

  const updateCampaignBanner = (field, value) => {
    setConfig((prev) => ({
      ...prev,
      campaignBanner: { ...prev.campaignBanner, [field]: value },
    }));
  };

  const handleSaveConfig = async (updatedData) => {
    const payload = updatedData ?? config;
    try {
      setSaving(true);
      await api.put("/settings/web-config", payload);
      toast.success("Settings updated successfully");
      await fetchConfig();
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    const defaults =
      type === "slide"
        ? {
            title: "",
            subtitle: "",
            cta: "Shop Now",
            link: "/shop",
            image: "",
            color: "from-emerald-900/80 to-emerald-800/40",
            status: "Active",
            order: 0,
          }
        : {
            tag: "",
            title: "",
            subtitle: "",
            cta: "Shop Now",
            link: "/shop",
            image: "",
            color: "from-emerald-800/90 to-emerald-600/70",
            status: "Active",
          };
    setEditItem(item ? { ...item } : defaults);
    setShowSlideModal(true);
  };

  const patchEditItem = (patch) => {
    setEditItem((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const handleItemSubmit = () => {
    if (!editItem?.title?.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!editItem?.image) {
      toast.error("Please upload an image.");
      return;
    }

    const newConfig = {
      ...config,
      heroSlides: [...config.heroSlides],
      ads: [...config.ads],
    };

    if (modalType === "slide") {
      const id = editItem._id || editItem.tempId;
      if (id) {
        newConfig.heroSlides = newConfig.heroSlides.map((s) =>
          (s._id || s.tempId) === id ? { ...editItem } : s,
        );
      } else {
        newConfig.heroSlides.push({ ...editItem, tempId: Date.now() });
      }
    } else {
      const id = editItem._id || editItem.tempId;
      if (id) {
        newConfig.ads = newConfig.ads.map((a) =>
          (a._id || a.tempId) === id ? { ...editItem } : a,
        );
      } else {
        newConfig.ads.push({ ...editItem, tempId: Date.now() });
      }
    }

    setConfig(newConfig);
    setShowSlideModal(false);
    setEditItem(null);
    handleSaveConfig(newConfig);
  };

  const deleteItem = (type, id) => {
    if (!window.confirm("Are you sure?")) return;
    const newConfig = {
      ...config,
      heroSlides:
        type === "slide"
          ? config.heroSlides.filter((s) => (s._id || s.tempId) !== id)
          : config.heroSlides,
      ads:
        type === "ad"
          ? config.ads.filter((a) => (a._id || a.tempId) !== id)
          : config.ads,
    };
    setConfig(newConfig);
    handleSaveConfig(newConfig);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#4A1942] p-6 md:p-8 flex items-center justify-center">
        <GlassCard className="p-8 flex items-center gap-3 text-purple-200">
          <Loader2 className="animate-spin text-orange-300" size={32} />
          Loading campaign settings...
        </GlassCard>
      </div>
    );
  }

  const banner = config.campaignBanner;

  return (
    <div className="min-h-screen bg-[#4A1942] p-6 md:p-8 space-y-6">
      <SectionHeader
        title="Campaign Banner"
        subtitle="Manage homepage hero slides, campaign bar, and promo ads"
        action={
          <button type="button" onClick={() => openModal("slide")} className={btnPrimary}>
            <Plus size={18} /> Add Hero Slide
          </button>
        }
      />

      {/* 1. HERO SLIDES */}
      <GlassCard className="p-5 lg:p-6 overflow-hidden">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-bold text-white">
              <LayoutPanelTop size={20} className="text-orange-300" />
              Hero Slides
            </h3>
            <p className="text-sm text-purple-200 mt-1">
              Control homepage slider content, order, and CTA buttons.
            </p>
          </div>
          <button type="button" onClick={() => openModal("slide")} className={btnPrimary}>
            <Plus size={16} /> Add Slide
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-190">
            <thead>
              <tr className="text-left text-xs font-semibold text-purple-300 uppercase tracking-wider bg-white/5">
                <th className="px-4 py-3">Preview</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">CTA</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {config.heroSlides.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-purple-300">
                    No hero slides yet. Click &quot;Add Hero Slide&quot; to create one.
                  </td>
                </tr>
              ) : (
                config.heroSlides.map((slide) => (
                  <tr
                    key={slide._id || slide.tempId}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      {slide.image ? (
                        <img
                          src={slide.image}
                          alt=""
                          className="h-12 w-20 rounded-lg border border-white/20 object-cover"
                        />
                      ) : (
                        <div className="h-12 w-20 rounded-lg border border-dashed border-white/20 bg-white/5" />
                      )}
                    </td>
                    <td className="px-4 py-3 font-semibold text-white">{slide.title}</td>
                    <td className="px-4 py-3 text-sm text-purple-200">{slide.cta}</td>
                    <td className="px-4 py-3 text-sm text-purple-200">
                      #{slide.order ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass[slide.status] || statusClass.Draft}`}
                      >
                        {slide.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => openModal("slide", slide)}
                          className="p-2 rounded-xl hover:bg-orange-300/20 text-orange-300 transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteItem("slide", slide._id || slide.tempId)}
                          className="p-2 rounded-xl hover:bg-red-400/20 text-red-300 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* 2. CAMPAIGN BANNER & ADS */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <GlassCard className="xl:col-span-2 p-5 lg:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold text-white">
              <Megaphone size={20} className="text-pink-300" />
              Campaign Banner
            </h3>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${banner.isActive ? statusClass.Active : statusClass.Paused}`}
            >
              {banner.isActive ? "Live" : "Disabled"}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelClass}>Banner Title</label>
              <input
                type="text"
                value={banner.title ?? ""}
                onChange={(e) => updateCampaignBanner("title", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Subtitle</label>
              <input
                type="text"
                value={banner.subtitle ?? ""}
                onChange={(e) => updateCampaignBanner("subtitle", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Emoji
                </label>
                <input
                  type="text"
                  value={banner.emoji ?? ""}
                  onChange={(e) => updateCampaignBanner("emoji", e.target.value)}
                  className="mt-1 w-full rounded-xl border px-4 py-2 outline-none"
                />
              </div>
              <div>
                <label className={labelClass}>Link Text</label>
                <input
                  type="text"
                  value={banner.linkText ?? ""}
                  onChange={(e) => updateCampaignBanner("linkText", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Redirect Link</label>
              <input
                type="text"
                value={banner.link ?? ""}
                onChange={(e) => updateCampaignBanner("link", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={() => handleSaveConfig()}
              disabled={saving}
              className={btnSave}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => updateCampaignBanner("isActive", !banner.isActive)}
              className={btnSecondary}
            >
              {banner.isActive ? "Disable" : "Enable"}
            </button>
          </div>
        </GlassCard>

        <GlassCard className="xl:col-span-3 p-5 lg:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                <Image size={20} className="text-green-300" />
                Ads / Promo Section
              </h3>
              <p className="text-sm text-purple-200 mt-1">
                Manage promotional cards visible on the homepage.
              </p>
            </div>
            <button type="button" onClick={() => openModal("ad")} className={btnPrimary}>
              <Plus size={16} /> Add Promo Card
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {config.ads.length === 0 ? (
              <p className="col-span-full py-8 text-center text-sm text-purple-300">
                No promo cards yet.
              </p>
            ) : (
              config.ads.map((card) => (
                <article
                  key={card._id || card.tempId}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-orange-300/30 hover:bg-white/10 transition-all"
                >
                  {card.image ? (
                    <img
                      src={card.image}
                      alt=""
                      className="h-24 w-full object-cover"
                    />
                  ) : (
                    <div className={`h-20 bg-linear-to-r ${card.color || ""}`} />
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-white">{card.title}</h3>
                    <p className="mt-1 text-xs text-purple-200">{card.subtitle}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass[card.status] || statusClass.Draft}`}
                      >
                        {card.status}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => openModal("ad", card)}
                          className="p-2 rounded-xl hover:bg-orange-300/20 text-orange-300 transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteItem("ad", card._id || card.tempId)}
                          className="p-2 rounded-xl hover:bg-red-400/20 text-red-300 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </GlassCard>
      </section>

      {/* ADD/EDIT MODAL */}
      {showSlideModal && editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div
            className="w-full max-w-lg rounded-4xl bg-[#5A2350] p-8 shadow-2xl border border-white/10"
            role="dialog"
            aria-modal="true"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                {editItem._id || editItem.tempId ? "Edit" : "Add"}{" "}
                {modalType === "slide" ? "Hero Slide" : "Ad Card"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowSlideModal(false);
                  setEditItem(null);
                }}
                className="p-2 rounded-xl hover:bg-white/10 text-purple-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-2">
              <div>
                <label className={labelClass}>Title</label>
                <input
                  type="text"
                  value={editItem.title ?? ""}
                  onChange={(e) => patchEditItem({ title: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Subtitle</label>
                <input
                  type="text"
                  value={editItem.subtitle ?? ""}
                  onChange={(e) => patchEditItem({ subtitle: e.target.value })}
                  className={inputClass}
                />
              </div>

              <ImageFileField
                label="Banner Image"
                value={editItem.image || ""}
                onChange={(image) => patchEditItem({ image })}
              />

              <div>
                <label className={labelClass}>Link</label>
                <input
                  type="text"
                  value={editItem.link ?? ""}
                  onChange={(e) => patchEditItem({ link: e.target.value })}
                  className={inputClass}
                />
              </div>

              {modalType === "ad" && (
                <div>
                  <label className={labelClass}>Tag (e.g. Flash Sale, New)</label>
                  <input
                    type="text"
                    value={editItem.tag ?? ""}
                    onChange={(e) => patchEditItem({ tag: e.target.value })}
                    className={inputClass}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>CTA Button Text</label>
                  <input
                    type="text"
                    value={editItem.cta ?? ""}
                    onChange={(e) => patchEditItem({ cta: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Status</label>
                  <select
                    value={editItem.status || "Active"}
                    onChange={(e) => patchEditItem({ status: e.target.value })}
                    className={inputClass}
                  >
                    {Object.keys(statusClass).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {modalType === "slide" && (
                <div>
                  <label className={labelClass}>Display Order</label>
                  <input
                    type="number"
                    min={0}
                    value={editItem.order ?? 0}
                    onChange={(e) =>
                      patchEditItem({
                        order: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className={inputClass}
                  />
                </div>
              )}

              <div>
                <label className={labelClass}>Tailwind Color Class</label>
                <input
                  type="text"
                  value={editItem.color ?? ""}
                  onChange={(e) => patchEditItem({ color: e.target.value })}
                  placeholder="e.g. from-emerald-500 to-green-400"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowSlideModal(false);
                  setEditItem(null);
                }}
                className={btnSecondary}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleItemSubmit}
                disabled={saving}
                className={btnSave}
              >
                {saving ? "Saving..." : "Save Content"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
