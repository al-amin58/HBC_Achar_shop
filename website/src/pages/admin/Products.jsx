import { useState, useEffect, useMemo, useRef, useReducer } from "react";
import { useNavigate } from "react-router";
import {
  Search as SearchIcon,
  Filter,
  Download,
  Plus,
  Check,
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Layers,
  Trash2,
  Zap,
  Grid,
  List,
  AlignJustify,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Undo,
  SlidersHorizontal,
  Package,
  CheckCircle,
  XCircle,
  FileText,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Heart,
  X,
  ImagePlus,
  Sparkles,
  Bold,
  Italic,
  List as BulletListIcon,
  ListOrdered,
  Heading2,
  Quote,
  Link2,
} from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import api from "../../api/axios";
import { toast } from "react-toastify";

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=100&h=100&fit=crop";

function ProductDescriptionEditor({ value, onChange, mountKey }) {
  const [, refresh] = useReducer((x) => x + 1, 0);

  const editor = useEditor(
    {
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({
          heading: { levels: [2, 3] },
        }),
        Placeholder.configure({
          placeholder: "প্রোডাক্টের বিস্তারিত লিখুন...",
        }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: "text-[#ffb366] underline underline-offset-2",
          },
        }),
      ],
      content: value?.trim() ? value : "<p></p>",
      editorProps: {
        attributes: {
          class:
            "admin-tiptap-editor min-h-[160px] max-w-none px-3 py-2.5 text-sm text-white/90 focus:outline-none [&_p]:my-1.5 [&_ul]:my-2 [&_ol]:my-2 [&_li]:my-0.5 [&_blockquote]:border-l-2 [&_blockquote]:border-[#ff9f43]/45 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-white/75 [&_h2]:text-base [&_h2]:font-bold [&_h3]:text-sm [&_h3]:font-semibold",
        },
      },
      onUpdate: ({ editor: ed }) => onChange(ed.getHTML()),
    },
    [mountKey]
  );

  useEffect(() => {
    if (!editor) return;
    const bump = () => refresh();
    editor.on("selectionUpdate", bump);
    editor.on("transaction", bump);
    return () => {
      editor.off("selectionUpdate", bump);
      editor.off("transaction", bump);
    };
  }, [editor]);

  if (!editor) {
    return (
      <div className="rounded-2xl border border-white/10 min-h-55 bg-black/25 animate-pulse" />
    );
  }

  const tBtn = (active) =>
    `inline-flex items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors ${
      active ? "bg-[#ff9f43]/20 text-[#ffb366]" : "bg-white/6 text-white/65 hover:bg-white/10 hover:text-white/90"
    }`;

  const runLink = () => {
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("লিংক URL দিন", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="admin-tiptap rounded-2xl overflow-hidden border border-white/10 bg-black/25">
      <div className="flex flex-wrap gap-1 border-b border-white/8 bg-white/4 px-2 py-2">
        <button
          type="button"
          className={tBtn(editor.isActive("bold"))}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={14} /> Bold
        </button>
        <button
          type="button"
          className={tBtn(editor.isActive("italic"))}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={14} /> Italic
        </button>
        <button
          type="button"
          className={tBtn(editor.isActive("heading", { level: 2 }))}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 size={14} /> H2
        </button>
        <button
          type="button"
          className={tBtn(editor.isActive("bulletList"))}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <BulletListIcon size={14} />
        </button>
        <button
          type="button"
          className={tBtn(editor.isActive("orderedList"))}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={14} />
        </button>
        <button
          type="button"
          className={tBtn(editor.isActive("blockquote"))}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={14} />
        </button>
        <button type="button" className={tBtn(editor.isActive("link"))} onClick={runLink}>
          <Link2 size={14} /> Link
        </button>
        <button
          type="button"
          className={tBtn(false)}
          onClick={() => editor.chain().focus().clearContent(true).run()}
        >
          Clear
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function extractVariationIdsFromProduct(p) {
  const raw = p.variationIds;
  if (!Array.isArray(raw)) return [];
  return raw
    .map((x) => (x && typeof x === "object" && x._id != null ? String(x._id) : String(x)))
    .filter(Boolean);
}

function formatVariationOptionLabel(v) {
  const combo = v.combination || [];
  const text = combo.map((c) => c.value).join(" · ");
  return text ? `${v.sku} — ${text}` : String(v.sku || "");
}

function stripHtml(html) {
  if (!html || typeof html !== "string") return "";
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

const defaultFilter = () => ({
  categoryId: "",
  stockStatus: "all",
  flash: "all",
  priceMin: "",
  priceMax: "",
  sku: "",
  dateFrom: "",
});

const emptyForm = () => ({
  name: "",
  sku: "",
  category: "",
  subCategory: "",
  price: "",
  originalPrice: "",
  stock: "",
  status: "active",
  imageUrls: [],
  seoTitle: "",
  seoDescription: "",
  featured: false,
  variationIds: [],
  lowStockThreshold: "",
  description: "",
});

function generateSku(name = "") {
  const base = name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.slice(0, 3))
    .join("-")
    .slice(0, 20);
  const rand = Math.floor(1000 + Math.random() * 9000);
  return base ? `${base}-${rand}` : `SKU-${rand}`;
}

/** Ordered list for editor: first item = thumbnail / main `image` */
function buildImageUrlsFromProduct(p) {
  const out = [];
  const main = p.image && p.image !== PLACEHOLDER_IMG ? String(p.image).trim() : "";
  if (main) out.push(main);
  for (const u of p.images || []) {
    const s = String(u).trim();
    if (s && !out.includes(s)) out.push(s);
  }
  return out;
}

function normalizeProduct(p) {
  const cat = p.category && typeof p.category === "object" ? p.category : null;
  const sub = p.subCategory && typeof p.subCategory === "object" ? p.subCategory : null;
  return {
    ...p,
    id: p._id,
    categoryLabel: cat?.name || "—",
    categoryId: cat?._id?.toString?.() || (typeof p.category === "string" ? p.category : "") || "",
    subCategoryId:
      sub?._id?.toString?.() || (typeof p.subCategory === "string" ? p.subCategory : "") || "",
    variationIds: extractVariationIdsFromProduct(p),
    lowStockThreshold: p.lowStockThreshold ?? null,
    date: p.createdAt
      ? new Date(p.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "—",
    image: p.image?.trim() ? p.image : PLACEHOLDER_IMG,
    originalPrice: p.originalPrice ?? null,
  };
}

function toPayload(form) {
  const urls = (form.imageUrls || []).map((s) => String(s).trim()).filter(Boolean);
  const thumbnail = urls[0] || "";
  return {
    name: form.name.trim(),
    sku: form.sku.trim(),
    category: form.category || null,
    subCategory: form.subCategory || null,
    brand: "",
    price: Number(form.price),
    originalPrice: form.originalPrice === "" ? null : Number(form.originalPrice),
    stock: form.stock === "" ? 0 : Number(form.stock),
    status: form.status,
    featured: form.featured,
    image: thumbnail,
    images: urls,
    seoTitle: form.seoTitle.trim(),
    seoDescription: form.seoDescription.trim(),
    variationIds: (form.variationIds || []).map(String).filter(Boolean),
    lowStockThreshold:
      form.lowStockThreshold === "" || form.lowStockThreshold === undefined
        ? null
        : Math.max(0, Number(form.lowStockThreshold)),
    description: form.description || "",
  };
}

function downloadCsv(rows, filename = "products-export.csv") {
  const headers = ["name", "sku", "category", "variant", "price", "stock", "status"];
  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      headers
        .map((h) => {
          let v = h === "category" ? r.categoryLabel : r[h];
          if (v == null) v = "";
          const s = String(v).replace(/"/g, '""');
          return `"${s}"`;
        })
        .join(",")
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const SPARK = [35, 55, 42, 68, 50, 72, 48];

export default function Products() {
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [variationCatalog, setVariationCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [draftFilter, setDraftFilter] = useState(defaultFilter);
  const [activeFilter, setActiveFilter] = useState(defaultFilter);

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  /** Remount Tiptap when opening the modal so `content` matches add vs edit (react-quill used findDOMNode; R19 removed it). */
  const [descriptionEditorKey, setDescriptionEditorKey] = useState(0);

  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [seoProduct, setSeoProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const imageFileInputRef = useRef(null);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, subRes, varRes] = await Promise.all([
        api.get("/products"),
        api.get("/categories"),
        api.get("/subcategories"),
        api.get("/product-variations"),
      ]);
      setProducts((prodRes.data || []).map(normalizeProduct));
      setCategories(catRes.data || []);
      setSubCategories(subRes.data || []);
      setVariationCatalog(varRes.data || []);
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to load products.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard admin data load on mount
    void fetchAll();
  }, []);

  useEffect(() => {
    const handleClick = () => setDropdownOpen(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const handleImageFiles = (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length < files.length) {
      toast.info("Non-image files were skipped.");
    }
    if (imageFiles.length === 0) return;
    Promise.all(
      imageFiles.map(
        (file) =>
          new Promise((resolve) => {
            const r = new FileReader();
            r.onload = () => resolve(r.result);
            r.onerror = () => resolve(null);
            r.readAsDataURL(file);
          })
      )
    ).then((urls) => {
      const next = urls.filter(Boolean);
      if (next.length) {
        setForm((f) => ({ ...f, imageUrls: [...f.imageUrls, ...next] }));
        toast.success(`${next.length} image(s) added.`);
      }
    });
  };

  const moveImage = (index, delta) => {
    setForm((f) => {
      const arr = [...f.imageUrls];
      const ni = index + delta;
      if (ni < 0 || ni >= arr.length) return f;
      [arr[index], arr[ni]] = [arr[ni], arr[index]];
      return { ...f, imageUrls: arr };
    });
  };

  const removeImage = (index) => {
    setForm((f) => ({ ...f, imageUrls: f.imageUrls.filter((_, i) => i !== index) }));
  };

  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return products.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) return false;

      if (activeFilter.categoryId && p.categoryId !== activeFilter.categoryId) return false;

      if (activeFilter.sku.trim()) {
        if (!p.sku.toLowerCase().includes(activeFilter.sku.toLowerCase().trim())) return false;
      }

      if (activeFilter.stockStatus === "instock") {
        if (p.stock <= 0 || p.status === "outstock") return false;
      } else if (activeFilter.stockStatus === "low") {
        if (p.stock <= 0 || p.stock > 100) return false;
      } else if (activeFilter.stockStatus === "out") {
        if (p.stock > 0 && p.status !== "outstock") return false;
      }

      if (activeFilter.flash === "flash" && p.status !== "flash") return false;
      if (activeFilter.flash === "none" && p.status === "flash") return false;

      if (activeFilter.priceMin !== "" && Number(p.price) < Number(activeFilter.priceMin)) return false;
      if (activeFilter.priceMax !== "" && Number(p.price) > Number(activeFilter.priceMax)) return false;

      if (activeFilter.dateFrom && p.createdAt) {
        const from = new Date(activeFilter.dateFrom);
        from.setHours(0, 0, 0, 0);
        if (new Date(p.createdAt) < from) return false;
      }

      return true;
    });
  }, [products, searchQuery, activeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginatedProducts = filteredProducts.slice((safePage - 1) * pageSize, safePage * pageSize);

  const goPrevPage = () => setPage((p) => Math.max(1, Math.min(p - 1, totalPages)));
  const goNextPage = () => setPage((p) => Math.min(totalPages, p + 1));

  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter((p) => p.status === "active").length;
    const out = products.filter((p) => p.status === "outstock" || p.stock === 0).length;
    const draft = products.filter((p) => p.status === "draft").length;
    const flash = products.filter((p) => p.status === "flash").length;
    const low = products.filter((p) => p.stock > 0 && p.stock < 100).length;
    const fmt = (n) => n.toLocaleString();
    return [
      { label: "Total Products", value: fmt(total), growth: "—", up: true, icon: Package, color: "text-[#ff9f43]", bg: "bg-[#ff9f43]/15" },
      { label: "Active Products", value: fmt(active), growth: "—", up: true, icon: CheckCircle, color: "text-[#2ed573]", bg: "bg-[#2ed573]/15" },
      { label: "Out of Stock", value: fmt(out), growth: "—", up: false, icon: XCircle, color: "text-[#ff4757]", bg: "bg-[#ff4757]/15" },
      { label: "Draft Products", value: fmt(draft), growth: "—", up: true, icon: FileText, color: "text-[#70a1ff]", bg: "bg-[#70a1ff]/15" },
      { label: "Flash Sale", value: fmt(flash), growth: "—", up: true, icon: Zap, color: "text-[#ffa502]", bg: "bg-[#ffa502]/15" },
      { label: "Low Stock Alert", value: fmt(low), growth: "—", up: false, icon: AlertTriangle, color: "text-[#a55eea]", bg: "bg-[#a55eea]/15" },
    ];
  }, [products]);

  const toggleSelect = (id) => {
    const sid = String(id);
    setSelectedItems((prev) => (prev.includes(sid) ? prev.filter((i) => i !== sid) : [...prev, sid]));
  };

  const toggleSelectAllFiltered = () => {
    const ids = filteredProducts.map((p) => String(p.id));
    if (ids.length && ids.every((id) => selectedItems.includes(id))) {
      setSelectedItems((prev) => prev.filter((id) => !ids.includes(id)));
    } else {
      setSelectedItems((prev) => Array.from(new Set([...prev, ...ids])));
    }
  };

  const allFilteredSelected =
    filteredProducts.length > 0 && filteredProducts.every((p) => selectedItems.includes(String(p.id)));

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm());
    setDescriptionEditorKey((k) => k + 1);
    setProductModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name || "",
      sku: p.sku || "",
      category: p.categoryId || "",
      subCategory: p.subCategoryId || "",
      price: p.price != null ? String(p.price) : "",
      originalPrice: p.originalPrice != null ? String(p.originalPrice) : "",
      stock: p.stock != null ? String(p.stock) : "",
      status: p.status || "active",
      imageUrls: buildImageUrlsFromProduct(p),
      seoTitle: p.seoTitle || "",
      seoDescription: p.seoDescription || "",
      featured: Boolean(p.featured),
      variationIds: extractVariationIdsFromProduct(p),
      lowStockThreshold: p.lowStockThreshold != null ? String(p.lowStockThreshold) : "",
      description: p.description || "",
    });
    setDescriptionEditorKey((k) => k + 1);
    setProductModalOpen(true);
  };

  const handleSaveProduct = async () => {

    if (!form.name.trim() || !form.sku.trim()) {
      toast.error("Name and SKU are required.");
      return;
    }
    if (form.price === "" || Number.isNaN(Number(form.price))) {
      toast.error("Valid price is required.");
      return;
    }
    try {
      setSaving(true);
      const payload = toPayload(form);
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        toast.success("Product updated.");
      } else {
        await api.post("/products", payload);
        toast.success("Product created.");
      }
      setProductModalOpen(false);
      setEditingId(null);
      setForm(emptyForm());
      await fetchAll();
      setSelectedItems([]);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteOne = async () => {
    if (!deleteTarget?.id) return;
    try {
      await api.delete(`/products/${deleteTarget.id}`);
      toast.success("Product deleted.");
      setDeleteTarget(null);
      setDropdownOpen(null);
      setSelectedItems((prev) => prev.filter((i) => i !== String(deleteTarget.id)));
      await fetchAll();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed.");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    try {
      await api.post("/products/bulk-delete", { ids: selectedItems });
      toast.success(`${selectedItems.length} product(s) deleted.`);
      setDeleteTarget(null);
      setSelectedItems([]);
      await fetchAll();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Bulk delete failed.");
    }
  };

  const handleDuplicate = (p) => {
    let sku = `${p.sku}-COPY`;
    let n = 2;
    while (products.some((x) => x.sku === sku)) {
      sku = `${p.sku}-COPY${n}`;
      n++;
    }
    setEditingId(null);
    setForm({
      ...emptyForm(),
      name: `${p.name} (Copy)`,
      sku,
      category: p.categoryId || "",
      subCategory: p.subCategoryId || "",
      price: p.price != null ? String(p.price) : "",
      originalPrice: p.originalPrice != null ? String(p.originalPrice) : "",
      stock: p.stock != null ? String(p.stock) : "0",
      status: p.status || "active",
      imageUrls: buildImageUrlsFromProduct(p),
      seoTitle: p.seoTitle || "",
      seoDescription: p.seoDescription || "",
      featured: false,
      variationIds: extractVariationIdsFromProduct(p),
      lowStockThreshold: p.lowStockThreshold != null ? String(p.lowStockThreshold) : "",
      description: p.description || "",
    });
    setDescriptionEditorKey((k) => k + 1);
    setProductModalOpen(true);
    setDropdownOpen(null);
    toast.info("Review and save the duplicate.");
  };

  const patchProduct = async (id, partial) => {
    try {
      await api.put(`/products/${id}`, partial);
      await fetchAll();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed.");
    }
  };

  const handleBulkFlash = async () => {
    if (selectedItems.length === 0) {
      toast.warning("Select products first.");
      return;
    }
    try {
      await Promise.all(selectedItems.map((id) => api.put(`/products/${id}`, { status: "flash" })));
      toast.success("Flash sale enabled for selection.");
      setSelectedItems([]);
      await fetchAll();
    } catch {
      toast.error("Could not update all items.");
    }
  };

  const handleExport = () => {
    if (filteredProducts.length === 0) {
      toast.warning("Nothing to export.");
      return;
    }
    downloadCsv(filteredProducts);
    toast.success("CSV downloaded.");
  };

  const applyFilters = () => {
    setActiveFilter({ ...draftFilter });
    toast.success("Filters applied.");
  };

  const resetFilters = () => {
    const d = defaultFilter();
    setDraftFilter(d);
    setActiveFilter(d);
    toast.info("Filters reset.");
  };

  const categoriesActive = useMemo(
    () => categories.filter((c) => c.status !== "inactive"),
    [categories]
  );

  const formSubCategories = useMemo(() => {
    if (!form.category) return [];
    return subCategories.filter((s) => {
      if (s.status === "inactive") return false;
      const cid = s.category?._id?.toString?.() ?? (typeof s.category === "string" ? s.category : "");
      return String(cid) === String(form.category);
    });
  }, [form.category, subCategories]);

  const toggleVariationId = (id) => {
    const sid = String(id);
    setForm((f) => {
      const cur = (f.variationIds || []).map(String);
      const has = cur.includes(sid);
      const next = has ? cur.filter((x) => x !== sid) : [...cur, sid];
      return { ...f, variationIds: next };
    });
  };

  const setAllVariations = (checked) => {
    setForm((f) => ({
      ...f,
      variationIds: checked ? variationCatalog.map((v) => String(v._id)) : [],
    }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#2ed573]/15 text-[#2ed573]">
            <CheckCircle size={10} /> Active
          </span>
        );
      case "flash":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-linear-to-r from-[#ff9f43]/20 to-[#ffa502]/20 text-[#ff9f43] animate-pulse">
            <Zap size={10} /> Flash
          </span>
        );
      case "outstock":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#ff4757]/15 text-[#ff4757]">
            <XCircle size={10} /> Out of Stock
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#70a1ff]/15 text-[#70a1ff]">
            <FileText size={10} /> Draft
          </span>
        );
    }
  };

  const getStockBar = (stock, lowThreshold) => {
    const n = Number(stock) || 0;
    const thr =
      lowThreshold != null && lowThreshold !== "" && !Number.isNaN(Number(lowThreshold))
        ? Number(lowThreshold)
        : null;
    const pct = Math.min((n / 1000) * 100, 100);
    let color = "bg-[#2ed573]";
    if (thr != null && n > 0 && n <= thr) color = "bg-[#a55eea]";
    else if (n < 100) color = "bg-[#ff4757]";
    else if (n < 400) color = "bg-[#ffa502]";
    return (
      <div>
        <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden mb-1">
          <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs text-white/50">
          {n} units
          {thr != null && n > 0 && n <= thr && (
            <span className="text-[#a55eea] font-semibold ml-1">(alert)</span>
          )}
        </span>
      </div>
    );
  };

  const openQuickView = (p) => {
    setQuickViewProduct(p);
    setActiveImage(0);
    setDropdownOpen(null);
  };

  const galleryFor = (p) => {
    const imgs = [p.image, ...(Array.isArray(p.images) ? p.images : [])].filter(
      (u) => u && u !== PLACEHOLDER_IMG
    );
    const uniq = [...new Set(imgs.length ? imgs : [p.image || PLACEHOLDER_IMG])];
    return uniq;
  };

  const saveSeo = async () => {
    if (!seoProduct) return;
    try {
      await api.put(`/products/${seoProduct.id}`, {
        seoTitle: seoProduct.seoTitle,
        seoDescription: seoProduct.seoDescription,
      });
      toast.success("SEO settings saved.");
      setSeoProduct(null);
      await fetchAll();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Save failed.");
    }
  };

  return (
    <div className="p-4 lg:p-8 relative">
      {loading && (
        <div className="absolute inset-0 z-40 bg-[#1a0510]/40 backdrop-blur-[2px] flex items-center justify-center rounded-xl">
          <div className="w-10 h-10 border-2 border-[#ff9f43] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fadeIn">
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold bg-linear-to-r from-white to-[#ffb366] bg-clip-text text-transparent">
            Product Management
          </h1>
          <p className="text-white/50 text-sm mt-1">Manage your achar products</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-transparent border border-white/8 text-white/60 text-sm font-semibold hover:border-[#ff9f43] hover:text-[#ff9f43] hover:bg-[#ff9f43]/5 transition-all"
          >
            <SlidersHorizontal size={16} /> Filter
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#2ed573] to-[#7bed9f] text-[#1a0510] text-sm font-semibold shadow-lg shadow-[#2ed573]/20 hover:shadow-[#2ed573]/30 hover:-translate-y-0.5 transition-all"
          >
            <Download size={16} /> Export
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#ff9f43] to-[#ffb366] text-[#1a0510] text-sm font-semibold shadow-lg shadow-[#ff9f43]/20 hover:shadow-[#ff9f43]/30 hover:-translate-y-0.5 transition-all"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group relative bg-[#2d0a1f]/80 backdrop-blur-sm border border-white/8 rounded-[20px] p-6 hover:-translate-y-1 hover:border-[#ff9f43]/20 hover:shadow-[0_0_40px_rgba(255,159,67,0.1),0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-0.75 bg-linear-to-r from-[#ff9f43] to-[#2ed573] opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center text-xl`}>
                <stat.icon size={22} />
              </div>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                  stat.up ? "bg-[#2ed573]/10 text-[#2ed573]" : "bg-[#ff4757]/10 text-[#ff4757]"
                }`}
              >
                {stat.up ? <ArrowUp size={10} /> : <ArrowDown size={10} />} {stat.growth}
              </span>
            </div>
            <div className="text-3xl font-extrabold bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-white/50 mb-4">{stat.label}</div>
            <div className="h-10 flex items-end gap-1">
              {Array.from({ length: 7 }).map((_, j) => (
                <div
                  key={j}
                  className="flex-1 rounded-sm bg-current opacity-20 group-hover:opacity-40 transition-all"
                  style={{
                    height: `${SPARK[j % SPARK.length]}%`,
                    color: stat.up ? "#2ed573" : "#ff4757",
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        className={`bg-[#2d0a1f]/80 backdrop-blur-sm border border-white/8 rounded-[20px] mb-6 overflow-hidden transition-all duration-500 ${
          filterOpen ? "max-h-150 opacity-100" : "max-h-0 opacity-0 border-0"
        }`}
      >
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-white/50">Category</label>
            <select
              value={draftFilter.categoryId}
              onChange={(e) => setDraftFilter((f) => ({ ...f, categoryId: e.target.value }))}
              style={{ backgroundColor: "#2d0a1f", color: "#fff" }}
              className="px-4 py-2.5 bg-white/5 border border-white/8 rounded-xl text-sm text-white focus:outline-none focus:border-[#ff9f43] focus:shadow-[0_0_15px_rgba(255,159,67,0.1)] transition-all"
            >
              <option value="">All Categories</option>
              {categories
                .filter((c) => c.status !== "inactive")
                .map((c) => (
                  <option key={c._id} value={c._id} className="bg-[#2d0a1f] ">
                    {c.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-white/50">Stock Status</label>
            <select
              value={draftFilter.stockStatus}
              onChange={(e) => setDraftFilter((f) => ({ ...f, stockStatus: e.target.value }))}
              style={{ backgroundColor: "#2d0a1f", color: "#fff" }}
              className="px-4 py-2.5 bg-white/5 border border-white/8 rounded-xl text-sm text-white focus:outline-none focus:border-[#ff9f43] transition-all"
            >
              <option value="all">All Status</option>
              <option value="instock">In Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-white/50">Flash Sale</label>
            <select
              value={draftFilter.flash}
              onChange={(e) => setDraftFilter((f) => ({ ...f, flash: e.target.value }))}
              style={{ backgroundColor: "#2d0a1f", color: "#fff" }}
              className="px-4 py-2.5 bg-white/5 border border-white/8 rounded-xl text-sm text-white focus:outline-none focus:border-[#ff9f43] transition-all"
            >
              <option value="all">All</option>
              <option value="flash">Active Flash Sale</option>
              <option value="none">None</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-white/50">Price Range (৳)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={draftFilter.priceMin}
                onChange={(e) => setDraftFilter((f) => ({ ...f, priceMin: e.target.value }))}
                className="flex-1 px-4 py-2.5 bg-white/5 border border-white/8 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#ff9f43] transition-all"
              />
              <span className="text-white/30">-</span>
              <input
                type="number"
                placeholder="Max"
                value={draftFilter.priceMax}
                onChange={(e) => setDraftFilter((f) => ({ ...f, priceMax: e.target.value }))}
                className="flex-1 px-4 py-2.5 bg-white/5 border border-white/8 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#ff9f43] transition-all"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-white/50">Search SKU</label>
            <input
              type="text"
              placeholder="Enter SKU..."
              value={draftFilter.sku}
              onChange={(e) => setDraftFilter((f) => ({ ...f, sku: e.target.value }))}
              className="px-4 py-2.5 bg-white/5 border border-white/8 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#ff9f43] transition-all"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-white/50">Created from</label>
            <input
              type="date"
              value={draftFilter.dateFrom}
              onChange={(e) => setDraftFilter((f) => ({ ...f, dateFrom: e.target.value }))}
              className="px-4 py-2.5 bg-white/5 border border-white/8 rounded-xl text-sm text-white focus:outline-none focus:border-[#ff9f43] transition-all"
            />
          </div>
          <div className="flex items-end justify-end gap-3">
            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-transparent border border-white/8 text-white/60 text-sm font-semibold hover:border-[#ff9f43] hover:text-[#ff9f43] transition-all"
            >
              <Undo size={14} /> Reset
            </button>
            <button
              type="button"
              onClick={applyFilters}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-[#ff9f43] to-[#ffb366] text-[#1a0510] text-sm font-semibold shadow-lg shadow-[#ff9f43]/20 hover:shadow-[#ff9f43]/30 transition-all"
            >
              <Filter size={14} /> Apply
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <div className="flex bg-white/5 border border-white/8 rounded-xl p-1">
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              viewMode === "table"
                ? "bg-linear-to-r from-[#ff9f43] to-[#ffb366] text-[#1a0510] shadow-lg shadow-[#ff9f43]/20"
                : "text-white/50 hover:text-white"
            }`}
          >
            <List size={14} /> Table
          </button>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              viewMode === "grid"
                ? "bg-linear-to-r from-[#ff9f43] to-[#ffb366] text-[#1a0510] shadow-lg shadow-[#ff9f43]/20"
                : "text-white/50 hover:text-white"
            }`}
          >
            <Grid size={14} /> Grid
          </button>
          <button
            type="button"
            onClick={() => setViewMode("compact")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              viewMode === "compact"
                ? "bg-linear-to-r from-[#ff9f43] to-[#ffb366] text-[#1a0510] shadow-lg shadow-[#ff9f43]/20"
                : "text-white/50 hover:text-white"
            }`}
          >
            <AlignJustify size={14} /> Compact
          </button>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial sm:min-w-50">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
            <input
              type="search"
              placeholder="Search name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#ff9f43]"
            />
          </div>
          <span className="text-sm text-white/50 whitespace-nowrap">
            <span className="text-[#ff9f43] font-bold">{selectedItems.length}</span> selected
          </span>
          <button
            type="button"
            disabled={selectedItems.length === 0}
            onClick={() => setDeleteTarget({ type: "bulk", count: selectedItems.length })}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-transparent border border-white/8 text-white/60 text-xs font-semibold hover:border-[#ff4757] hover:text-[#ff4757] transition-all disabled:opacity-30"
          >
            <Trash2 size={12} /> Delete
          </button>
          <button
            type="button"
            onClick={handleBulkFlash}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-linear-to-r from-[#2ed573] to-[#7bed9f] text-[#1a0510] text-xs font-semibold shadow-lg shadow-[#2ed573]/20 hover:shadow-[#2ed573]/30 transition-all"
          >
            <Zap size={12} /> Flash Sale
          </button>
        </div>
      </div>

      {viewMode === "table" && (
        <div className="backdrop-blur-sm border border-white/8 rounded-[20px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="px-4 py-4 text-left w-12">
                    <button
                      type="button"
                      onClick={toggleSelectAllFiltered}
                      className={`w-4.5 h-4.5 rounded border-2 flex items-center justify-center transition-all ${
                        allFilteredSelected
                          ? "bg-linear-to-br from-[#ff9f43] to-[#2ed573] border-transparent"
                          : "border-white/30 hover:border-[#ff9f43]"
                      }`}
                    >
                      {allFilteredSelected && <Check size={10} className="text-[#1a0510]" />}
                    </button>
                  </th>
                  <th className="px-4 py-4 text-left text-xs uppercase tracking-wider text-white/50 font-semibold">
                    Product
                  </th>
                  <th className="px-4 py-4 text-left text-xs uppercase tracking-wider text-white/50 font-semibold">
                    SKU
                  </th>
                  <th className="px-4 py-4 text-left text-xs uppercase tracking-wider text-white/50 font-semibold">
                    Category
                  </th>
                  <th className="px-4 py-4 text-left text-xs uppercase tracking-wider text-white/50 font-semibold">
                    Price
                  </th>
                  <th className="px-4 py-4 text-left text-xs uppercase tracking-wider text-white/50 font-semibold">
                    Stock
                  </th>
                  <th className="px-4 py-4 text-left text-xs uppercase tracking-wider text-white/50 font-semibold">
                    Status
                  </th>
                  <th className="px-4 py-4 text-left text-xs uppercase tracking-wider text-white/50 font-semibold">
                    Date
                  </th>
                  <th className="px-4 py-4 text-left text-xs uppercase tracking-wider text-white/50 font-semibold w-12">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-white/8 hover:bg-white/3 hover:border-[#ff9f43]/20 transition-all group"
                  >
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => toggleSelect(product.id)}
                        className={`w-4.5 h-4.5 rounded border-2 flex items-center justify-center transition-all ${
                          selectedItems.includes(String(product.id))
                            ? "bg-linear-to-br from-[#ff9f43] to-[#2ed573] border-transparent"
                            : "border-white/30 hover:border-[#ff9f43]"
                        }`}
                      >
                        {selectedItems.includes(String(product.id)) && (
                          <Check size={10} className="text-[#1a0510]" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3 min-w-55">
                        <img
                          src={product.image}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover border-2 border-white/8 group-hover:border-[#ff9f43] group-hover:scale-105 transition-all"
                        />
                        <div>
                          <div className="font-semibold text-sm">{product.name}</div>
                          <div className="text-xs text-white/40">{product.variant || "—"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-white/60">{product.sku}</td>
                    <td className="px-4 py-4 text-white/60">{product.categoryLabel}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        {product.originalPrice != null && (
                          <span className="text-xs text-white/40 line-through">৳{product.originalPrice}</span>
                        )}
                        <span className="font-bold text-[#2ed573]">৳{product.price}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">{getStockBar(product.stock, product.lowStockThreshold)}</td>
                    <td className="px-4 py-4">{getStatusBadge(product.status)}</td>
                    <td className="px-4 py-4 text-white/50 text-xs">{product.date}</td>
                    <td className="px-4 py-4">
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() =>
                            setDropdownOpen(dropdownOpen === product.id ? null : product.id)
                          }
                          className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center hover:bg-[#ff9f43]/10 hover:border-[#ff9f43] hover:text-[#ff9f43] transition-all"
                        >
                          <MoreVertical size={14} />
                        </button>
                        {dropdownOpen === product.id && (
                          <div className="absolute right-0 top-full mt-2 w-52 bg-[#1a0510]/98 border border-white/8 rounded-xl shadow-2xl z-50 overflow-hidden animate-fadeIn">
                            <button
                              type="button"
                              onClick={() => openQuickView(product)}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors text-left"
                            >
                              <Eye size={14} /> Quick View
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                openEditModal(product);
                                setDropdownOpen(null);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors text-left"
                            >
                              <Edit size={14} /> Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDuplicate(product)}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors text-left"
                            >
                              <Copy size={14} /> Duplicate
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                navigate("/admin/product-variations");
                                setDropdownOpen(null);
                                toast.info("Manage SKUs and combinations on the Variations page.");
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors text-left"
                            >
                              <Layers size={14} /> Variations
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSeoProduct({
                                  id: product.id,
                                  seoTitle: product.seoTitle || "",
                                  seoDescription: product.seoDescription || "",
                                });
                                setDropdownOpen(null);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors text-left"
                            >
                              <SearchIcon size={14} /> SEO Settings
                            </button>
                            <div className="h-px bg-white/8 my-1" />
                            <button
                              type="button"
                              onClick={() => {
                                void patchProduct(product.id, { status: "flash" });
                                setDropdownOpen(null);
                                toast.success("Flash sale enabled.");
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors text-left"
                            >
                              <Zap size={14} /> Add Flash Sale
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setDeleteTarget({ type: "single", id: product.id, label: product.name });
                                setDropdownOpen(null);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#ff4757] hover:bg-[#ff4757]/10 transition-colors text-left"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredProducts.length === 0 && !loading && (
            <div className="text-center py-20">
              <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-white/3 border-2 border-dashed border-white/8 flex items-center justify-center text-4xl text-white/20">
                <Package size={40} />
              </div>
              <div className="text-xl font-bold mb-2">No products found</div>
              <div className="text-white/50 mb-6">Try adjusting your filters or search query</div>
              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#ff9f43] to-[#ffb366] text-[#1a0510] text-sm font-semibold shadow-lg shadow-[#ff9f43]/20"
              >
                <Plus size={16} /> Add New Product
              </button>
            </div>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5 border-t border-white/8">
            <div className="text-sm text-white/50">
              Showing{" "}
              <span className="text-white font-semibold">
                {filteredProducts.length === 0 ? 0 : (safePage - 1) * pageSize + 1}-
                {Math.min(safePage * pageSize, filteredProducts.length)}
              </span>{" "}
              of <span className="text-white font-semibold">{filteredProducts.length}</span> products
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={goPrevPage}
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-white/40 hover:border-[#ff9f43] hover:text-[#ff9f43] transition-all disabled:opacity-30"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="text-sm text-white/60 px-2 min-w-25 text-center">
                Page <span className="text-white font-bold">{safePage}</span> / {totalPages}
              </span>
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={goNextPage}
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-white/40 hover:border-[#ff9f43] hover:text-[#ff9f43] transition-all disabled:opacity-30"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {viewMode === "grid" && paginatedProducts.length === 0 && !loading && (
        <div className="text-center py-16 text-white/50 border border-white/8 rounded-[20px]">
          No products match your filters. Try resetting filters or add a product.
        </div>
      )}

      {viewMode === "grid" && paginatedProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {paginatedProducts.map((product) => {
            const imgUrl = (product.image || PLACEHOLDER_IMG).replace("w=100&h=100", "w=400&h=300");
            const pctOff =
              product.status === "flash" &&
              product.originalPrice &&
              Number(product.originalPrice) > Number(product.price)
                ? Math.round(
                    ((Number(product.originalPrice) - Number(product.price)) /
                      Number(product.originalPrice)) *
                      100
                  )
                : null;
            return (
              <div
                key={product.id}
                className="group bg-[#2d0a1f]/80 backdrop-blur-sm border border-white/8 rounded-[20px] overflow-hidden hover:-translate-y-1.5 hover:border-[#ff9f43]/30 hover:shadow-[0_0_40px_rgba(255,159,67,0.1),0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300"
              >
                <div className="relative h-52 overflow-hidden">
                  <img src={imgUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  {pctOff != null && (
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-linear-to-r from-[#ff9f43]/90 to-[#ffa502]/90 text-[#1a0510]">
                      <Zap size={10} /> -{pctOff}%
                    </span>
                  )}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <button
                      type="button"
                      onClick={() => openQuickView(product)}
                      className="w-9 h-9 rounded-xl bg-[#1a0510]/80 backdrop-blur-sm border border-white/8 flex items-center justify-center hover:bg-[#ff9f43] hover:border-[#ff9f43] hover:text-[#1a0510] transition-all"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(product)}
                      className="w-9 h-9 rounded-xl bg-[#1a0510]/80 backdrop-blur-sm border border-white/8 flex items-center justify-center hover:bg-[#ff9f43] hover:border-[#ff9f43] hover:text-[#1a0510] transition-all"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => void patchProduct(product.id, { featured: !product.featured })}
                      className={`w-9 h-9 rounded-xl bg-[#1a0510]/80 backdrop-blur-sm border border-white/8 flex items-center justify-center transition-all ${
                        product.featured
                          ? "text-[#ff4757] border-[#ff4757]"
                          : "hover:bg-[#ff4757] hover:border-[#ff4757] hover:text-white"
                      }`}
                    >
                      <Heart size={14} className={product.featured ? "fill-current" : ""} />
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-xs font-semibold text-[#ff9f43] uppercase tracking-wider mb-1">
                    {product.categoryLabel}
                  </div>
                  <h3 className="font-bold text-base mb-3 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xs text-white/45 line-clamp-2 max-w-[55%]">
                      {product.variant || "—"}
                    </div>
                    <div
                      className={`text-xs flex items-center gap-1 ${
                        product.stock > 400
                          ? "text-[#2ed573]"
                          : product.stock > 100
                            ? "text-[#ffa502]"
                            : "text-[#ff4757]"
                      }`}
                    >
                      {product.stock > 400 ? (
                        <CheckCircle size={12} />
                      ) : product.stock > 100 ? (
                        <AlertTriangle size={12} />
                      ) : (
                        <XCircle size={12} />
                      )}
                      {product.stock} left
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/8">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-extrabold text-[#2ed573]">৳{product.price}</span>
                      {product.originalPrice != null && (
                        <span className="text-sm text-white/40 line-through">৳{product.originalPrice}</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => openEditModal(product)}
                      className="px-4 py-2 rounded-xl bg-linear-to-r from-[#ff9f43] to-[#ffb366] text-[#1a0510] text-xs font-bold hover:shadow-lg hover:shadow-[#ff9f43]/30 transition-all"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewMode === "compact" && paginatedProducts.length === 0 && !loading && (
        <div className="text-center py-16 text-white/50 border border-white/8 rounded-[20px]">
          No products match your filters.
        </div>
      )}

      {viewMode === "compact" && paginatedProducts.length > 0 && (
        <div className="flex flex-col gap-3">
          {paginatedProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 p-4 bg-[#2d0a1f]/80 backdrop-blur-sm border border-white/8 rounded-xl hover:border-[#ff9f43]/20 hover:bg-[#4a0e2e]/90 transition-all"
            >
              <button
                type="button"
                onClick={() => toggleSelect(product.id)}
                className={`w-4.5 h-4.5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
                  selectedItems.includes(String(product.id))
                    ? "bg-linear-to-br from-[#ff9f43] to-[#2ed573] border-transparent"
                    : "border-white/30 hover:border-[#ff9f43]"
                }`}
              >
                {selectedItems.includes(String(product.id)) && (
                  <Check size={10} className="text-[#1a0510]" />
                )}
              </button>
              <img
                src={product.image}
                alt=""
                className="w-14 h-14 rounded-xl object-cover border-2 border-white/8 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">
                  {product.name} - {product.variant || "—"}
                </div>
                <div className="flex items-center gap-3 text-xs text-white/50 mt-1 flex-wrap">
                  <span>SKU: {product.sku}</span>
                  <span>{product.categoryLabel}</span>
                </div>
              </div>
              <div className="hidden sm:block">{getStatusBadge(product.status)}</div>
              <div className="font-bold text-[#2ed573] min-w-15 text-right">৳{product.price}</div>
              <button
                type="button"
                onClick={() => openEditModal(product)}
                className="text-xs text-[#ff9f43] font-semibold px-2 py-1 rounded-lg hover:bg-[#ff9f43]/10"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}

      {productModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl border border-white/12 bg-linear-to-b from-[#3d1430] via-[#2d0a1f] to-[#1a0510] shadow-[0_0_0_1px_rgba(255,159,67,0.06),0_25px_80px_rgba(0,0,0,0.55),0_0_120px_rgba(255,159,67,0.12)] overflow-hidden">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage: "radial-gradient(circle at 20% 0%, #ff9f43 0%, transparent 45%)",
              }}
            />
            <div className="relative shrink-0 flex items-start gap-4 px-6 pt-6 pb-4 border-b border-white/8 bg-black/20">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#ff9f43] to-[#ffb366] text-[#1a0510] shadow-lg shadow-[#ff9f43]/25">
                <Package size={22} strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
                  {editingId ? "Edit product" : "Add product"}
                </h2>
                
              </div>
              <button
                type="button"
                onClick={() => {
                  setProductModalOpen(false);
                  setEditingId(null);
                }}
                className="p-2.5 rounded-xl hover:bg-white/10 text-white/55 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative flex-1 overflow-y-auto scrollbar-none px-6 py-5 space-y-5">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wide text-white/45">Prodcut Titel *</label>
                <input
                  value={form.name}
                  onChange={(e) =>{
                    const name = e.target.value;
                    setForm((f) => ({ 
                      ...f, 
                      name,  
                      sku: !editingId ? generateSku(name) : f.sku,
                    }));
                  }}
                  className="mt-1.5 w-full px-4 py-3 rounded-2xl bg-white/6 border border-white/10 text-white text-sm placeholder-white/25 focus:border-[#ff9f43] focus:ring-2 focus:ring-[#ff9f43]/20 outline-none transition-all"
                  placeholder="Product name"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wide text-white/45">SKU *</label>
                <div className="relative mt-1.5">
                  <input
                    value={form.sku}
                    onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
                    className="mt-1.5 w-full px-4 py-3 rounded-2xl bg-white/6 border border-white/10 text-white text-sm focus:border-[#ff9f43] focus:ring-2 focus:ring-[#ff9f43]/20 outline-none transition-all"
                    placeholder="Unique SKU"
                  />
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, sku: generateSku(f.name) }))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-[#ff9f43]/15 text-[#ff9f43] text-[11px] font-bold hover:bg-[#ff9f43]/25 transition-all cursor-pointer"
                  >
                    Generate
                  </button>
                </div>
                
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Layers size={16} className="text-[#ff9f43]" />
                    <span className="text-sm font-bold text-white">Variants</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-white/55">
                      {(form.variationIds || []).length} selected
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAllVariations(true)}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white/5 text-[#ff9f43] hover:bg-[#ff9f43]/15 border border-[#ff9f43]/25 cursor-pointer"
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setAllVariations(false)}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white/5 text-white/50 hover:bg-white/10 border border-white/10 cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto rounded-xl border border-white/8 bg-[#1a0510]/60 divide-y divide-white/6">
                  {variationCatalog.length === 0 ? (
                    <div className="p-6 text-center text-sm text-white/40">
                      কোনো ভ্যারিয়েশন নেই। আগে{" "}
                      <button
                        type="button"
                        className="text-[#ff9f43] font-semibold underline-offset-2 hover:underline"
                        onClick={() => {
                          navigate("/admin/product-variations");
                          setProductModalOpen(false);
                        }}
                      >
                        Variations
                      </button>{" "}
                      পেজে তৈরি করুন।
                    </div>
                  ) : (
                    variationCatalog.map((v) => {
                      const id = String(v._id);
                      const checked = (form.variationIds || []).map(String).includes(id);
                      return (
                        <label
                          key={id}
                          className={`flex items-start gap-3 px-3 py-2.5 cursor-pointer hover:bg-white/4 transition-colors ${checked ? "bg-[#ff9f43]/8" : ""}`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleVariationId(id)}
                            className="mt-1 rounded border-white/25 text-[#ff9f43] focus:ring-[#ff9f43]"
                          />
                          <span className="text-sm text-white/85 leading-snug">{formatVariationOptionLabel(v)}</span>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wide text-white/45">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, category: e.target.value, subCategory: "" }))
                    }
                    style={{ backgroundColor: "#2d0a1f", color: "#fff" }}
                    className="mt-1.5 w-full px-4 py-3 rounded-2xl bg-white/6 border border-white/10 text-white text-sm focus:border-[#ff9f43] outline-none"
                  >
                    <option value="">—</option>
                    {categoriesActive.map((c) => (
                      <option key={c._id} value={c._id} className="bg-[#1a0510]">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wide text-white/45">
                    Subcategory
                  </label>
                  <select
                    value={form.subCategory}
                    disabled={!form.category}
                    onChange={(e) => setForm((f) => ({ ...f, subCategory: e.target.value }))}
                    style={{ backgroundColor: "#2d0a1f", color: "#fff" }}
                    className="mt-1.5 w-full px-4 py-3 rounded-2xl bg-white/6 border border-white/10 text-white text-sm focus:border-[#ff9f43] outline-none disabled:opacity-45"
                  >
                    <option value="">
                      {form.category ? "—" : "প্রথমে ক্যাটাগরি বেছে নিন"}
                    </option>
                    {formSubCategories.map((s) => (
                      <option key={s._id} value={s._id} className="bg-[#1a0510]">
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wide text-white/45">
                    Discount Price (৳) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    className="mt-1.5 w-full px-4 py-3 rounded-2xl bg-white/6 border border-white/10 text-white text-sm focus:border-[#ff9f43] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wide text-white/45">
                    Original price (৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.originalPrice}
                    onChange={(e) => setForm((f) => ({ ...f, originalPrice: e.target.value }))}
                    className="mt-1.5 w-full px-4 py-3 rounded-2xl bg-white/6 border border-white/10 text-white text-sm focus:border-[#ff9f43] outline-none"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wide text-white/45">Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                    className="mt-1.5 w-full px-4 py-3 rounded-2xl bg-white/6 border border-white/10 text-white text-sm focus:border-[#ff9f43] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wide text-white/45">
                    Min. stock alert
                  </label>
                  <p className="text-[10px] text-white/35 mt-0.5 mb-1">
                    স্টক এই সংখ্যার নিচে নামলে সতর্কতা দেখাবে
                  </p>
                  <input
                    type="number"
                    min="0"
                    value={form.lowStockThreshold}
                    onChange={(e) => setForm((f) => ({ ...f, lowStockThreshold: e.target.value }))}
                    className="w-full px-4 py-3 rounded-2xl bg-white/6 border border-white/10 text-white text-sm focus:border-[#a55eea] outline-none"
                    placeholder="e.g. 10"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wide text-white/45 mb-1.5 block">
                  Description
                </label>
                <ProductDescriptionEditor
                  mountKey={descriptionEditorKey}
                  value={form.description}
                  onChange={(html) => setForm((f) => ({ ...f, description: html }))}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wide text-white/45">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    style={{ backgroundColor: "#2d0a1f", color: "#fff" }}
                    className="mt-1.5 w-full px-4 py-3 rounded-2xl bg-white/6 border border-white/10 text-white text-sm focus:border-[#ff9f43] outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="flash">Flash sale</option>
                    <option value="outstock">Out of stock</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <label className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/4 border border-white/8 cursor-pointer">
                  <input
                    id="feat"
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                    className="rounded border-white/25 text-[#ff9f43] focus:ring-[#ff9f43]"
                  />
                  <span className="text-sm text-white/75">Featured (heart on grid)</span>
                </label>
              </div>

              <div className="rounded-2xl border border-dashed border-[#ff9f43]/25 bg-linear-to-br from-[#ff9f43]/[0.07] to-transparent p-5">
                <label className="text-[11px] font-semibold uppercase tracking-wide text-white/45">
                  Product images
                </label>
                <p className="text-[11px] text-white/40 mt-1 leading-relaxed">
                  প্রথম ছবি থাম্বনেইল। শুধু ডিভাইস থেকে ছবি — URL ব্যবহার করা যাবে না।
                </p>
                <input
                  ref={imageFileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageFiles}
                />
                <button
                  type="button"
                  onClick={() => imageFileInputRef.current?.click()}
                  className="mt-4 group relative w-full overflow-hidden rounded-2xl border-2 border-[#ff9f43]/35 bg-linear-to-r from-[#ff9f43]/20 via-[#ffb366]/15 to-[#ff9f43]/10 px-6 py-4 text-left shadow-inner shadow-black/20 transition-all hover:border-[#ff9f43]/60 hover:shadow-[0_0_40px_rgba(255,159,67,0.15)] cursor-pointer"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-linear-to-r from-[#ff9f43]/10 to-transparent pointer-events-none" />
                  <div className="relative flex items-center justify-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-[#ff9f43] to-[#ffb366] text-[#1a0510] shadow-lg">
                      <Sparkles size={22} />
                    </span>
                    <div>
                      <span className="block text-base font-bold text-white group-hover:text-[#ffb366] transition-colors">
                        ছবি নির্বাচন করুন
                      </span>
                      <span className="text-xs text-white/45">এক বা একাধিক ফাইল · JPG, PNG, WebP</span>
                    </div>
                    <ImagePlus size={24} className="text-[#ff9f43] ml-auto shrink-0 opacity-90" />
                  </div>
                </button>
                {form.imageUrls.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                    {form.imageUrls.map((url, idx) => (
                      <div
                        key={`${idx}-${url.slice(0, 48)}`}
                        className="relative group rounded-xl border border-white/10 overflow-hidden bg-black/20"
                      >
                        {idx === 0 && (
                          <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-[#ff9f43] text-[#1a0510]">
                            Thumbnail
                          </span>
                        )}
                        <img src={url} alt="" className="w-full aspect-square object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 flex-wrap p-2">
                          <button
                            type="button"
                            title="আগে নিন"
                            disabled={idx === 0}
                            onClick={() => moveImage(idx, -1)}
                            className="p-1.5 rounded-lg bg-white/15 text-white hover:bg-[#ff9f43] hover:text-[#1a0510] disabled:opacity-30 disabled:pointer-events-none"
                          >
                            <ChevronUp size={16} />
                          </button>
                          <button
                            type="button"
                            title="পরে নিন"
                            disabled={idx === form.imageUrls.length - 1}
                            onClick={() => moveImage(idx, 1)}
                            className="p-1.5 rounded-lg bg-white/15 text-white hover:bg-[#ff9f43] hover:text-[#1a0510] disabled:opacity-30 disabled:pointer-events-none"
                          >
                            <ChevronDown size={16} />
                          </button>
                          <button
                            type="button"
                            title="মুছুন"
                            onClick={() => removeImage(idx)}
                            className="p-1.5 rounded-lg bg-[#ff4757]/80 text-white hover:bg-[#ff4757]"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 py-10 rounded-xl border border-white/6 bg-black/20 text-center text-sm text-white/35">
                    কোনো ছবি নেই — উপরের বাটনে ক্লিক করে যোগ করুন
                  </div>
                )}
              </div>
            </div>

            <div className="relative shrink-0 flex gap-3 justify-end px-6 py-4 border-t border-white/8 bg-black/30">
              <button
                type="button"
                onClick={() => {
                  setProductModalOpen(false);
                  setEditingId(null);
                }}
                className="px-5 py-2.5 rounded-xl cursor-pointer border border-white/12 text-white/75 text-sm font-semibold hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => void handleSaveProduct()}
                className="px-6 py-2.5 rounded-xl cursor-pointer bg-linear-to-r from-[#ff9f43] to-[#ffb366] text-[#1a0510] text-sm font-bold shadow-lg shadow-[#ff9f43]/25 hover:shadow-[#ff9f43]/40 disabled:opacity-50"
              >
                {saving ? "Saving…" : editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {quickViewProduct && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#2d0a1f] border border-white/12 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
              <h2 className="text-lg font-bold text-white">Quick view</h2>
              <button
                type="button"
                onClick={() => setQuickViewProduct(null)}
                className="p-2 rounded-lg hover:bg-white/10 text-white/60"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 grid md:grid-cols-2 gap-6">
              <div>
                <div className="aspect-square rounded-xl overflow-hidden border border-white/8 mb-3">
                  <img
                    src={galleryFor(quickViewProduct)[activeImage] || PLACEHOLDER_IMG}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {galleryFor(quickViewProduct).map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImage(i)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 ${
                        activeImage === i ? "border-[#ff9f43]" : "border-white/10"
                      }`}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <div className="text-[#ff9f43] text-xs font-bold uppercase">{quickViewProduct.categoryLabel}</div>
                <h3 className="text-2xl font-bold">{quickViewProduct.name}</h3>
                <p className="text-white/50 text-sm">{quickViewProduct.variant || "—"}</p>
                <div className="flex items-center gap-2">
                  {getStatusBadge(quickViewProduct.status)}
                  <span className="text-white/40 text-xs">SKU: {quickViewProduct.sku}</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-[#2ed573]">৳{quickViewProduct.price}</span>
                  {quickViewProduct.originalPrice != null && (
                    <span className="text-lg text-white/40 line-through">৳{quickViewProduct.originalPrice}</span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/8">
                    <div className="text-white/40 text-xs">Stock</div>
                    <div className="font-bold">{quickViewProduct.stock}</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/8">
                    <div className="text-white/40 text-xs">Min. stock alert</div>
                    <div className="font-bold">{quickViewProduct.lowStockThreshold ?? "—"}</div>
                  </div>
                </div>
                {stripHtml(quickViewProduct.description) ? (
                  <p className="text-sm text-white/55 line-clamp-4 border-l-2 border-[#ff9f43]/50 pl-3">
                    {stripHtml(quickViewProduct.description)}
                  </p>
                ) : null}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      openEditModal(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-linear-to-r from-[#ff9f43] to-[#ffb366] text-[#1a0510] text-sm font-bold"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickViewProduct(null)}
                    className="px-4 py-2.5 rounded-xl border border-white/8 text-white/70 text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {seoProduct && (
        <div className="fixed inset-0 z-100  flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#2d0a1f] border border-white/12 rounded-2xl max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
              <h2 className="text-lg font-bold text-white">SEO settings</h2>
              <button
                type="button"
                onClick={() => setSeoProduct(null)}
                className="p-2 rounded-lg hover:bg-white/10 text-white/60"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs text-white/50">Meta title</label>
                <input
                  value={seoProduct.seoTitle}
                  onChange={(e) => setSeoProduct((s) => ({ ...s, seoTitle: e.target.value }))}
                  className="mt-1 w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/8 text-white text-sm outline-none focus:border-[#ff9f43]"
                />
              </div>
              <div>
                <label className="text-xs text-white/50">Meta description</label>
                <textarea
                  value={seoProduct.seoDescription}
                  onChange={(e) => setSeoProduct((s) => ({ ...s, seoDescription: e.target.value }))}
                  rows={4}
                  className="mt-1 w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/8 text-white text-sm outline-none focus:border-[#ff9f43] resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end px-6 py-4 border-t border-white/8">
              <button
                type="button"
                onClick={() => setSeoProduct(null)}
                className="px-4 py-2 rounded-xl border border-white/8 text-white/70 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void saveSeo()}
                className="px-4 py-2 rounded-xl bg-linear-to-r from-[#ff9f43] to-[#ffb366] text-[#1a0510] text-sm font-bold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-100  flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#2d0a1f] border border-white/12 rounded-2xl max-w-sm w-full shadow-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-2">Confirm delete</h3>
            <p className="text-white/60 text-sm mb-6">
              {deleteTarget.type === "bulk"
                ? `Delete ${deleteTarget.count} selected product(s)? This cannot be undone.`
                : `Delete “${deleteTarget.label}”? This cannot be undone.`}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl border border-white/8 text-white/70 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() =>
                  void (deleteTarget.type === "bulk" ? handleBulkDelete() : handleDeleteOne())
                }
                className="px-4 py-2 rounded-xl bg-[#ff4757] text-white text-sm font-bold"
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
