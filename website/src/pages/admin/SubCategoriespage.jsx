import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Grid3X3,
  ListFilter,
  Edit,
  Trash2,
  FolderTree,
  X,
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

const StatusBadge = ({ status, text }) => {
  const isActive = status === "active";
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
      isActive 
        ? 'bg-green-400/20 text-green-300 border border-green-400/30' 
        : 'bg-red-400/20 text-red-300 border border-red-400/30'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isActive ? 'bg-green-400' : 'bg-red-400'}`} />
      {text}
    </span>
  );
};

const GlassCard = ({ children, className = "" }) => (
  <div className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl ${className}`}>
    {children}
  </div>
);

const SubCategoriesPage = () => {
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "",
    status: "active",
  });

  const fetchPageData = async () => {
    try {
      setLoading(true);
      const [subCategoryRes, categoryRes] = await Promise.all([
        api.get("/subcategories"),
        api.get("/categories"),
      ]);
      setSubCategories(subCategoryRes.data || []);
      setCategories(categoryRes.data || []);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load sub-categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load subcategories + parents on mount
    void fetchPageData();
  }, []);

  const filtered = subCategories.filter((subCat) =>
    subCat.name.toLowerCase().includes(search.toLowerCase())
  );
  const selectableParentCategories = categories.filter(
    (category) =>
      category.status === "active" || category._id === formData.category
  );

  const resetModalState = () => {
    setShowAddModal(false);
    setEditId(null);
    setFormData({ name: "", slug: "", category: "", status: "active" });
  };

  const handleCreateClick = () => {
    setEditId(null);
    setFormData({ name: "", slug: "", category: "", status: "active" });
    setShowAddModal(true);
  };

  const handleEditClick = (subCategory) => {
    setEditId(subCategory._id);
    setFormData({
      name: subCategory.name || "",
      slug: subCategory.slug || "",
      category: subCategory.category?._id || subCategory.category || "",
      status: subCategory.status || "active",
    });
    setShowAddModal(true);
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name.trim()) {
        setError("Sub-category name is required.");
        return;
      }

      if (!formData.category) {
        setError("Parent category is required.");
        return;
      }

      setSubmitting(true);
      setError("");

      if (editId) {
        await api.put(`/subcategories/${editId}`, formData);
        toast.success("Sub-category updated successfully.");
      } else {
        await api.post("/subcategories", formData);
        toast.success("Sub-category added successfully.");
      }

      resetModalState();
      fetchPageData();
    } catch (err) {
      const message = err?.response?.data?.message || "Sub-category save failed.";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteModal = (category) => {
    setDeleteTarget(category);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget?._id) return;

    try {
      await api.delete(`/subcategories/${deleteTarget._id}`);
      toast.success("Sub-category deleted successfully.");
      setDeleteTarget(null);
      fetchPageData();
    } catch (err) {
      const message = err?.response?.data?.message || "Sub-category delete failed.";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-[#4A1942] p-6 md:p-8 space-y-6">
      {/* Header */}
      <SectionHeader
        title="Sub Categories"
        subtitle="Manage sub-categories under each category"
        action={
          <button
            onClick={handleCreateClick}
            className="px-5 py-2.5 rounded-2xl bg-linear-to-r from-orange-300 to-orange-400 text-[#4A1942] text-sm font-bold shadow-lg shadow-orange-500/20 hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
          >
            <Plus size={18} /> Add Sub Category
          </button>
        }
      />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300" size={18} />
          <input
            type="text"
            placeholder="Search sub-categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:border-orange-300 focus:ring-2 focus:ring-orange-300/20 outline-none transition-all text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView("grid")}
            className={`p-2.5 rounded-xl transition-all ${view === "grid" ? "bg-orange-300 text-[#4A1942]" : "bg-white/10 text-purple-200 hover:bg-white/20"}`}
          >
            <Grid3X3 size={18} />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2.5 rounded-xl transition-all ${view === "list" ? "bg-orange-300 text-[#4A1942]" : "bg-white/10 text-purple-200 hover:bg-white/20"}`}
          >
            <ListFilter size={18} />
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <GlassCard className="p-6 text-purple-200">Loading sub-categories...</GlassCard>
      ) : filtered.length === 0 ? (
        <GlassCard className="p-6 text-purple-200">No sub-categories found.</GlassCard>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((subCat) => (
            <div key={subCat._id} className="group bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 hover:border-orange-300/30 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-orange-300/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">{subCat.name}</h4>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditClick(subCat)}
                      className="p-2 rounded-xl hover:bg-orange-300/20 text-orange-300 transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(subCat)}
                      className="p-2 rounded-xl hover:bg-red-400/20 text-red-300 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <p className="text-sm text-purple-300 mb-2">/{subCat.slug}</p>
                <p className="text-sm text-purple-200 mb-4">
                  Parent: <span className="text-white font-semibold">{subCat.category?.name || "N/A"}</span>
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-purple-200">
                    <FolderTree size={16} className="text-green-300" />
                    <span className="font-semibold text-white">Sub Category</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                  <StatusBadge status={subCat.status} text={subCat.status === "active" ? "Active" : "Inactive"} />
                  
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <GlassCard className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-purple-300 uppercase tracking-wider bg-white/5">
                <th className="px-6 py-4">Sub Category</th>
                <th className="px-6 py-4">Parent Category</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((subCat) => (
                <tr key={subCat._id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-white">{subCat.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-white">{subCat.category?.name || "N/A"}</td>
                  <td className="px-6 py-4 text-sm text-purple-300">/{subCat.slug}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={subCat.status} text={subCat.status === "active" ? "Active" : "Inactive"} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditClick(subCat)}
                        className="p-2 rounded-xl hover:bg-orange-300/20 text-orange-300 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(subCat)}
                        className="p-2 rounded-xl hover:bg-red-400/20 text-red-300 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#5A2350] rounded-4xl p-8 w-full max-w-lg shadow-2xl border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {editId ? "Edit Sub Category" : "Add New Sub Category"}
              </h3>
              <button 
                onClick={resetModalState} 
                className="p-2 rounded-xl hover:bg-white/10 text-purple-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-purple-200 mb-1.5 block">Category Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Spicy Mango" 
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-400 focus:border-orange-300 focus:ring-2 focus:ring-orange-300/20 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-purple-200 mb-1.5 block">Parent Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-orange-300 focus:ring-2 focus:ring-orange-300/20 outline-none transition-all"
                >
                  <option className="text-black" value="">
                    Select Category
                  </option>
                  {selectableParentCategories.map((category) => (
                    <option className="text-black" key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-purple-200 mb-1.5 block">Slug</label>
                <input 
                  type="text" 
                  placeholder="e.g. mango-achar" 
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-400 focus:border-orange-300 focus:ring-2 focus:ring-orange-300/20 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-purple-200 mb-1.5 block">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-orange-300 focus:ring-2 focus:ring-orange-300/20 outline-none transition-all"
                >
                  <option className="text-black" value="active">
                    Active
                  </option>
                  <option className="text-black" value="inactive">
                    Inactive
                  </option>
                </select>
              </div>
              
              <div className="flex items-center gap-3 pt-2">
                <button 
                  onClick={resetModalState} 
                  className="flex-1 py-3 rounded-xl bg-white/10 text-purple-200 font-semibold hover:bg-white/20 transition-colors border border-white/10"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 py-3 rounded-xl bg-linear-to-r from-green-300 to-green-400 text-[#4A1942] font-bold shadow-lg shadow-green-500/20 hover:shadow-xl transition-all"
                >
                  {submitting ? "Saving..." : editId ? "Update Sub Category" : "Create Sub Category"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#5A2350] rounded-4xl p-8 w-full max-w-md shadow-2xl border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Delete Sub Category</h3>
              <button
                onClick={() => setDeleteTarget(null)}
                className="p-2 rounded-xl hover:bg-white/10 text-purple-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-purple-200 text-sm leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-white">{deleteTarget.name}</span>? This action cannot be undone.
            </p>

            <div className="flex items-center gap-3 pt-6">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 rounded-xl bg-white/10 text-purple-200 font-semibold hover:bg-white/20 transition-colors border border-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-3 rounded-xl bg-linear-to-r from-red-300 to-red-400 text-[#4A1942] font-bold shadow-lg shadow-red-500/20 hover:shadow-xl transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubCategoriesPage;