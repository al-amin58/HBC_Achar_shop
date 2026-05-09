import { useState, useEffect } from 'react';
import {
  Plus, X, GripVertical, Trash2, Edit2, Save, Wand2, Copy, Search,
  CheckSquare, Square, ImagePlus, Zap, Tag, Layers,
  SlidersHorizontal, ArrowRightLeft,
  Sparkles, Box, AlertTriangle,
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../api/axios';

const isMongoId = (id) => typeof id === 'string' && /^[a-f\d]{24}$/i.test(id);

const mapAttr = (a) => ({
  id: String(a._id),
  name: a.name,
  values: a.values || [],
  order: a.order ?? 0,
});

const mapVar = (v) => ({
  id: String(v._id),
  sku: v.sku,
  attributes: (v.combination || []).map((c) => ({
    attrId: String(c.attributeId),
    attrName: c.attributeName,
    value: c.value,
  })),
  price: v.price ?? '',
  discountPrice: v.discountPrice ?? '',
  stock: v.stock ?? '',
  flashSale: !!v.flashSale,
  cashback: v.cashback ?? '',
  image: v.image ?? null,
});

const variationToApi = (v) => ({
  sku: v.sku,
  combination: v.attributes.map((a) => ({
    attributeId: a.attrId,
    attributeName: a.attrName,
    value: a.value,
  })),
  price: v.price,
  discountPrice: v.discountPrice,
  stock: v.stock,
  flashSale: v.flashSale,
  cashback: v.cashback,
  image: v.image,
});

const getApiErrorMessage = (err, fallback) =>
  err?.response?.data?.message ||
  (typeof err?.response?.data === 'string' ? err.response.data : null) ||
  err?.message ||
  fallback;

const generateSKU = (productName, attrs) => {
  const prefix = productName?.slice(0, 3).toUpperCase() || 'HBC';
  const suffix = attrs.map(a => a.value?.slice(0, 3).toUpperCase()).join('-');
  return `${prefix}-${suffix}-${Math.floor(Math.random() * 1000)}`;
};

/* ─── Sub Components ─── */
const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <p className="text-purple-200 text-sm mt-1">{subtitle}</p>
    </div>
    {action}
  </div>
);

const GlassCard = ({ children, className = '' }) => (
  <div className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl ${className}`}>
    {children}
  </div>
);

/* ─── Main Page ─── */
const VariationsPage = () => {
  /* -- State -- */
  const [attributes, setAttributes] = useState([]);
  const [variations, setVariations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedVariationIds, setSelectedVariationIds] = useState(new Set());
  const [bulkEditOpen, setBulkEditOpen] = useState(false);
  const [bulkData, setBulkData] = useState({ price: '', stock: '', flashSale: false });

  // Attribute modal: null | 'new' | existing attribute id
  const [attributeModal, setAttributeModal] = useState(null);
  const [attrForm, setAttrForm] = useState({ name: '', values: [], input: '' });
  const [attrSubmitting, setAttrSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [generateSubmitting, setGenerateSubmitting] = useState(false);

  const refreshCatalog = async () => {
    const [attrRes, varRes] = await Promise.all([
      api.get('/product-attributes'),
      api.get('/product-variations'),
    ]);
    setAttributes(attrRes.data.map(mapAttr));
    setVariations(varRes.data.map(mapVar));
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        await refreshCatalog();
      } catch (err) {
        if (!cancelled) {
          toast.error(err?.response?.data?.message || 'Failed to load product configuration.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  /* -- Generate Variations -- */
  const generateVariations = async () => {
    if (attributes.length === 0) {
      toast.error('Add at least one attribute first!');
      return;
    }
    if (attributes.some(a => a.values.length === 0)) {
      toast.error('All attributes must have at least one value!');
      return;
    }

    const cartesian = (arr) =>
      arr.reduce((a, b) => a.flatMap(d => b.values.map(e => [...d, { attrId: b.id, attrName: b.name, value: e }])), [[]]);

    const combos = cartesian(attributes);
    const newVars = combos.map((combo, idx) => {
      const existing = variations.find(v =>
        JSON.stringify(v.attributes.map(a => a.value).sort()) === JSON.stringify(combo.map(a => a.value).sort())
      );
      return existing || {
        id: `var-${Date.now()}-${idx}`,
        sku: generateSKU('Achar', combo),
        attributes: combo,
        price: '',
        discountPrice: '',
        stock: '',
        flashSale: false,
        cashback: '',
        image: null,
      };
    });

    try {
      setGenerateSubmitting(true);
      const { data } = await api.post('/product-variations/replace-all', {
        variations: newVars.map(variationToApi),
      });
      const list = (data.variations || []).map(mapVar);
      setVariations(list);
      setSelectedVariationIds(new Set());
      toast.success(`${list.length} variation${list.length !== 1 ? 's' : ''} saved.`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save variations.');
    } finally {
      setGenerateSubmitting(false);
    }
  };

  /* -- Attribute Handlers -- */
  const closeAttributeModal = () => {
    setAttributeModal(null);
    setAttrForm({ name: '', values: [], input: '' });
  };

  const startAddAttribute = () => {
    setAttrForm({ name: '', values: [], input: '' });
    setAttributeModal('new');
  };

  const startEditAttribute = (attr) => {
    setAttrForm({ name: attr.name, values: [...attr.values], input: '' });
    setAttributeModal(attr.id);
  };

  const saveAttribute = async () => {
    if (!attrForm.name.trim()) {
      toast.error('Attribute name is required');
      return;
    }
    if (attrForm.values.length === 0) {
      toast.error('Add at least one value');
      return;
    }

    try {
      setAttrSubmitting(true);
      if (attributeModal === 'new') {
        const { data } = await api.post('/product-attributes', {
          name: attrForm.name.trim(),
          values: attrForm.values,
        });
        setAttributes((prev) => [...prev, mapAttr(data.attribute)]);
        toast.success('Attribute added!');
      } else if (attributeModal) {
        const { data } = await api.put(`/product-attributes/${attributeModal}`, {
          name: attrForm.name.trim(),
          values: attrForm.values,
        });
        setAttributes((prev) =>
          prev.map((a) => (a.id === attributeModal ? mapAttr(data.attribute) : a))
        );
        toast.success('Attribute updated!');
      }
      closeAttributeModal();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not save attribute.'));
    } finally {
      setAttrSubmitting(false);
    }
  };

  const openDeleteAttribute = (attr) => {
    setDeleteConfirm({
      type: 'attribute',
      id: attr.id,
      title: attr.name,
      detail: 'Related generated variations may no longer match this attribute. Regenerate variations after changes.',
    });
  };

  const openDeleteVariation = (varObj) => {
    const detail = varObj.attributes.map(a => `${a.attrName}: ${a.value}`).join(' · ');
    setDeleteConfirm({
      type: 'variation',
      id: varObj.id,
      title: varObj.sku || 'Variation',
      detail,
    });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      setDeleteSubmitting(true);
      if (deleteConfirm.type === 'attribute') {
        await api.delete(`/product-attributes/${deleteConfirm.id}`);
        toast.success('Attribute deleted.');
        await refreshCatalog();
      } else {
        const vid = deleteConfirm.id;
        if (isMongoId(vid)) {
          await api.delete(`/product-variations/${vid}`);
        }
        setVariations((prev) => prev.filter((v) => v.id !== vid));
        setSelectedVariationIds((prev) => {
          const n = new Set(prev);
          n.delete(vid);
          return n;
        });
        toast.success('Variation deleted.');
      }
      setDeleteConfirm(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Delete failed.');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const addValueChip = (e) => {
    if (e.key === 'Enter' && attrForm.input.trim()) {
      e.preventDefault();
      if (!attrForm.values.includes(attrForm.input.trim())) {
        setAttrForm(prev => ({ ...prev, values: [...prev.values, prev.input.trim()], input: '' }));
      }
    }
  };

  const removeValueChip = (val) => {
    setAttrForm(prev => ({ ...prev, values: prev.values.filter(v => v !== val) }));
  };

  /* -- Variation Handlers -- */
  const updateVariation = (id, field, value) => {
    setVariations(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
  };


  const copyVariation = async (varObj) => {
    const sku = `${varObj.sku}-COPY`;
    try {
      const { data } = await api.post('/product-variations', variationToApi({ ...varObj, sku }));
      setVariations((prev) => [...prev, mapVar(data.variation)]);
      toast.success('Variation copied!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not copy variation.');
    }
  };

  const saveVariation = async (varObj) => {
    if (!isMongoId(varObj.id)) {
      toast.error('Generate variations first to sync with the server, then you can save edits.');
      return;
    }
    try {
      const { data } = await api.put(`/product-variations/${varObj.id}`, variationToApi(varObj));
      setVariations((prev) => prev.map((v) => (v.id === varObj.id ? mapVar(data.variation) : v)));
      toast.success('Variation saved!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not save variation.');
    }
  };

  const toggleSelectAll = () => {
    if (selectedVariationIds.size === filteredVariations.length && filteredVariations.length > 0) {
      setSelectedVariationIds(new Set());
    } else {
      setSelectedVariationIds(new Set(filteredVariations.map(v => v.id)));
    }
  };

  const applyBulkEdit = async () => {
    const next = variations.map((v) => {
      if (!selectedVariationIds.has(v.id)) return v;
      return {
        ...v,
        price: bulkData.price !== '' ? bulkData.price : v.price,
        stock: bulkData.stock !== '' ? bulkData.stock : v.stock,
        flashSale: bulkData.flashSale,
      };
    });
    setVariations(next);
    setBulkEditOpen(false);
    toast.success('Bulk update applied!');

    const ids = [...selectedVariationIds].filter(isMongoId);
    if (ids.length === 0) return;
    try {
      await Promise.all(
        ids.map((id) => {
          const v = next.find((x) => x.id === id);
          return v ? api.put(`/product-variations/${id}`, variationToApi(v)) : Promise.resolve();
        })
      );
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Some bulk changes could not be saved.');
    }
  };

  /* -- Derived -- */
  const q = search.toLowerCase();
  const filteredVariations = !search
    ? variations
    : variations.filter(
        (v) =>
          (v.sku || '').toLowerCase().includes(q) ||
          v.attributes.some((a) => a.value.toLowerCase().includes(q))
      );

  const allSelected = filteredVariations.length > 0 && selectedVariationIds.size === filteredVariations.length;

  /* -- Render -- */
  return (
    <div className="min-h-screen bg-[#4A1942] p-6 md:p-8 space-y-8">
      {/* Header */}
      <SectionHeader
        title="Product Configuration"
        subtitle="Build attributes & generate variations for HBC Achar"
        action={
          <button
            type="button"
            disabled={generateSubmitting || loading}
            onClick={generateVariations}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-green-300 to-green-400 text-[#4A1942] text-sm font-bold shadow-lg shadow-green-500/20 hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            <Plus size={18} /> {generateSubmitting ? 'Saving…' : 'Save Variations'}
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Attributes', value: attributes.length, icon: SlidersHorizontal, color: 'from-orange-300 to-orange-400' },
          { label: 'Variations', value: variations.length, icon: Layers, color: 'from-green-300 to-green-400' },
          { label: 'Active Flash Sales', value: variations.filter(v => v.flashSale).length, icon: Zap, color: 'from-amber-300 to-amber-400' },
        ].map((stat, idx) => (
          <div key={idx} className={`rounded-2xl bg-gradient-to-br ${stat.color} p-5 text-[#4A1942] shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#4A1942]/70 text-sm mb-1 font-semibold">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <stat.icon size={28} className="text-[#4A1942]/30" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* ═══════════════════════════════════════
            SECTION 1: ATTRIBUTE BUILDER
        ═══════════════════════════════════════ */}
        <div className="xl:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Tag size={18} className="text-orange-300" /> Attributes
            </h3>
            <button
              onClick={startAddAttribute}
              className="px-3 py-1.5 rounded-xl bg-orange-300/15 text-orange-300 text-xs font-bold hover:bg-orange-300/25 transition-colors flex items-center gap-1 border border-orange-300/20"
            >
              <Plus size={14} /> Add New
            </button>
          </div>

          <div className="space-y-3">
            {loading && (
              <GlassCard className="p-6 text-purple-200 text-sm">Loading attributes…</GlassCard>
            )}
            {!loading && attributes.map((attr) => (
              <GlassCard key={attr.id} className="p-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <GripVertical size={16} className="text-purple-400 cursor-grab" />
                      <span className="font-bold text-white">{attr.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <button type="button" onClick={() => startEditAttribute(attr)} className="p-1.5 rounded-lg hover:bg-orange-300/15 text-orange-300 transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button type="button" onClick={() => openDeleteAttribute(attr)} className="p-1.5 rounded-lg hover:bg-red-400/15 text-red-300 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {attr.values.map(v => (
                      <span key={v} className="px-2.5 py-1 rounded-lg bg-purple-300/10 text-purple-200 text-xs font-medium border border-purple-300/15">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              </GlassCard>
            ))}

            {attributes.length === 0 && (
              <div className="text-center py-8 text-purple-300 text-sm">
                <Box size={32} className="mx-auto mb-2 opacity-40" />
                No attributes yet. Click "Add New" to start.
              </div>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════
            SECTION 2: VARIATION GENERATOR
        ═══════════════════════════════════════ */}
        <div className="xl:col-span-8 space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300" size={16} />
              <input
                type="text"
                placeholder="Search by SKU or attribute value..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-400 text-sm focus:border-orange-300 focus:ring-2 focus:ring-orange-300/20 outline-none"
              />
            </div>

            <div className="flex gap-2">
              {selectedVariationIds.size > 0 && (
                <button
                  onClick={() => setBulkEditOpen(!bulkEditOpen)}
                  className="px-3 py-2 rounded-xl bg-orange-300/15 text-orange-300 text-xs font-bold hover:bg-orange-300/25 transition-colors border border-orange-300/20 flex items-center gap-1.5"
                >
                  <ArrowRightLeft size={14} /> Bulk Edit ({selectedVariationIds.size})
                </button>
              )}
              <button
                type="button"
                disabled={generateSubmitting || loading}
                onClick={generateVariations}
                className="px-3 py-2 rounded-xl bg-white/10 text-purple-200 text-xs font-bold hover:bg-white/15 transition-colors border border-white/10 flex items-center gap-1.5 disabled:opacity-50"
              >
                <Sparkles size={14} /> {generateSubmitting ? 'Saving…' : 'Regenerate'}
              </button>
            </div>
          </div>

          {/* Bulk Edit Panel */}
          {bulkEditOpen && (
            <GlassCard className="p-4 border-orange-300/20">
              <div className="flex flex-col md:flex-row gap-3 items-end">
                <div className="flex-1">
                  <label className="text-xs font-semibold text-purple-200 mb-1 block">Price (৳)</label>
                  <input
                    type="number"
                    value={bulkData.price}
                    onChange={e => setBulkData(p => ({ ...p, price: e.target.value }))}
                    placeholder="Leave empty to keep"
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-500 text-sm outline-none focus:border-orange-300"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-purple-200 mb-1 block">Stock</label>
                  <input
                    type="number"
                    value={bulkData.stock}
                    onChange={e => setBulkData(p => ({ ...p, stock: e.target.value }))}
                    placeholder="Leave empty to keep"
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-500 text-sm outline-none focus:border-orange-300"
                  />
                </div>
                <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={bulkData.flashSale}
                    onChange={e => setBulkData(p => ({ ...p, flashSale: e.target.checked }))}
                    className="accent-orange-300 w-4 h-4"
                  />
                  <span className="text-xs font-semibold text-purple-200">Flash Sale</span>
                </label>
                <button onClick={applyBulkEdit} className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-300 to-green-400 text-[#4A1942] text-xs font-bold hover:shadow-lg transition-all">
                  Apply to Selected
                </button>
              </div>
            </GlassCard>
          )}

          {/* Select All Bar */}
          {variations.length > 0 && (
            <div className="flex items-center gap-3 px-1">
              <button onClick={toggleSelectAll} className="flex items-center gap-2 text-xs font-semibold text-purple-200 hover:text-white transition-colors">
                {allSelected ? <CheckSquare size={16} className="text-orange-300" /> : <Square size={16} />}
                {allSelected ? 'Deselect All' : 'Select All'}
              </button>
              <span className="text-xs text-purple-400">{filteredVariations.length} variation{filteredVariations.length !== 1 ? 's' : ''}</span>
            </div>
          )}

          {/* Variations Grid */}
          {loading ? (
            <GlassCard className="p-12 text-center text-purple-200 text-sm">Loading variations…</GlassCard>
          ) : variations.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-300/20 to-purple-300/10 flex items-center justify-center mx-auto mb-4 border border-white/10">
                <Layers size={28} className="text-orange-300" />
              </div>
              <h4 className="text-white font-bold mb-1">No Variations Yet</h4>
              <p className="text-purple-300 text-sm mb-4">Add attributes and click "Generate Variations" to create product combinations.</p>
              <button
                type="button"
                disabled={generateSubmitting}
                onClick={generateVariations}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-300 to-orange-400 text-[#4A1942] text-sm font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {generateSubmitting ? 'Saving…' : 'Generate Now'}
              </button>
            </GlassCard>
          ) : filteredVariations.length === 0 ? (
            <GlassCard className="p-8 text-center text-purple-300 text-sm">No matching variations found.</GlassCard>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredVariations.map((varObj) => {
                const isSelected = selectedVariationIds.has(varObj.id);

                return (
                  <GlassCard key={varObj.id} className={`p-5 transition-all ${isSelected ? 'border-orange-300/40 bg-white/8' : ''}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const next = new Set(selectedVariationIds);
                            next.has(varObj.id) ? next.delete(varObj.id) : next.add(varObj.id);
                            setSelectedVariationIds(next);
                          }}
                          className="text-purple-300 hover:text-orange-300 transition-colors"
                        >
                          {isSelected ? <CheckSquare size={18} className="text-orange-300" /> : <Square size={18} />}
                        </button>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            {varObj.attributes.map(a => (
                              <span key={a.attrId + a.value} className="px-2 py-0.5 rounded-md bg-purple-300/10 text-purple-200 text-[10px] font-bold uppercase tracking-wider border border-purple-300/15">
                                {a.attrName}: {a.value}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button type="button" onClick={() => copyVariation(varObj)} className="p-1.5 rounded-lg hover:bg-white/10 text-purple-300 transition-colors" title="Copy">
                          <Copy size={14} />
                        </button>
                        <button type="button" onClick={() => openDeleteVariation(varObj)} className="p-1.5 rounded-lg hover:bg-red-400/15 text-red-300 transition-colors" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* SKU */}
                    <div className="mb-3">
                      <label className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1 block">SKU</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={varObj.sku}
                          onChange={e => updateVariation(varObj.id, 'sku', e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono outline-none focus:border-orange-300/50"
                        />
                        <button
                          onClick={() => updateVariation(varObj.id, 'sku', generateSKU('Achar', varObj.attributes))}
                          className="px-2 rounded-lg bg-white/5 border border-white/10 text-purple-300 hover:text-orange-300 transition-colors"
                          title="Regenerate SKU"
                        >
                          <Sparkles size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Inputs Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1 block">Price (৳)</label>
                        <input
                          type="number"
                          value={varObj.price}
                          onChange={e => updateVariation(varObj.id, 'price', e.target.value)}
                          placeholder="0.00"
                          className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-orange-300/50 placeholder-purple-600"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1 block">Discount (৳)</label>
                        <input
                          type="number"
                          value={varObj.discountPrice}
                          onChange={e => updateVariation(varObj.id, 'discountPrice', e.target.value)}
                          placeholder="0.00"
                          className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-orange-300/50 placeholder-purple-600"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1 block">Stock</label>
                        <input
                          type="number"
                          value={varObj.stock}
                          onChange={e => updateVariation(varObj.id, 'stock', e.target.value)}
                          placeholder="0"
                          className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-orange-300/50 placeholder-purple-600"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1 block">Cashback (৳)</label>
                        <input
                          type="number"
                          value={varObj.cashback}
                          onChange={e => updateVariation(varObj.id, 'cashback', e.target.value)}
                          placeholder="0"
                          className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-orange-300/50 placeholder-purple-600"
                        />
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <div className={`relative w-9 h-5 rounded-full transition-colors ${varObj.flashSale ? 'bg-orange-300' : 'bg-white/10'}`}>
                          <input
                            type="checkbox"
                            checked={varObj.flashSale}
                            onChange={e => updateVariation(varObj.id, 'flashSale', e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${varObj.flashSale ? 'translate-x-4' : ''}`} />
                        </div>
                        <span className="text-xs font-semibold text-orange-300 flex items-center gap-1">
                          <Zap size={12} /> Flash Sale
                        </span>
                      </label>

                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-purple-300 text-xs font-semibold hover:bg-white/10 transition-colors flex items-center gap-1">
                          <ImagePlus size={12} /> Image
                        </button>
                        <button
                          type="button"
                          onClick={() => saveVariation(varObj)}
                          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-300 to-green-400 text-[#4A1942] text-xs font-bold hover:shadow-lg transition-all flex items-center gap-1"
                        >
                          <Save size={12} /> Save
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit Attribute Modal */}
      {attributeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className="bg-[#5A2350] rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="attribute-modal-title"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 id="attribute-modal-title" className="text-xl font-bold text-white">
                {attributeModal === 'new' ? 'Create Attribute' : 'Edit Attribute'}
              </h3>
              <button
                type="button"
                onClick={closeAttributeModal}
                className="p-2 rounded-xl hover:bg-white/10 text-purple-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-purple-200 mb-1.5 block">Attribute name</label>
                <input
                  type="text"
                  value={attrForm.name}
                  onChange={e => setAttrForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Size, Weight"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-400 focus:border-orange-300 focus:ring-2 focus:ring-orange-300/20 outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-purple-200 mb-1.5 block">Values</label>
                <p className="text-xs text-purple-400 mb-2">Type a value and press Enter to add.</p>
                <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-white/5 border border-white/10 min-h-[52px]">
                  {attrForm.values.map(v => (
                    <span key={v} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-300/20 text-orange-200 text-xs font-semibold border border-orange-300/20">
                      {v}
                      <button type="button" onClick={() => removeValueChip(v)} className="hover:text-white rounded p-0.5">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={attrForm.input}
                    onChange={e => setAttrForm(p => ({ ...p, input: e.target.value }))}
                    onKeyDown={addValueChip}
                    placeholder="Add value…"
                    className="flex-1 min-w-[120px] px-2 py-1 rounded-lg bg-transparent border-0 text-white placeholder-purple-500 text-sm outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeAttributeModal}
                  className="flex-1 py-3 rounded-xl bg-white/10 text-purple-200 font-semibold hover:bg-white/20 transition-colors border border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={attrSubmitting}
                  onClick={saveAttribute}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-300 to-green-400 text-[#4A1942] font-bold shadow-lg shadow-green-500/20 hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {attrSubmitting ? 'Saving…' : attributeModal === 'new' ? 'Create Attribute' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div
            className="bg-[#5A2350] rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl border border-white/10"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 rounded-xl bg-red-400/15 text-red-300 shrink-0">
                <AlertTriangle size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 id="delete-modal-title" className="text-lg font-bold text-white mb-1">
                  {deleteConfirm.type === 'attribute' ? 'Delete attribute?' : 'Delete variation?'}
                </h3>
                <p className="text-purple-200 text-sm leading-relaxed">
                  {deleteConfirm.type === 'attribute' ? (
                    <>
                      Remove <span className="font-semibold text-white">{deleteConfirm.title}</span>?{' '}
                      {deleteConfirm.detail}
                    </>
                  ) : (
                    <>
                      Remove variation <span className="font-semibold text-white">{deleteConfirm.title}</span>
                      {deleteConfirm.detail ? (
                        <>
                          {' '}
                          <span className="text-purple-300">({deleteConfirm.detail})</span>
                        </>
                      ) : null}
                      ? This cannot be undone.
                    </>
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="p-2 rounded-xl hover:bg-white/10 text-purple-300 transition-colors shrink-0"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 rounded-xl bg-white/10 text-purple-200 font-semibold hover:bg-white/20 transition-colors border border-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteSubmitting}
                onClick={confirmDelete}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-300 to-red-400 text-[#4A1942] font-bold shadow-lg shadow-red-500/20 hover:shadow-xl transition-all disabled:opacity-50"
              >
                {deleteSubmitting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VariationsPage;