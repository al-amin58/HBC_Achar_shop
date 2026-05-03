export default function AdminLogin() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login to HBC Achar</h2>
                <div className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone or Email</label>
                        <input type="text" placeholder="Enter phone/email" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" placeholder="Enter password" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                    </div>

                    <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                        Login
                    </button>     
                    <div className="flex justify-between text-sm mt-3">
                        <a href="/forgot-password" className="text-green-600">Forgot Password?</a>
                        <a href="/register" className="text-green-600">Register</a>
                    </div>
                </div>      

            </div>
        </div>
    );
}