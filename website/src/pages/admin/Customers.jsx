import { useState, useMemo } from 'react';

/* ---------------- Inline SVG Icons ---------------- */
const I = {
  Users: ({c="w-5 h-5"}) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>,
  Wallet: ({c="w-5 h-5"}) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"/></svg>,
  Gift: ({c="w-5 h-5"}) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H4.5a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/></svg>,
  Layout: ({c="w-5 h-5"}) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"/></svg>,
  Search: ({c="w-5 h-5"}) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>,
  Download: ({c="w-5 h-5"}) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>,
  Plus: ({c="w-5 h-5"}) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>,
  Filter: ({c="w-5 h-5"}) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"/></svg>,
  X: ({c="w-5 h-5"}) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>,
  MoreVertical: ({c="w-5 h-5"}) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"/></svg>,
  Eye: ({c="w-5 h-5"}) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  Edit: ({c="w-5 h-5"}) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/></svg>,
  Trash: ({c="w-5 h-5"}) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>,
  Mail: ({c="w-5 h-5"}) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>,
  Phone: ({c="w-5 h-5"}) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>,
  MapPin: ({c="w-5 h-5"}) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>,
  Calendar: ({c="w-5 h-5"}) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg>,
  Send: ({c="w-5 h-5"}) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/></svg>,
  Lock: ({c="w-5 h-5"}) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>,
  Package: ({c="w-5 h-5"}) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>,
  CreditCard: ({c="w-5 h-5"}) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"/></svg>,
  Activity: ({c="w-5 h-5"}) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>,
  ShoppingBag: ({c="w-5 h-5"}) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/></svg>,
  Check: ({c="w-5 h-5"}) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>,
  Close: ({c="w-5 h-5"}) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>,
  Minus: ({c="w-5 h-5"}) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15"/></svg>,
};

/* ---------------- UI Primitives ---------------- */
const Card = ({ children, className = "", hover = true }) => (
  <div className={`bg-white/[0.07] backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg shadow-black/20 ${hover ? 'hover:bg-white/9 hover:border-white/20 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300' : ''} ${className}`}>
    {children}
  </div>
);

const GradCard = ({ children, className = "", from = "from-orange-500", to = "to-red-600" }) => (
  <div className={`bg-linear-to-br ${from} ${to} rounded-2xl shadow-lg shadow-orange-900/20 border border-white/10 ${className}`}>
    {children}
  </div>
);

const Btn = ({ children, onClick, variant = "primary", className = "", type = "button" }) => {
  const base = "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2";
  const styles = {
    primary: "bg-linear-to-r from-orange-300 to-green-400 text-gray-900 hover:from-orange-400 hover:to-green-500 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5",
    secondary: "bg-white/10 text-white border border-white/10 hover:bg-white/20",
    danger: "bg-linear-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700",
    ghost: "text-white/70 hover:text-white hover:bg-white/5",
    outline: "border border-orange-400/40 text-orange-300 hover:bg-orange-500/10",
  };
  return <button type={type} onClick={onClick} className={`${base} ${styles[variant]} ${className}`}>{children}</button>;
};

const Badge = ({ children, color = "orange" }) => {
  const map = {
    orange: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    green: "bg-green-500/20 text-green-300 border-green-500/30",
    red: "bg-red-500/20 text-red-300 border-red-500/30",
    blue: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    purple: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    yellow: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    gray: "bg-white/10 text-white/60 border-white/10",
  };
  return <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${map[color]}`}>{children}</span>;
};

const Inp = ({ label, type = "text", value, onChange, placeholder }) => (
  <div className="space-y-1.5">
    {label && <label className="block text-xs font-medium text-white/60 uppercase tracking-wider">{label}</label>}
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400/40" />
  </div>
);

const Sel = ({ label, value, onChange, options }) => (
  <div className="space-y-1.5">
    {label && <label className="block text-xs font-medium text-white/60 uppercase tracking-wider">{label}</label>}
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl text-sm text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400/40 appearance-none">
      {options.map(o => <option key={o.value} value={o.value} className="bg-[#2a0a2a]">{o.label}</option>)}
    </select>
  </div>
);

const Modal = ({ isOpen, onClose, title, children, maxW = "max-w-lg" }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-[#2a0a2a] border border-white/10 rounded-2xl shadow-2xl w-full ${maxW} p-6 animate-modal-in`}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-white/60"><I.X c="w-5 h-5"/></button>
        </div>
        {children}
      </div>
    </div>
  );
};

const Drawer = ({ isOpen, onClose, title, children, w = "w-[480px]" }) => (
  <>
    {isOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />}
    <div className={`fixed top-0 right-0 h-full ${w} bg-[#2a0a2a] border-l border-white/10 shadow-2xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}>
      <div className="sticky top-0 bg-[#2a0a2a]/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/60"><I.X c="w-5 h-5"/></button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </>
);

/* ---------------- Mock Data ---------------- */
const genCustomers = () => {
  const names = ["Rahim Ahmed","Fatima Begum","Karim Hossain","Nusrat Jahan","Tanvir Islam","Sadia Rahman","Imran Khan","Priya Das","Hasan Mahmud","Laila Noor","Shakib Al","Mim Akter","Rafiqul Islam","Tasnim Chowdhury","Junayed Hossain","Ayesha Siddiq","Mahmudul Hasan","Rina Akter","Sohel Rana","Nipa Begum"];
  const locs = ["Dhaka","Chittagong","Sylhet","Rajshahi","Khulna","Barisal","Rangpur","Mymensingh"];
  const lvls = ["Bronze","Silver","Gold","Platinum","VIP"];
  return names.map((n, i) => ({
    id: `CUST-${1000+i}`, name: n,
    email: n.toLowerCase().replace(/ /g,'.')+"@email.com",
    phone: `+880 1${Math.floor(Math.random()*9+3)}${Math.floor(Math.random()*90000000+10000000)}`,
    location: locs[Math.floor(Math.random()*locs.length)],
    orders: Math.floor(Math.random()*50)+1,
    spend: Math.floor(Math.random()*50000)+1000,
    wallet: Math.floor(Math.random()*5000),
    rewards: Math.floor(Math.random()*2000),
    level: lvls[Math.floor(Math.random()*lvls.length)],
    landingPages: Math.floor(Math.random()*5),
    status: Math.random()>0.1?"Active":"Blocked",
    lastLogin: `${Math.floor(Math.random()*23+1)}h ago`,
    joinDate: `202${Math.floor(Math.random()*4+1)}-${String(Math.floor(Math.random()*12+1)).padStart(2,'0')}-${String(Math.floor(Math.random()*28+1)).padStart(2,'0')}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${n}`,
  }));
};
const customers = genCustomers();

const landReqs = [
  { id:"LP-001", customer:"Rahim Ahmed", title:"Eid Special Achar Collection", products:8, template:"Grid", date:"2024-05-10", status:"Pending" },
  { id:"LP-002", customer:"Fatima Begum", title:"Mango Pickle Flash Sale", products:5, template:"Hero", date:"2024-05-09", status:"Approved" },
  { id:"LP-003", customer:"Karim Hossain", title:"Premium Olive Achar", products:3, template:"Minimal", date:"2024-05-08", status:"Published" },
  { id:"LP-004", customer:"Nusrat Jahan", title:"Mixed Achar Combo", products:12, template:"Grid", date:"2024-05-07", status:"Under Review" },
  { id:"LP-005", customer:"Tanvir Islam", title:"Winter Special", products:6, template:"Hero", date:"2024-05-06", status:"Rejected" },
];

const memLevels = [
  { name:"Bronze", spend:0, cashback:2, discount:0, from:"from-amber-700", to:"to-amber-900", icon:"🥉" },
  { name:"Silver", spend:5000, cashback:4, discount:5, from:"from-slate-400", to:"to-slate-600", icon:"🥈" },
  { name:"Gold", spend:15000, cashback:6, discount:10, from:"from-yellow-400", to:"to-yellow-600", icon:"🥇" },
  { name:"Platinum", spend:50000, cashback:8, discount:15, from:"from-cyan-400", to:"to-blue-600", icon:"💎" },
  { name:"VIP", spend:100000, cashback:12, discount:20, from:"from-purple-500", to:"to-pink-600", icon:"👑" },
];

/* ================= MAIN COMPONENT ================= */
export default function CustomerManagementPanel() {
  const [section, setSection] = useState("customers");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [selCust, setSelCust] = useState(null);
  const [profTab, setProfTab] = useState("overview");
  const [notifModal, setNotifModal] = useState(false);
  const [walletModal, setWalletModal] = useState(false);
  const [rewardModal, setRewardModal] = useState(false);
  const [actDrop, setActDrop] = useState(null);
  const [filters, setFilters] = useState({name:"",email:"",phone:"",location:"",level:"",status:"",minSpend:"",minOrders:""});

  const menu = [
    { id:"customers", label:"All Customers", icon:I.Users },
    { id:"wallet", label:"Wallet", icon:I.Wallet },
    { id:"rewards", label:"Rewards", icon:I.Gift },
    { id:"landing", label:"Landing Requests", icon:I.Layout },
  ];

  const filtered = useMemo(() => customers.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.email.toLowerCase().includes(search.toLowerCase()) && !c.phone.includes(search)) return false;
    if (filters.name && !c.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
    if (filters.email && !c.email.toLowerCase().includes(filters.email.toLowerCase())) return false;
    if (filters.phone && !c.phone.includes(filters.phone)) return false;
    if (filters.location && c.location !== filters.location) return false;
    if (filters.level && c.level !== filters.level) return false;
    if (filters.status && c.status !== filters.status) return false;
    if (filters.minSpend && c.spend < Number(filters.minSpend)) return false;
    if (filters.minOrders && c.orders < Number(filters.minOrders)) return false;
    return true;
  }), [search, filters]);

  const toggleSel = (id) => setSelected(p => p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const selAll = () => setSelected(selected.length===filtered.length?[]:filtered.map(c=>c.id));
  const openProf = (c) => { setSelCust(c); setDrawer(true); setProfTab("overview"); };

  /* ---------- VIEWS ---------- */
  const CustomersView = () => (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80">
            <I.Search c="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"/>
            <input type="text" placeholder="Search customers..." value={search} onChange={e=>setSearch(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400/40"/>
          </div>
          <Btn variant="secondary" onClick={()=>setShowFilters(!showFilters)}><I.Filter c="w-4 h-4"/> Filters</Btn>
        </div>
        <div className="flex items-center gap-2">
          {selected.length>0 && (
            <div className="flex items-center gap-2 mr-2">
              <span className="text-xs text-white/60">{selected.length} selected</span>
              <Btn variant="outline" onClick={()=>setNotifModal(true)}><I.Send c="w-4 h-4"/> Notify</Btn>
              <Btn variant="outline" onClick={()=>setWalletModal(true)}><I.Wallet c="w-4 h-4"/> Wallet</Btn>
              <Btn variant="outline" onClick={()=>setRewardModal(true)}><I.Gift c="w-4 h-4"/> Rewards</Btn>
            </div>
          )}
          <Btn variant="secondary"><I.Download c="w-4 h-4"/> Export</Btn>
        </div>
      </div>

      {showFilters && (
        <Card className="p-5 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Inp label="Name" value={filters.name} onChange={v=>setFilters(f=>({...f,name:v}))} placeholder="Filter by name"/>
            <Inp label="Email" value={filters.email} onChange={v=>setFilters(f=>({...f,email:v}))} placeholder="Filter by email"/>
            <Inp label="Phone" value={filters.phone} onChange={v=>setFilters(f=>({...f,phone:v}))} placeholder="Filter by phone"/>
            <Sel label="Location" value={filters.location} onChange={v=>setFilters(f=>({...f,location:v}))} options={[{value:"",label:"All"},...[ "Dhaka","Chittagong","Sylhet","Rajshahi","Khulna","Barisal","Rangpur","Mymensingh"].map(l=>({value:l,label:l}))]}/>
            <Sel label="Membership" value={filters.level} onChange={v=>setFilters(f=>({...f,level:v}))} options={[{value:"",label:"All"},...memLevels.map(l=>({value:l.name,label:l.name}))]}/>
            <Sel label="Status" value={filters.status} onChange={v=>setFilters(f=>({...f,status:v}))} options={[{value:"",label:"All"},{value:"Active",label:"Active"},{value:"Blocked",label:"Blocked"}]}/>
            <Inp label="Min Spend (৳)" type="number" value={filters.minSpend} onChange={v=>setFilters(f=>({...f,minSpend:v}))} placeholder="0"/>
            <Inp label="Min Orders" type="number" value={filters.minOrders} onChange={v=>setFilters(f=>({...f,minOrders:v}))} placeholder="0"/>
          </div>
          <div className="flex gap-2 mt-4">
            <Btn onClick={()=>{}}>Apply</Btn>
            <Btn variant="ghost" onClick={()=>setFilters({name:"",email:"",phone:"",location:"",level:"",status:"",minSpend:"",minOrders:""})}>Reset</Btn>
          </div>
        </Card>
      )}

      <Card hover={false} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="border-b border-white/10 bg-white/5">
              <th className="p-4 w-10"><input type="checkbox" checked={selected.length===filtered.length&&filtered.length>0} onChange={selAll} className="rounded border-white/20 bg-white/5 text-orange-500"/></th>
              <th className="p-4 text-xs font-semibold text-white/50 uppercase">Customer</th>
              <th className="p-4 text-xs font-semibold text-white/50 uppercase">Contact</th>
              <th className="p-4 text-xs font-semibold text-white/50 uppercase">Location</th>
              <th className="p-4 text-xs font-semibold text-white/50 uppercase">Orders</th>
              <th className="p-4 text-xs font-semibold text-white/50 uppercase">Spend</th>
              <th className="p-4 text-xs font-semibold text-white/50 uppercase">Wallet</th>
              <th className="p-4 text-xs font-semibold text-white/50 uppercase">Rewards</th>
              <th className="p-4 text-xs font-semibold text-white/50 uppercase">Level</th>
              <th className="p-4 text-xs font-semibold text-white/50 uppercase">Status</th>
              <th className="p-4 text-xs font-semibold text-white/50 uppercase w-10"></th>
            </tr></thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(c=> (
                <tr key={c.id} className="hover:bg-white/3 transition-colors group">
                  <td className="p-4"><input type="checkbox" checked={selected.includes(c.id)} onChange={()=>toggleSel(c.id)} className="rounded border-white/20 bg-white/5 text-orange-500"/></td>
                  <td className="p-4"><div className="flex items-center gap-3">
                    <img src={c.avatar} alt="" className="w-10 h-10 rounded-full bg-white/10 border border-white/10"/>
                    <div><div className="text-sm font-medium text-white">{c.name}</div><div className="text-xs text-white/40">{c.id}</div></div>
                  </div></td>
                  <td className="p-4"><div className="text-sm text-white/80">{c.email}</div><div className="text-xs text-white/40">{c.phone}</div></td>
                  <td className="p-4 text-sm text-white/70">{c.location}</td>
                  <td className="p-4 text-sm text-white/70">{c.orders}</td>
                  <td className="p-4 text-sm font-medium text-white">৳{c.spend.toLocaleString()}</td>
                  <td className="p-4 text-sm text-green-300">৳{c.wallet}</td>
                  <td className="p-4 text-sm text-orange-300">{c.rewards} pts</td>
                  <td className="p-4"><Badge color={c.level==="VIP"?"purple":c.level==="Gold"?"yellow":c.level==="Silver"?"gray":"orange"}>{c.level}</Badge></td>
                  <td className="p-4"><Badge color={c.status==="Active"?"green":"red"}>{c.status}</Badge></td>
                  <td className="p-4">
                    <div className="relative">
                      <button onClick={()=>setActDrop(actDrop===c.id?null:c.id)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/60"><I.MoreVertical c="w-4 h-4"/></button>
                      {actDrop===c.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-[#2a0a2a] border border-white/10 rounded-xl shadow-xl z-30 py-1 animate-fade-in">
                          <button onClick={()=>{openProf(c);setActDrop(null);}} className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/5 flex items-center gap-2"><I.Eye c="w-4 h-4"/> View Profile</button>
                          <button onClick={()=>setActDrop(null)} className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/5 flex items-center gap-2"><I.Edit c="w-4 h-4"/> Edit</button>
                          <button onClick={()=>setActDrop(null)} className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/5 flex items-center gap-2"><I.Wallet c="w-4 h-4"/> Wallet</button>
                          <button onClick={()=>setActDrop(null)} className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/5 flex items-center gap-2"><I.Gift c="w-4 h-4"/> Rewards</button>
                          <button onClick={()=>setActDrop(null)} className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/5 flex items-center gap-2"><I.Package c="w-4 h-4"/> Orders</button>
                          <div className="border-t border-white/10 my-1"/>
                          <button onClick={()=>setActDrop(null)} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 flex items-center gap-2"><I.Lock c="w-4 h-4"/> Block</button>
                          <button onClick={()=>setActDrop(null)} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 flex items-center gap-2"><I.Trash c="w-4 h-4"/> Delete</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length===0 && (
          <div className="p-12 text-center"><div className="text-4xl mb-3">🔍</div><h3 className="text-lg font-medium text-white/80">No customers found</h3><p className="text-sm text-white/40 mt-1">Try adjusting your search or filters</p></div>
        )}
        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-sm text-white/40">Showing {filtered.length} of {customers.length} customers</span>
          <div className="flex gap-2">
            <Btn variant="ghost" className="px-3 py-1.5 text-xs">Previous</Btn>
            <Btn variant="secondary" className="px-3 py-1.5 text-xs">1</Btn>
            <Btn variant="ghost" className="px-3 py-1.5 text-xs">2</Btn>
            <Btn variant="ghost" className="px-3 py-1.5 text-xs">Next</Btn>
          </div>
        </div>
      </Card>
    </div>
  );

  const WalletView = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GradCard from="from-orange-400" to="to-red-500" className="p-6">
          <div className="text-sm text-white/80 mb-1">Total Wallet Balance</div>
          <div className="text-3xl font-bold text-white">৳24,58,900</div>
          <div className="text-xs text-white/60 mt-2">Across all customers</div>
        </GradCard>
        <Card className="p-6">
          <div className="text-sm text-white/70 mb-1">Total Cashback Given</div>
          <div className="text-3xl font-bold text-green-300">৳3,42,000</div>
          <div className="text-xs text-white/40 mt-2">This month</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-white/70 mb-1">Total Refunds</div>
          <div className="text-3xl font-bold text-orange-300">৳89,500</div>
          <div className="text-xs text-white/40 mt-2">Auto-refunded to wallets</div>
        </Card>
      </div>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Recent Wallet Transactions</h3>
          <Btn variant="secondary"><I.Download c="w-4 h-4"/> Export</Btn>
        </div>
        <div className="space-y-3">
          {[
            {user:"Rahim Ahmed",type:"Recharge",amount:5000,date:"2 mins ago",status:"Success"},
            {user:"Fatima Begum",type:"Cashback",amount:250,date:"15 mins ago",status:"Success"},
            {user:"Karim Hossain",type:"Purchase",amount:-1200,date:"1 hour ago",status:"Success"},
            {user:"Nusrat Jahan",type:"Refund",amount:3400,date:"3 hours ago",status:"Success"},
            {user:"Tanvir Islam",type:"Recharge",amount:1000,date:"5 hours ago",status:"Pending"},
          ].map((tx,i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/[0.07] transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.amount>0?'bg-green-500/20 text-green-300':'bg-red-500/20 text-red-300'}`}>
                  {tx.amount>0?<I.Plus c="w-5 h-5"/>:<I.Minus c="w-5 h-5"/>}
                </div>
                <div><div className="text-sm font-medium text-white">{tx.user}</div><div className="text-xs text-white/40">{tx.type} • {tx.date}</div></div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-bold ${tx.amount>0?'text-green-300':'text-red-300'}`}>{tx.amount>0?'+':''}৳{Math.abs(tx.amount)}</div>
                <Badge color={tx.status==="Success"?"green":"yellow"}>{tx.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const RewardsView = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GradCard from="from-purple-400" to="to-pink-600" className="p-6">
          <div className="text-sm text-white/80 mb-1">Total Reward Points</div>
          <div className="text-3xl font-bold text-white">4,56,000</div>
          <div className="text-xs text-white/60 mt-2">Active in system</div>
        </GradCard>
        <Card className="p-6">
          <div className="text-sm text-white/70 mb-1">Points Redeemed</div>
          <div className="text-3xl font-bold text-orange-300">1,23,500</div>
          <div className="text-xs text-white/40 mt-2">This month</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-white/70 mb-1">Referral Bonus Given</div>
          <div className="text-3xl font-bold text-blue-300">45,200</div>
          <div className="text-xs text-white/40 mt-2">Points</div>
        </Card>
      </div>
      <Card className="p-6">
        <h3 className="text-lg font-bold text-white mb-4">Reward History</h3>
        <div className="space-y-2">
          {customers.slice(0,8).map((c,i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <img src={c.avatar} alt="" className="w-8 h-8 rounded-full bg-white/10"/>
                <div><div className="text-sm text-white/90">{c.name}</div><div className="text-xs text-white/40">{c.level} Member</div></div>
              </div>
              <div className="text-right"><div className="text-sm font-bold text-orange-300">+{Math.floor(c.spend*0.05)} pts</div><div className="text-xs text-white/40">from orders</div></div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const LandingView = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Landing Page Requests</h2>
        <Btn><I.Plus c="w-4 h-4"/> Create Request</Btn>
      </div>
      <Card hover={false} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="border-b border-white/10 bg-white/5">
              <th className="p-4 text-xs font-semibold text-white/50 uppercase">Request ID</th>
              <th className="p-4 text-xs font-semibold text-white/50 uppercase">Customer</th>
              <th className="p-4 text-xs font-semibold text-white/50 uppercase">Title</th>
              <th className="p-4 text-xs font-semibold text-white/50 uppercase">Products</th>
              <th className="p-4 text-xs font-semibold text-white/50 uppercase">Template</th>
              <th className="p-4 text-xs font-semibold text-white/50 uppercase">Date</th>
              <th className="p-4 text-xs font-semibold text-white/50 uppercase">Status</th>
              <th className="p-4 text-xs font-semibold text-white/50 uppercase">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-white/5">
              {landReqs.map(req=> (
                <tr key={req.id} className="hover:bg-white/3 transition-colors">
                  <td className="p-4 text-sm font-mono text-white/70">{req.id}</td>
                  <td className="p-4 text-sm text-white/90">{req.customer}</td>
                  <td className="p-4 text-sm text-white/90">{req.title}</td>
                  <td className="p-4 text-sm text-white/70">{req.products}</td>
                  <td className="p-4"><Badge color="blue">{req.template}</Badge></td>
                  <td className="p-4 text-sm text-white/60">{req.date}</td>
                  <td className="p-4"><Badge color={req.status==="Published"?"green":req.status==="Approved"?"blue":req.status==="Pending"?"yellow":req.status==="Rejected"?"red":"purple"}>{req.status}</Badge></td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/60"><I.Eye c="w-4 h-4"/></button>
                      {req.status==="Pending" && <button className="p-1.5 rounded-lg hover:bg-green-500/20 text-green-400"><I.Check c="w-4 h-4"/></button>}
                      {req.status==="Pending" && <button className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400"><I.Close c="w-4 h-4"/></button>}
                      <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/60"><I.Trash c="w-4 h-4"/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const sections = {
    customers: CustomersView,
    wallet: WalletView,
    rewards: RewardsView,
    landing: LandingView,
  };
  const Active = sections[section] || CustomersView;

  return (
    <div className="min-h-screen text-white">
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes modalIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
        .animate-fade-in { animation: fadeIn 0.35s ease-out forwards; }
        .animate-modal-in { animation: modalIn 0.25s ease-out forwards; }
        ::-webkit-scrollbar { width:6px; height:6px; }
        ::-webkit-scrollbar-track { background:rgba(255,255,255,0.03); }
        ::-webkit-scrollbar-thumb { background:rgba(251,146,60,0.25); border-radius:10px; }
        ::-webkit-scrollbar-thumb:hover { background:rgba(251,146,60,0.4); }
      `}</style>

      {/* Section Tabs */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Customer Management</h1>
            
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {menu.map(m => (
            <button key={m.id} onClick={()=>setSection(m.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${section===m.id?'bg-linear-to-r from-orange-300 to-green-400 text-gray-900 shadow-lg shadow-orange-500/20':'bg-white/10 text-white/70 hover:bg-white/20 border border-white/10'}`}>
              <m.icon c="w-4 h-4"/><span>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-white/40 mb-6">
        <span className="text-white/60">Customers</span><span>/</span>
        <span className="text-orange-300/80">{menu.find(m=>m.id===section)?.label}</span>
      </div>
    
      {/* Content */}
      <Active />

      {/* Profile Drawer */}
      <Drawer isOpen={drawer} onClose={()=>setDrawer(false)} title="Customer Profile" w="w-[520px]">
        {selCust && (
          <div className="space-y-6">
            <div className="text-center">
              <img src={selCust.avatar} alt="" className="w-24 h-24 rounded-full bg-white/10 mx-auto mb-3 border-4 border-orange-500/20"/>
              <h3 className="text-xl font-bold text-white">{selCust.name}</h3>
              <p className="text-sm text-white/50">{selCust.id}</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Badge color={selCust.level==="VIP"?"purple":"orange"}>{selCust.level}</Badge>
                <Badge color={selCust.status==="Active"?"green":"red"}>{selCust.status}</Badge>
              </div>
            </div>
            <div className="flex gap-1 bg-white/5 p-1 rounded-xl">
              {["overview","orders","wallet","rewards","landing","activity"].map(t=> (
                <button key={t} onClick={()=>setProfTab(t)} className={`flex-1 py-2 text-xs font-medium rounded-lg capitalize transition-all ${profTab===t?'bg-linear-to-r from-orange-500/20 to-red-500/10 text-orange-300 border border-orange-500/20':'text-white/50 hover:text-white/80'}`}>{t}</button>
              ))}
            </div>
            {profTab==="overview" && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-2 gap-3">
                  {[{l:"Total Orders",v:selCust.orders},{l:"Total Spend",v:`৳${selCust.spend.toLocaleString()}`},{l:"Wallet",v:`৳${selCust.wallet}`},{l:"Rewards",v:`${selCust.rewards} pts`}].map((s,i)=> (
                    <Card key={i} className="p-4 text-center"><div className="text-lg font-bold text-white">{s.v}</div><div className="text-xs text-white/50">{s.l}</div></Card>
                  ))}
                </div>
                <Card className="p-4 space-y-3">
                  <h4 className="text-sm font-bold text-white/80 mb-2">Contact Info</h4>
                  <div className="flex items-center gap-3 text-sm text-white/70"><I.Mail c="w-4 h-4 text-white/40"/> {selCust.email}</div>
                  <div className="flex items-center gap-3 text-sm text-white/70"><I.Phone c="w-4 h-4 text-white/40"/> {selCust.phone}</div>
                  <div className="flex items-center gap-3 text-sm text-white/70"><I.MapPin c="w-4 h-4 text-white/40"/> {selCust.location}</div>
                  <div className="flex items-center gap-3 text-sm text-white/70"><I.Calendar c="w-4 h-4 text-white/40"/> Joined {selCust.joinDate}</div>
                </Card>
              </div>
            )}
            {profTab==="orders" && (
              <div className="space-y-3 animate-fade-in">
                {[1,2,3].map(i=> (
                  <Card key={i} className="p-4">
                    <div className="flex items-center justify-between mb-2"><span className="text-sm font-mono text-white/70">ORD-{7823+i}</span><Badge color={i===1?"green":"blue"}>{i===1?"Delivered":"Processing"}</Badge></div>
                    <div className="text-sm text-white/80">{i*2} items • ৳{i*1500}</div>
                    <div className="text-xs text-white/40 mt-1">{i} day(s) ago</div>
                  </Card>
                ))}
              </div>
            )}
            {profTab==="wallet" && (
              <div className="space-y-4 animate-fade-in">
                <GradCard from="from-orange-400" to="to-red-500" className="p-5 text-center">
                  <div className="text-sm text-white/80">Current Balance</div>
                  <div className="text-3xl font-bold text-white mt-1">৳{selCust.wallet}</div>
                </GradCard>
                <div className="flex gap-2"><Btn className="flex-1" onClick={()=>setWalletModal(true)}><I.Plus c="w-4 h-4"/> Add</Btn><Btn variant="secondary" className="flex-1"><I.CreditCard c="w-4 h-4"/> History</Btn></div>
              </div>
            )}
            {profTab==="rewards" && (
              <div className="space-y-4 animate-fade-in">
                <Card className="p-5 text-center"><div className="text-sm text-white/60">Available Points</div><div className="text-3xl font-bold text-orange-300 mt-1">{selCust.rewards}</div></Card>
                <Btn onClick={()=>setRewardModal(true)}><I.Plus c="w-4 h-4"/> Add Points</Btn>
              </div>
            )}
            {profTab==="landing" && (
              <div className="space-y-3 animate-fade-in">
                {landReqs.filter(l=>l.customer===selCust.name).map((lp,i)=> (
                  <Card key={i} className="p-4">
                    <div className="flex items-center justify-between"><div><div className="text-sm font-medium text-white">{lp.title}</div><div className="text-xs text-white/40">{lp.template} • {lp.products} products</div></div><Badge color={lp.status==="Published"?"green":"yellow"}>{lp.status}</Badge></div>
                  </Card>
                ))}
                {landReqs.filter(l=>l.customer===selCust.name).length===0 && <div className="text-center py-8 text-white/40 text-sm">No landing pages yet</div>}
              </div>
            )}
            {profTab==="activity" && (
              <div className="space-y-3 animate-fade-in">
                {[{a:"Logged in",t:"2 hours ago",i:I.Activity},{a:"Placed order ORD-7824",t:"5 hours ago",i:I.ShoppingBag},{a:"Wallet recharged ৳1000",t:"1 day ago",i:I.Wallet},{a:"Updated profile",t:"3 days ago",i:I.Edit}].map((act,i)=> (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0"><act.i c="w-4 h-4 text-white/60"/></div>
                    <div><div className="text-sm text-white/80">{act.a}</div><div className="text-xs text-white/40">{act.t}</div></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Modals */}
      <Modal isOpen={notifModal} onClose={()=>setNotifModal(false)} title="Send Notification" maxW="max-w-md">
        <div className="space-y-4">
          <Sel label="Type" value="push" onChange={()=>{}} options={[{value:"push",label:"Push"},{value:"sms",label:"SMS"},{value:"email",label:"Email"}]}/>
          <Inp label="Title" value="" onChange={()=>{}} placeholder="Enter title"/>
          <div className="space-y-1.5"><label className="block text-xs font-medium text-white/60 uppercase">Message</label><textarea rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl text-sm text-white p-3 focus:outline-none focus:ring-2 focus:ring-orange-400/40 resize-none" placeholder="Type your message..."/></div>
          <div className="flex gap-2 pt-2"><Btn onClick={()=>setNotifModal(false)}><I.Send c="w-4 h-4"/> Send to {selected.length} users</Btn><Btn variant="ghost" onClick={()=>setNotifModal(false)}>Cancel</Btn></div>
        </div>
      </Modal>

      <Modal isOpen={walletModal} onClose={()=>setWalletModal(false)} title="Manage Wallet" maxW="max-w-sm">
        <div className="space-y-4">
          <Sel label="Action" value="add" onChange={()=>{}} options={[{value:"add",label:"Add Balance"},{value:"deduct",label:"Deduct Balance"}]}/>
          <Inp label="Amount (৳)" type="number" value="" onChange={()=>{}} placeholder="0.00"/>
          <div className="space-y-1.5"><label className="block text-xs font-medium text-white/60 uppercase">Reason</label><textarea rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl text-sm text-white p-3 focus:outline-none focus:ring-2 focus:ring-orange-400/40 resize-none" placeholder="Reason..."/></div>
          <div className="flex gap-2 pt-2"><Btn onClick={()=>setWalletModal(false)}>Confirm</Btn><Btn variant="ghost" onClick={()=>setWalletModal(false)}>Cancel</Btn></div>
        </div>
      </Modal>

      <Modal isOpen={rewardModal} onClose={()=>setRewardModal(false)} title="Manage Rewards" maxW="max-w-sm">
        <div className="space-y-4">
          <Sel label="Action" value="add" onChange={()=>{}} options={[{value:"add",label:"Add Points"},{value:"remove",label:"Remove Points"}]}/>
          <Inp label="Points" type="number" value="" onChange={()=>{}} placeholder="0"/>
          <Inp label="Reason" value="" onChange={()=>{}} placeholder="Reason..."/>
          <div className="flex gap-2 pt-2"><Btn onClick={()=>setRewardModal(false)}>Confirm</Btn><Btn variant="ghost" onClick={()=>setRewardModal(false)}>Cancel</Btn></div>
        </div>
      </Modal>

      
    </div>
  );
}
