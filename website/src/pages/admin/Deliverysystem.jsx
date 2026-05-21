import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import api from "../../api/axios";
import { toast } from "react-toastify";

const EMPTY_DRAFT = { apiKey: "", secretKey: "", isActive: false };

export default function CourierSettingsPage() {
  const [couriers, setCouriers] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingSlug, setSavingSlug] = useState(null);
  const [testingSlug, setTestingSlug] = useState(null);
  const [savingAll, setSavingAll] = useState(false);

  const loadCouriers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/couriers");
      const list = data.couriers || [];
      setCouriers(list);
      const nextDrafts = {};
      list.forEach((c) => {
        nextDrafts[c.slug] = {
          apiKey: c.apiKey || "",
          secretKey: c.secretKey || "",
          isActive: Boolean(c.isActive),
        };
      });
      setDrafts(nextDrafts);
    } catch (err) {
      const msg =
        err.response?.status === 401
          ? "Please log in as admin again."
          : err.response?.data?.message || "Failed to load courier settings.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCouriers();
  }, [loadCouriers]);

  const updateDraft = (slug, field, value) => {
    setDrafts((prev) => ({
      ...prev,
      [slug]: { ...(prev[slug] || EMPTY_DRAFT), [field]: value },
    }));
  };

  const handleSaveOne = async (slug) => {
    const draft = drafts[slug];
    if (!draft) return;

    setSavingSlug(slug);
    try {
      const { data } = await api.put(`/admin/couriers/${slug}`, draft);
      toast.success(data.message || "Courier saved");
      await loadCouriers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save courier");
    } finally {
      setSavingSlug(null);
    }
  };

  const handleSaveAll = async () => {
    setSavingAll(true);
    try {
      const payload = couriers.map((c) => ({
        slug: c.slug,
        ...drafts[c.slug],
      }));
      const { data } = await api.put("/admin/couriers/bulk", { couriers: payload });
      toast.success(data.message || "All couriers saved");
      await loadCouriers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save all couriers");
    } finally {
      setSavingAll(false);
    }
  };

  const handleTest = async (slug) => {
    setTestingSlug(slug);
    try {
      const { data } = await api.post(`/admin/couriers/${slug}/test`);
      toast.success(data.message || "API test passed");
      await loadCouriers();
    } catch (err) {
      toast.error(err.response?.data?.message || "API test failed");
    } finally {
      setTestingSlug(null);
    }
  };

  const toggleActive = (slug) => {
    const current = drafts[slug]?.isActive ?? false;
    updateDraft(slug, "isActive", !current);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-fuchsia-950 via-purple-950 to-indigo-950 p-6 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-300 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-fuchsia-950 via-purple-950 to-indigo-950 p-6">
      <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white">Courier API Settings</h1>
            <p className="mt-2 text-sm text-purple-200">Manage your courier delivery APIs.</p>
          </div>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={savingAll}
            className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-purple-900 shadow-lg transition-all hover:scale-105 hover:bg-purple-100 cursor-pointer disabled:opacity-60 flex items-center gap-2"
          >
            {savingAll && <Loader2 size={16} className="animate-spin" />}
            Save All
          </button>
        </div>

        <div className="space-y-5">
          {couriers.map((courier) => {
            const draft = drafts[courier.slug] || EMPTY_DRAFT;
            const isActive = draft.isActive;

            return (
              <div
                key={courier.slug}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition-all hover:border-fuchsia-400/40 hover:bg-white/10"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="w-full lg:w-1/4">
                    <h2 className="text-xl font-black text-white">{courier.name}</h2>

                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleActive(courier.slug)}
                        className={`rounded-full px-3 py-1 text-xs font-bold cursor-pointer transition-colors ${
                          isActive
                            ? "bg-emerald-400/20 text-emerald-300"
                            : "bg-white/10 text-purple-300"
                        }`}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleActive(courier.slug)}
                        aria-label={isActive ? "Deactivate courier" : "Activate courier"}
                        className={`h-7 w-14 rounded-full p-1 shadow-inner transition-colors cursor-pointer ${
                          isActive ? "bg-emerald-500" : "bg-white/20"
                        }`}
                      >
                        <div
                          className={`h-5 w-5 rounded-full bg-white shadow-md transition-all ${
                            isActive ? "ml-auto" : "ml-0"
                          }`}
                        />
                      </button>
                    </div>

                    {courier.lastTestStatus !== "untested" && (
                      <p
                        className={`mt-2 text-[11px] font-medium ${
                          courier.lastTestStatus === "success"
                            ? "text-emerald-300"
                            : "text-rose-300"
                        }`}
                      >
                        Last test: {courier.lastTestStatus}
                      </p>
                    )}
                  </div>

                  <div className="grid w-full gap-4 md:grid-cols-2 lg:w-2/4">
                    <input
                      type="text"
                      placeholder="Enter API Key"
                      value={draft.apiKey}
                      onChange={(e) => updateDraft(courier.slug, "apiKey", e.target.value)}
                      className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-purple-200 outline-none transition-all focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-500/20"
                    />

                    <input
                      type="text"
                      placeholder="Enter Secret Key"
                      value={draft.secretKey}
                      onChange={(e) => updateDraft(courier.slug, "secretKey", e.target.value)}
                      className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-purple-200 outline-none transition-all focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-500/20"
                    />
                  </div>

                  <div className="flex w-full gap-3 lg:w-auto">
                    <button
                      type="button"
                      onClick={() => handleTest(courier.slug)}
                      disabled={testingSlug === courier.slug}
                      className="w-full rounded-2xl border border-orange-400 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-white/20 lg:w-auto cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {testingSlug === courier.slug && (
                        <Loader2 size={14} className="animate-spin" />
                      )}
                      Test API
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSaveOne(courier.slug)}
                      disabled={savingSlug === courier.slug}
                      className="w-full rounded-2xl bg-linear-to-r from-orange-300 to-orange-400 px-5 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 lg:w-auto cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {savingSlug === courier.slug && (
                        <Loader2 size={14} className="animate-spin" />
                      )}
                      Save
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
