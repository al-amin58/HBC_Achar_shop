
import { useNavigate } from "react-router";
import { toast } from 'react-toastify';
import api from '../../api/axios.js';


export default function Profile() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
           const response = await api.post('/auth/logout'); 
            localStorage.removeItem('token');
            toast.success(response.data.message || "Logged out successfully!");
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "An error occurred during logout.");
        }
    };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #fff8f0 0%, #f0faf4 50%, #fff8f0 100%)" }}>        


        {/* Decorative blobs */}       
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-40 pointer-events-none"
            style={{ background: "radial-gradient(circle, #ffc98b 0%, #ffe5c4 70%, transparent 100%)" }} /> 
        <div className="absolute -bottom-25 -right-20 w-96 h-96 rounded-full opacity-30 pointer-events-none"

            style={{ background: "radial-gradient(circle, #7dd9a8 0%, #c2f0d8 70%, transparent 100%)" }} />
        <div className="absolute top-1/2 -left-15 w-48 h-48 rounded-full opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(circle, #ffa94d 0%, transparent 100%)" }} />

        {/* Card */}
        <div className="relative z-10 w-full max-w-md mx-4">
            <div
                className="rounded-3xl p-10 shadow-2xl"
                style={{
                    background: "rgba(255,255,255,0.82)",
                    backdropFilter: "blur(18px)",
                    border: "1.5px solid rgba(255,193,112,0.25)",
                    boxShadow: "0 8px 48px 0 rgba(255,160,60,0.10), 0 2px 16px 0 rgba(80,200,130,0.08)"
                }}>
                {/* Logo / Brand */}
                <div className="flex flex-col items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Customer Profile</h2>
                    <p className="text-gray-500 mt-2">Manage your account details and preferences.</p>
                </div>
                {/* Profile Content */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-700">Personal Information</h3>
                        <p className="text-gray-500 mt-1">View and edit your personal details.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-700">Order History</h3>
                        <p className="text-gray-500 mt-1">Review your past orders and their statuses.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-700">Settings</h3>
                        <p className="text-gray-500 mt-1">Update your account settings and preferences.</p>
                    </div>
                </div>

                {/* Logout Button */}
                <div className="mt-10">
                    <button
                        onClick={handleLogout} 
                        className="w-full py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300" >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}