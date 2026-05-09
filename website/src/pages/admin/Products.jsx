import { useState, useEffect, useRef } from 'react';
import { 
  Search, Filter, Download, Plus, Bell, ChevronDown, Home, Box, ShoppingCart, 
  Users, Zap, Percent, Wallet, Settings, LogOut, Menu, X, Check, Star, 
  MoreVertical, Eye, Edit, Copy, Layers, Search as SearchIcon, Trash2, 
  Bolt, Grid, List, AlignJustify, ChevronLeft, ChevronRight, Bot, 
  WandSparkles, Tags, TrendingUp, FolderTree, Package, CheckCircle, XCircle, 
  FileText, AlertTriangle, Clock, ArrowUp, ArrowDown, Heart, ExternalLink,
  Undo, SlidersHorizontal, Image as ImageIcon
} from 'lucide-react';

export default function Products() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  // Sample product data
  const products = [
    {
      id: 1, name: 'Premium Mango Achar', variant: '500g Jar', sku: 'HBC-MG-001',
      category: 'Mango Achar', brand: 'HBC Premium', price: 280, originalPrice: 350,
      stock: 850, sold: 1240, rating: 4.8, status: 'active', date: 'Jan 15, 2026',
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=100&h=100&fit=crop'
    },
    {
      id: 2, name: 'Spicy Chili Achar', variant: '250g Jar', sku: 'HBC-CH-002',
      category: 'Chili Achar', brand: 'HBC Classic', price: 150, originalPrice: 200,
      stock: 320, sold: 890, rating: 4.6, status: 'flash', date: 'Jan 12, 2026',
      image: 'https://images.unsplash.com/photo-1568569350062-ebfa3cb195df?w=100&h=100&fit=crop'
    },
    {
      id: 3, name: 'Lime Pickle Special', variant: '1kg Jar', sku: 'HBC-LM-003',
      category: 'Lime Achar', brand: 'HBC Premium', price: 450, originalPrice: null,
      stock: 45, sold: 2100, rating: 4.9, status: 'active', date: 'Jan 10, 2026',
      image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=100&h=100&fit=crop'
    },
    {
      id: 4, name: 'Mixed Pickle Combo', variant: '3x 500g Pack', sku: 'HBC-CB-004',
      category: 'Combo Pack', brand: 'HBC Organic', price: 999, originalPrice: 1200,
      stock: 1200, sold: 3450, rating: 4.7, status: 'flash', date: 'Jan 08, 2026',
      image: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=100&h=100&fit=crop'
    },
    {
      id: 5, name: 'Garlic Chili Blast', variant: '350g Jar', sku: 'HBC-GC-005',
      category: 'Chili Achar', brand: 'HBC Classic', price: 220, originalPrice: null,
      stock: 18, sold: 567, rating: 4.5, status: 'outstock', date: 'Jan 05, 2026',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=100&h=100&fit=crop'
    },
  ];

  const galleryImages = [
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1568569350062-ebfa3cb195df?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&h=500&fit=crop',
  ];

  const stats = [
    { label: 'Total Products', value: '1,248', growth: '12.5%', up: true, icon: Package, color: 'text-[#ff9f43]', bg: 'bg-[#ff9f43]/15' },
    { label: 'Active Products', value: '986', growth: '8.2%', up: true, icon: CheckCircle, color: 'text-[#2ed573]', bg: 'bg-[#2ed573]/15' },
    { label: 'Out of Stock', value: '42', growth: '2.1%', up: false, icon: XCircle, color: 'text-[#ff4757]', bg: 'bg-[#ff4757]/15' },
    { label: 'Draft Products', value: '156', growth: '5.4%', up: true, icon: FileText, color: 'text-[#70a1ff]', bg: 'bg-[#70a1ff]/15' },
    { label: 'Flash Sale', value: '64', growth: '18.7%', up: true, icon: Zap, color: 'text-[#ffa502]', bg: 'bg-[#ffa502]/15' },
    { label: 'Low Stock Alert', value: '23', growth: '4.3%', up: false, icon: AlertTriangle, color: 'text-[#a55eea]', bg: 'bg-[#a55eea]/15' },
  ];

  const toggleSelect = (id) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === products.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(products.map(p => p.id));
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#2ed573]/15 text-[#2ed573]"><CheckCircle size={10}/> Active</span>;
      case 'flash': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gradient-to-r from-[#ff9f43]/20 to-[#ffa502]/20 text-[#ff9f43] animate-pulse"><Zap size={10}/> Flash</span>;
      case 'outstock': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#ff4757]/15 text-[#ff4757]"><XCircle size={10}/> Out of Stock</span>;
      default: return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#70a1ff]/15 text-[#70a1ff]"><FileText size={10}/> Draft</span>;
    }
  };

  const getStockBar = (stock) => {
    const pct = Math.min((stock / 1000) * 100, 100);
    let color = 'bg-[#2ed573]';
    if (stock < 100) color = 'bg-[#ff4757]';
    else if (stock < 400) color = 'bg-[#ffa502]';
    return (
      <div>
        <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden mb-1">
          <div className={`h-full ${color} rounded-full transition-all`} style={{width: `${pct}%`}}></div>
        </div>
        <span className="text-xs text-white/50">{stock} units</span>
      </div>
    );
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = () => setDropdownOpen(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState({ h: 4, m: 32, s: 15 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  

  return (
      <div className="p-4 lg:p-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fadeIn">
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-white to-[#ffb366] bg-clip-text text-transparent">Product Management</h1>
            <p className="text-white/50 text-sm mt-1">Manage your achar products</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => setFilterOpen(!filterOpen)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-transparent border border-white/[0.08] text-white/60 text-sm font-semibold hover:border-[#ff9f43] hover:text-[#ff9f43] hover:bg-[#ff9f43]/5 transition-all">
              <SlidersHorizontal size={16} /> Filter
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2ed573] to-[#7bed9f] text-[#1a0510] text-sm font-semibold shadow-lg shadow-[#2ed573]/20 hover:shadow-[#2ed573]/30 hover:-translate-y-0.5 transition-all">
              <Download size={16} /> Export
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff9f43] to-[#ffb366] text-[#1a0510] text-sm font-semibold shadow-lg shadow-[#ff9f43]/20 hover:shadow-[#ff9f43]/30 hover:-translate-y-0.5 transition-all">
              <Plus size={16} /> Add Product
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="group relative bg-[#2d0a1f]/80 backdrop-blur-sm border border-white/[0.08] rounded-[20px] p-6 hover:-translate-y-1 hover:border-[#ff9f43]/20 hover:shadow-[0_0_40px_rgba(255,159,67,0.1),0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#ff9f43] to-[#2ed573] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center text-xl`}>
                  <stat.icon size={22} />
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${stat.up ? 'bg-[#2ed573]/10 text-[#2ed573]' : 'bg-[#ff4757]/10 text-[#ff4757]'}`}>
                  {stat.up ? <ArrowUp size={10} /> : <ArrowDown size={10} />} {stat.growth}
                </span>
              </div>
              <div className="text-3xl font-extrabold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent mb-1">{stat.value}</div>
              <div className="text-sm text-white/50 mb-4">{stat.label}</div>
              <div className="h-10 flex items-end gap-1">
                {Array.from({ length: 7 }).map((_, j) => (
                  <div key={j} className="flex-1 rounded-sm bg-current opacity-20 group-hover:opacity-40 transition-all" 
                    style={{ 
                      height: `${20 + Math.random() * 60}%`,
                      color: stat.up ? '#2ed573' : '#ff4757'
                    }} 
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Filter Section */}
        <div className={`bg-[#2d0a1f]/80 backdrop-blur-sm border border-white/[0.08] rounded-[20px] mb-6 overflow-hidden transition-all duration-500 ${filterOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 border-0'}`}>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-white/50">Category</label>
              <select className="px-4 py-2.5 bg-white/5 border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-[#ff9f43] focus:shadow-[0_0_15px_rgba(255,159,67,0.1)] transition-all">
                <option className="bg-[#2d0a1f]">All Categories</option>
                <option className="bg-[#2d0a1f]">Mango Achar</option>
                <option className="bg-[#2d0a1f]">Chili Achar</option>
                <option className="bg-[#2d0a1f]">Lime Achar</option>
                <option className="bg-[#2d0a1f]">Combo Pack</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-white/50">Brand</label>
              <select className="px-4 py-2.5 bg-white/5 border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-[#ff9f43] transition-all">
                <option className="bg-[#2d0a1f]">All Brands</option>
                <option className="bg-[#2d0a1f]">HBC Premium</option>
                <option className="bg-[#2d0a1f]">HBC Classic</option>
                <option className="bg-[#2d0a1f]">HBC Organic</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-white/50">Stock Status</label>
              <select className="px-4 py-2.5 bg-white/5 border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-[#ff9f43] transition-all">
                <option className="bg-[#2d0a1f]">All Status</option>
                <option className="bg-[#2d0a1f]">In Stock</option>
                <option className="bg-[#2d0a1f]">Low Stock</option>
                <option className="bg-[#2d0a1f]">Out of Stock</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-white/50">Flash Sale</label>
              <select className="px-4 py-2.5 bg-white/5 border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-[#ff9f43] transition-all">
                <option className="bg-[#2d0a1f]">All</option>
                <option className="bg-[#2d0a1f]">Active Flash Sale</option>
                <option className="bg-[#2d0a1f]">None</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-white/50">Price Range (৳)</label>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="Min" className="flex-1 px-4 py-2.5 bg-white/5 border border-white/[0.08] rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#ff9f43] transition-all" />
                <span className="text-white/30">-</span>
                <input type="number" placeholder="Max" className="flex-1 px-4 py-2.5 bg-white/5 border border-white/[0.08] rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#ff9f43] transition-all" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-white/50">Search SKU</label>
              <input type="text" placeholder="Enter SKU..." className="px-4 py-2.5 bg-white/5 border border-white/[0.08] rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#ff9f43] transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-white/50">Date Range</label>
              <input type="date" className="px-4 py-2.5 bg-white/5 border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-[#ff9f43] transition-all" />
            </div>
            <div className="flex items-end justify-end gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-transparent border border-white/[0.08] text-white/60 text-sm font-semibold hover:border-[#ff9f43] hover:text-[#ff9f43] transition-all">
                <Undo size={14} /> Reset
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ff9f43] to-[#ffb366] text-[#1a0510] text-sm font-semibold shadow-lg shadow-[#ff9f43]/20 hover:shadow-[#ff9f43]/30 transition-all">
                <Filter size={14} /> Apply
              </button>
            </div>
          </div>
        </div>

        {/* View Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
          <div className="flex bg-white/5 border border-white/[0.08] rounded-xl p-1">
            <button onClick={() => setViewMode('table')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === 'table' ? 'bg-gradient-to-r from-[#ff9f43] to-[#ffb366] text-[#1a0510] shadow-lg shadow-[#ff9f43]/20' : 'text-white/50 hover:text-white'}`}>
              <List size={14} /> Table
            </button>
            <button onClick={() => setViewMode('grid')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === 'grid' ? 'bg-gradient-to-r from-[#ff9f43] to-[#ffb366] text-[#1a0510] shadow-lg shadow-[#ff9f43]/20' : 'text-white/50 hover:text-white'}`}>
              <Grid size={14} /> Grid
            </button>
            <button onClick={() => setViewMode('compact')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === 'compact' ? 'bg-gradient-to-r from-[#ff9f43] to-[#ffb366] text-[#1a0510] shadow-lg shadow-[#ff9f43]/20' : 'text-white/50 hover:text-white'}`}>
              <AlignJustify size={14} /> Compact
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/50"><span className="text-[#ff9f43] font-bold">{selectedItems.length}</span> items selected</span>
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-transparent border border-white/[0.08] text-white/60 text-xs font-semibold hover:border-[#ff4757] hover:text-[#ff4757] transition-all">
              <Trash2 size={12} /> Delete
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-[#2ed573] to-[#7bed9f] text-[#1a0510] text-xs font-semibold shadow-lg shadow-[#2ed573]/20 hover:shadow-[#2ed573]/30 transition-all">
              <Zap size={12} /> Flash Sale
            </button>
          </div>
        </div>

        {/* Table View */}
        {viewMode === 'table' && (
          <div className=" backdrop-blur-sm border border-white/[0.08] rounded-[20px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="px-4 py-4 text-left w-12">
                      <button onClick={toggleSelectAll} className={`w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-all ${selectedItems.length === products.length ? 'bg-gradient-to-br from-[#ff9f43] to-[#2ed573] border-transparent' : 'border-white/30 hover:border-[#ff9f43]'}`}>
                        {selectedItems.length === products.length && <Check size={10} className="text-[#1a0510]" />}
                      </button>
                    </th>
                    <th className="px-4 py-4 text-left text-xs uppercase tracking-wider text-white/50 font-semibold">Product</th>
                    <th className="px-4 py-4 text-left text-xs uppercase tracking-wider text-white/50 font-semibold">SKU</th>
                    <th className="px-4 py-4 text-left text-xs uppercase tracking-wider text-white/50 font-semibold">Category</th>
                    <th className="px-4 py-4 text-left text-xs uppercase tracking-wider text-white/50 font-semibold">Price</th>
                    <th className="px-4 py-4 text-left text-xs uppercase tracking-wider text-white/50 font-semibold">Stock</th>
                    <th className="px-4 py-4 text-left text-xs uppercase tracking-wider text-white/50 font-semibold">Sold</th>
                    <th className="px-4 py-4 text-left text-xs uppercase tracking-wider text-white/50 font-semibold">Rating</th>
                    <th className="px-4 py-4 text-left text-xs uppercase tracking-wider text-white/50 font-semibold">Status</th>
                    <th className="px-4 py-4 text-left text-xs uppercase tracking-wider text-white/50 font-semibold">Date</th>
                    <th className="px-4 py-4 text-left text-xs uppercase tracking-wider text-white/50 font-semibold w-12">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-white/[0.08] hover:bg-white/[0.03] hover:border-[#ff9f43]/20 transition-all group">
                      <td className="px-4 py-4">
                        <button onClick={() => toggleSelect(product.id)} className={`w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-all ${selectedItems.includes(product.id) ? 'bg-gradient-to-br from-[#ff9f43] to-[#2ed573] border-transparent' : 'border-white/30 hover:border-[#ff9f43]'}`}>
                          {selectedItems.includes(product.id) && <Check size={10} className="text-[#1a0510]" />}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3 min-w-[220px]">
                          <img src={product.image} alt="" className="w-12 h-12 rounded-xl object-cover border-2 border-white/[0.08] group-hover:border-[#ff9f43] group-hover:scale-105 transition-all" />
                          <div>
                            <div className="font-semibold text-sm">{product.name}</div>
                            <div className="text-xs text-white/40">{product.variant}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-white/60">{product.sku}</td>
                      <td className="px-4 py-4 text-white/60">{product.category}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          {product.originalPrice && <span className="text-xs text-white/40 line-through">৳{product.originalPrice}</span>}
                          <span className="font-bold text-[#2ed573]">৳{product.price}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">{getStockBar(product.stock)}</td>
                      <td className="px-4 py-4 text-white/60">{product.sold.toLocaleString()}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-[#ff9f43] fill-[#ff9f43]" />
                          <span className="font-semibold text-sm">{product.rating}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">{getStatusBadge(product.status)}</td>
                      <td className="px-4 py-4 text-white/50 text-xs">{product.date}</td>
                      <td className="px-4 py-4">
                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => setDropdownOpen(dropdownOpen === product.id ? null : product.id)} className="w-8 h-8 rounded-lg bg-white/5 border border-white/[0.08] flex items-center justify-center hover:bg-[#ff9f43]/10 hover:border-[#ff9f43] hover:text-[#ff9f43] transition-all">
                            <MoreVertical size={14} />
                          </button>
                          {dropdownOpen === product.id && (
                            <div className="absolute right-0 top-full mt-2 w-52 bg-[#1a0510]/98 border border-white/[0.08] rounded-xl shadow-2xl z-50 overflow-hidden animate-fadeIn">
                              <button onClick={() => { setQuickViewOpen(true); setDropdownOpen(null); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors text-left">
                                <Eye size={14} /> Quick View
                              </button>
                              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors text-left">
                                <Edit size={14} /> Edit
                              </button>
                              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors text-left">
                                <Copy size={14} /> Duplicate
                              </button>
                              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors text-left">
                                <Layers size={14} /> Variations
                              </button>
                              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors text-left">
                                <SearchIcon size={14} /> SEO Settings
                              </button>
                              <div className="h-px bg-white/[0.08] my-1" />
                              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors text-left">
                                <Zap size={14} /> Add Flash Sale
                              </button>
                              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#ff4757] hover:bg-[#ff4757]/10 transition-colors text-left">
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
            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-white/[0.03] border-2 border-dashed border-white/[0.08] flex items-center justify-center text-4xl text-white/20">
                  <Package size={40} />
                </div>
                <div className="text-xl font-bold mb-2">No products found</div>
                <div className="text-white/50 mb-6">Try adjusting your filters or search query</div>
                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff9f43] to-[#ffb366] text-[#1a0510] text-sm font-semibold shadow-lg shadow-[#ff9f43]/20">
                  <Plus size={16} /> Add New Product
                </button>
              </div>
            )}
            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5 border-t border-white/[0.08]">
              <div className="text-sm text-white/50">Showing <span className="text-white font-semibold">1-{filteredProducts.length}</span> of <span className="text-white font-semibold">1,248</span> products</div>
              <div className="flex items-center gap-1">
                <button className="w-9 h-9 rounded-xl bg-white/5 border border-white/[0.08] flex items-center justify-center text-white/40 hover:border-[#ff9f43] hover:text-[#ff9f43] transition-all disabled:opacity-30" disabled>
                  <ChevronLeft size={14} />
                </button>
                <button className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#ff9f43] to-[#ffb366] text-[#1a0510] font-bold text-sm flex items-center justify-center shadow-lg shadow-[#ff9f43]/20">1</button>
                <button className="w-9 h-9 rounded-xl bg-white/5 border border-white/[0.08] flex items-center justify-center text-white/50 hover:border-[#ff9f43] hover:text-[#ff9f43] transition-all text-sm font-semibold">2</button>
                <button className="w-9 h-9 rounded-xl bg-white/5 border border-white/[0.08] flex items-center justify-center text-white/50 hover:border-[#ff9f43] hover:text-[#ff9f43] transition-all text-sm font-semibold">3</button>
                <span className="px-2 text-white/30">...</span>
                <button className="w-9 h-9 rounded-xl bg-white/5 border border-white/[0.08] flex items-center justify-center text-white/50 hover:border-[#ff9f43] hover:text-[#ff9f43] transition-all text-sm font-semibold">250</button>
                <button className="w-9 h-9 rounded-xl bg-white/5 border border-white/[0.08] flex items-center justify-center text-white/40 hover:border-[#ff9f43] hover:text-[#ff9f43] transition-all">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product) => (
              <div key={product.id} className="group bg-[#2d0a1f]/80 backdrop-blur-sm border border-white/[0.08] rounded-[20px] overflow-hidden hover:-translate-y-1.5 hover:border-[#ff9f43]/30 hover:shadow-[0_0_40px_rgba(255,159,67,0.1),0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300">
                <div className="relative h-52 overflow-hidden">
                  <img src={product.image.replace('w=100&h=100', 'w=400&h=300')} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  {product.status === 'flash' && (
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gradient-to-r from-[#ff9f43]/90 to-[#ffa502]/90 text-[#1a0510]">
                      <Zap size={10} /> -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  )}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <button onClick={() => setQuickViewOpen(true)} className="w-9 h-9 rounded-xl bg-[#1a0510]/80 backdrop-blur-sm border border-white/[0.08] flex items-center justify-center hover:bg-[#ff9f43] hover:border-[#ff9f43] hover:text-[#1a0510] transition-all">
                      <Eye size={14} />
                    </button>
                    <button className="w-9 h-9 rounded-xl bg-[#1a0510]/80 backdrop-blur-sm border border-white/[0.08] flex items-center justify-center hover:bg-[#ff9f43] hover:border-[#ff9f43] hover:text-[#1a0510] transition-all">
                      <Edit size={14} />
                    </button>
                    <button className="w-9 h-9 rounded-xl bg-[#1a0510]/80 backdrop-blur-sm border border-white/[0.08] flex items-center justify-center hover:bg-[#ff4757] hover:border-[#ff4757] hover:text-white transition-all">
                      <Heart size={14} />
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-xs font-semibold text-[#ff9f43] uppercase tracking-wider mb-1">{product.category}</div>
                  <h3 className="font-bold text-base mb-3 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-sm">
                      <Star size={12} className="text-[#ff9f43] fill-[#ff9f43]" />
                      <span>{product.rating}</span>
                    </div>
                    <div className={`text-xs flex items-center gap-1 ${product.stock > 400 ? 'text-[#2ed573]' : product.stock > 100 ? 'text-[#ffa502]' : 'text-[#ff4757]'}`}>
                      {product.stock > 400 ? <CheckCircle size={12} /> : product.stock > 100 ? <AlertTriangle size={12} /> : <XCircle size={12} />}
                      {product.stock} left
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-extrabold text-[#2ed573]">৳{product.price}</span>
                      {product.originalPrice && <span className="text-sm text-white/40 line-through">৳{product.originalPrice}</span>}
                    </div>
                    <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff9f43] to-[#ffb366] text-[#1a0510] text-xs font-bold hover:shadow-lg hover:shadow-[#ff9f43]/30 transition-all">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Compact View */}
        {viewMode === 'compact' && (
          <div className="flex flex-col gap-3">
            {products.map((product) => (
              <div key={product.id} className="flex items-center gap-4 p-4 bg-[#2d0a1f]/80 backdrop-blur-sm border border-white/[0.08] rounded-xl hover:border-[#ff9f43]/20 hover:bg-[#4a0e2e]/90 transition-all">
                <button onClick={() => toggleSelect(product.id)} className={`w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${selectedItems.includes(product.id) ? 'bg-gradient-to-br from-[#ff9f43] to-[#2ed573] border-transparent' : 'border-white/30 hover:border-[#ff9f43]'}`}>
                  {selectedItems.includes(product.id) && <Check size={10} className="text-[#1a0510]" />}
                </button>
                <img src={product.image} alt="" className="w-14 h-14 rounded-xl object-cover border-2 border-white/[0.08] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{product.name} - {product.variant}</div>
                  <div className="flex items-center gap-3 text-xs text-white/50 mt-1">
                    <span>SKU: {product.sku}</span>
                    <span>{product.category}</span>
                    <span className="flex items-center gap-1"><Star size={10} className="text-[#ff9f43] fill-[#ff9f43]" /> {product.rating}</span>
                  </div>
                </div>
                <div className="hidden sm:block">{getStatusBadge(product.status)}</div>
                <div className="font-bold text-[#2ed573] min-w-[60px] text-right">৳{product.price}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    
  );
}