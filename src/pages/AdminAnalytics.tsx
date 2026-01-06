import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../config/api';

interface Analytics {
    total_revenue: number;
    average_order_value: number;
    monthly_revenue: number;
    monthly_orders: number;
    best_sellers: Array<{
        cookie_name: string;
        total_sold: number;
        revenue: number;
    }>;
    daily_sales: Array<{
        date: string;
        revenue: number;
        order_count: number;
    }>;
}

const AdminAnalytics: React.FC = () => {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        const token = localStorage.getItem('admin_token');
        try {
            const response = await fetch(`${API_URL.replace('/api', '')}/api/admin/analytics/revenue`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setAnalytics(await response.json());
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-900 border-t-transparent mb-4"></div>
                <p className="text-xl font-bold text-gray-600 animate-pulse">Loading analytics...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm mb-6">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-black">Revenue Analytics</h1>
                    <Link to="/admin/dashboard" className="text-gray-600 hover:text-black">← Back to Dashboard</Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
                        <p className="text-sm opacity-90 mb-2">Total Revenue</p>
                        <p className="text-3xl font-black">₱{analytics?.total_revenue.toLocaleString() || 0}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
                        <p className="text-sm opacity-90 mb-2">Avg Order Value</p>
                        <p className="text-3xl font-black">₱{analytics?.average_order_value.toFixed(2) || 0}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                        <p className="text-sm opacity-90 mb-2">This Month</p>
                        <p className="text-3xl font-black">₱{analytics?.monthly_revenue.toLocaleString() || 0}</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
                        <p className="text-sm opacity-90 mb-2">Orders This Month</p>
                        <p className="text-3xl font-black">{analytics?.monthly_orders || 0}</p>
                    </div>
                </div>

                {/* Best Sellers */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-black mb-4">🏆 Best Selling Cookies</h2>
                    <div className="space-y-3">
                        {analytics?.best_sellers.map((cookie, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-white ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-gray-300'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">{cookie.cookie_name}</p>
                                        <p className="text-sm text-gray-600">{cookie.total_sold} units sold</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-lg text-green-600">₱{cookie.revenue.toLocaleString()}</p>
                                    <p className="text-xs text-gray-500">Revenue</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Daily Sales Chart */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-black mb-4">📊 Last 7 Days Sales</h2>
                    <div className="space-y-2">
                        {analytics?.daily_sales.map((day, index) => {
                            const maxRevenue = Math.max(...(analytics?.daily_sales.map(d => d.revenue) || [1]));
                            const percentage = (day.revenue / maxRevenue) * 100;
                            return (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="w-24 text-sm font-semibold text-gray-700">
                                        {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                    <div className="flex-1">
                                        <div className="bg-gray-200 rounded-full h-8 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-purple-600 h-full flex items-center justify-end pr-3 transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            >
                                                {day.revenue > 0 && (
                                                    <span className="text-white text-xs font-bold">₱{day.revenue.toFixed(2)}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-20 text-right text-sm text-gray-600">
                                        {day.order_count} orders
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {(!analytics?.daily_sales || analytics.daily_sales.length === 0) && (
                        <p className="text-center text-gray-500 py-8">No sales data for the last 7 days</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
