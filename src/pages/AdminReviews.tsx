import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`${API_URL.replace('/api', '')}/api/admin/reviews`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            setReviews(await response.json());
        }
    };

    const handleApprove = async (id: number) => {
        const token = localStorage.getItem('admin_token');
        await fetch(`${API_URL.replace('/api', '')}/api/admin/reviews/${id}/approve`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchReviews();
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this review?')) return;

        const token = localStorage.getItem('admin_token');
        await fetch(`${API_URL.replace('/api', '')}/api/admin/reviews/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchReviews();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm mb-6">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-black">Manage Reviews</h1>
                    <Link to="/admin/dashboard" className="text-gray-600 hover:text-black">← Back to Dashboard</Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6">
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
            </div>
        </div>
    );
};

export default AdminReviews;
