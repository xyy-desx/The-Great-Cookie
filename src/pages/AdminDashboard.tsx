import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useOrderNotifications } from '../hooks/useOrderNotifications';
import API_URL from '../config/api';

interface Stats {
    total_cookies: number;
    total_orders: number;
    total_reviews: number;
    pending_reviews: number;
}

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const navigate = useNavigate();
    const { newOrdersCount, clearNotifications } = useOrderNotifications();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`${API_URL.replace('/api', '')}/api/admin/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            setStats(await response.json());
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        navigate('/admin');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-black">Admin Dashboard</h1>
                    <div className="flex gap-4">
                        <Link to="/" className="text-gray-600 hover:text-black">View Site</Link>
                        <button onClick={handleLogout} className="text-red-600 hover:text-red-800 font-semibold">
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <p className="text-gray-600 text-sm mb-2">Total Cookies</p>
                        <p className="text-4xl font-black">{stats?.total_cookies || 0}</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <p className="text-gray-600 text-sm mb-2">Total Orders</p>
                        <p className="text-4xl font-black">{stats?.total_orders || 0}</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <p className="text-gray-600 text-sm mb-2">Total Reviews</p>
                        <p className="text-4xl font-black">{stats?.total_reviews || 0}</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-yellow-400">
                        <p className="text-gray-600 text-sm mb-2">Pending Reviews</p>
                        <p className="text-4xl font-black text-yellow-600">{stats?.pending_reviews || 0}</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Link to="/admin/analytics" className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all hover:-translate-y-1 group">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-2xl">
                                📊
                            </div>
                            <div>
                                <h3 className="font-black text-xl group-hover:text-black">Analytics</h3>
                                <p className="text-gray-600 text-sm">Revenue & trends</p>
                            </div>
                        </div>
                    </Link>

                    <Link to="/admin/cookies" className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all hover:-translate-y-1 group">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl">
                                🍪
                            </div>
                            <div>
                                <h3 className="font-black text-xl group-hover:text-black">Manage Cookies</h3>
                                <p className="text-gray-600 text-sm">Add, edit, delete cookies</p>
                            </div>
                        </div>
                    </Link>

                    <Link to="/admin/reviews" className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all hover:-translate-y-1 group">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl">
                                ⭐
                            </div>
                            <div>
                                <h3 className="font-black text-xl group-hover:text-black">Manage Reviews</h3>
                                <p className="text-gray-600 text-sm">Approve or delete reviews</p>
                            </div>
                        </div>
                    </Link>

                    <Link to="/admin/orders" className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all hover:-translate-y-1 group relative" onClick={clearNotifications}>
                        {newOrdersCount > 0 && (
                            <div className="absolute top-4 right-4 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-sm animate-bounce">
                                {newOrdersCount}
                            </div>
                        )}
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl">
                                🛒
                            </div>
                            <div>
                                <h3 className="font-black text-xl group-hover:text-black">View Orders</h3>
                                <p className="text-gray-600 text-sm">See all customer orders</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
