import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../config/api';

interface Review {
    id: number;
    customer_name: string;
    rating: number;
    comment: string;
    approved: boolean;
    created_at: string;
}

const AdminReviews: React.FC = () => {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('admin_token');
            // Ensure URL is clean
            const baseUrl = API_URL.replace(/\/api$/, '');
            const url = `${baseUrl}/api/admin/reviews`;

            console.log('Fetching reviews from:', url);

            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setReviews(data);
            } else {
                if (response.status === 401) {
                    localStorage.removeItem('admin_token');
                    navigate('/admin');
                    return;
                }
                const text = await response.text();
                setError(`Failed to load reviews: ${response.status} ${text}`);
            }
        } catch (err) {
            setError(`Network error: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: number) => {
        const token = localStorage.getItem('admin_token');
        const baseUrl = API_URL.replace(/\/api$/, '');
        await fetch(`${baseUrl}/api/admin/reviews/${id}/approve`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchReviews();
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this review?')) return;

        const token = localStorage.getItem('admin_token');
        const baseUrl = API_URL.replace(/\/api$/, '');
        await fetch(`${baseUrl}/api/admin/reviews/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchReviews();
    };

    if (loading) return <div className="p-8 text-center">Loading reviews...</div>;
    if (error) return <div className="p-8 text-center text-red-600 font-bold">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm mb-6">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-black">Manage Reviews</h1>
                    <Link to="/admin/dashboard" className="text-gray-600 hover:text-black">← Back to Dashboard</Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6">
                {reviews.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl shadow">
                        <p className="text-gray-500 text-lg">No reviews found.</p>
                        <p className="text-gray-400 text-sm mt-2">New reviews will appear here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {reviews.map(review => (
                            <div key={review.id} className={`bg-white rounded-2xl shadow-lg p-6 ${!review.approved ? 'border-2 border-yellow-400' : ''}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg">{review.customer_name}</h3>
                                        <div className="flex gap-1 my-2">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>⭐</span>
                                            ))}
                                        </div>
                                    </div>
                                    {!review.approved && (
                                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                                            Pending
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-700 italic mb-4">"{review.comment}"</p>
                                <div className="flex gap-2">
                                    {!review.approved && (
                                        <button
                                            onClick={() => handleApprove(review.id)}
                                            className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold"
                                        >
                                            Approve
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(review.id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminReviews;
