import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import { getAuthToken } from '../../componets/useCart.jsx';

const statusColors = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getAuthToken()) {
      navigate('/login', { state: { from: '/customer', reason: 'cart' } });
      return;
    }
    const load = async () => {
      try {
        const [meRes, ordersRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/orders/my'),
        ]);
        setProfile(meRes.data);
        setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
      } catch (err) {
        toast.error(err.response?.data?.message || 'প্রোফাইল লোড করা যায়নি');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('hbc-auth-logout'));
      toast.success('Logged out successfully!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Logout failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-emerald-700">
        লোড হচ্ছে...
      </div>
    );
  }

  const user = profile?.user;

  return (
    <div
      className="min-h-screen py-10 px-4"
      style={{ background: 'linear-gradient(135deg, #fff8f0 0%, #f0faf4 50%, #fff8f0 100%)' }}
    >
      <div className="max-w-2xl mx-auto">
        <div
          className="rounded-3xl p-8 shadow-2xl"
          style={{
            background: 'rgba(255,255,255,0.9)',
            border: '1.5px solid rgba(255,193,112,0.25)',
          }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Customer Profile</h2>
            <p className="text-gray-500 mt-2">{user?.name}</p>
            <p className="text-sm text-orange-600 font-medium">{user?.phonenumber}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-orange-50 rounded-xl p-4 text-center border border-orange-100">
              <p className="text-2xl font-bold text-orange-600">{profile?.stats?.totalOrders ?? 0}</p>
              <p className="text-xs text-gray-600">মোট অর্ডার</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100">
              <p className="text-2xl font-bold text-emerald-600">৳{user?.totalSpend ?? 0}</p>
              <p className="text-xs text-gray-600">মোট খরচ</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-3">সাম্প্রতিক অর্ডার</h3>
            {orders.length === 0 ? (
              <p className="text-sm text-gray-500">এখনো কোনো অর্ডার নেই</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {orders.map((o) => (
                  <Link
                    key={o.id}
                    to={`/invoice?id=${o.id}`}
                    className="block p-3 rounded-xl border border-emerald-100 hover:border-orange-200 hover:bg-orange-50/50 transition"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="font-bold text-sm text-gray-800">{o.orderNumber}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(o.createdAt).toLocaleDateString('bn-BD')}
                        </p>
                        {o.monthlySubscription && (
                          <span className="inline-block mt-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                            মাসিক সাবস্ক্রিপশন
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColors[o.status] || 'bg-gray-100'}`}>
                          {o.status}
                        </span>
                        <p className="text-sm font-bold text-orange-600 mt-1">৳{o.pricing?.total ?? 0}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-bold"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
