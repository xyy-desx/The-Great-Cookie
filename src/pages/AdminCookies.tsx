import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../config/api';

interface Cookie {
    id: number;
    name: string;
    description: string;
    ingredients: string;
    category: string;
    price: number;
    weight: string;
    image: string;
}

const AdminCookies: React.FC = () => {
    const [cookies, setCookies] = useState<Cookie[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editData, setEditData] = useState<Partial<Cookie>>({});
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchCookies();
    }, []);

    const fetchCookies = async () => {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`${API_URL.replace('/api', '')}/api/admin/cookies`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            setCookies(await response.json());
        }
    };

    const handleEdit = (cookie: Cookie) => {
        setEditingId(cookie.id);
        setEditData(cookie);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const token = localStorage.getItem('admin_token');
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_URL.replace('/api', '')}/api/admin/upload-image`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                setEditData({ ...editData, image: data.image_url });
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (id: number) => {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`${API_URL.replace('/api', '')}/api/admin/cookies/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editData)
        });

        if (response.ok) {
            fetchCookies();
            setEditingId(null);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this cookie?')) return;

        const token = localStorage.getItem('admin_token');
        await fetch(`${API_URL.replace('/api', '')}/api/admin/cookies/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchCookies();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm mb-6">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-black">Manage Cookies</h1>
                    <Link to="/admin/dashboard" className="text-gray-600 hover:text-black">← Back to Dashboard</Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6">
                <div className="space-y-4">
                    {cookies.map(cookie => (
                        <div key={cookie.id} className="bg-white rounded-2xl shadow-lg p-6">
                            {editingId === cookie.id ? (
                                <div className="space-y-4">
                                    {/* Image Upload */}
                                    <div className="flex gap-4 items-start">
                                        <div className="flex-shrink-0">
                                            <img
                                                src={editData.image || cookie.image}
                                                alt={cookie.name}
                                                className="w-32 h-32 object-cover rounded-xl"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-bold mb-2">Cookie Image</label>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={uploading}
                                                className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm disabled:opacity-50"
                                            >
                                                {uploading ? 'Uploading...' : 'Change Image'}
                                            </button>
                                            <p className="text-xs text-gray-500 mt-2">Upload a new image for this cookie</p>
                                        </div>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            value={editData.name}
                                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                            className="px-4 py-2 border rounded-xl"
                                            placeholder="Name"
                                        />
                                        <input
                                            type="number"
                                            value={editData.price}
                                            onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) })}
                                            className="px-4 py-2 border rounded-xl"
                                            placeholder="Price"
                                        />
                                        <input
                                            value={editData.weight}
                                            onChange={(e) => setEditData({ ...editData, weight: e.target.value })}
                                            className="px-4 py-2 border rounded-xl"
                                            placeholder="Weight (e.g., 120g)"
                                        />
                                        <input
                                            value={editData.category}
                                            onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                                            className="px-4 py-2 border rounded-xl"
                                            placeholder="Category"
                                        />
                                        <textarea
                                            value={editData.description}
                                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                            className="px-4 py-2 border rounded-xl col-span-2"
                                            placeholder="Description"
                                            rows={2}
                                        />
                                        <textarea
                                            value={editData.ingredients}
                                            onChange={(e) => setEditData({ ...editData, ingredients: e.target.value })}
                                            className="px-4 py-2 border rounded-xl col-span-2"
                                            placeholder="Ingredients"
                                            rows={2}
                                        />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <button onClick={() => handleSave(cookie.id)} className="bg-black text-white px-6 py-2 rounded-full">Save</button>
                                        <button onClick={() => setEditingId(null)} className="bg-gray-200 px-6 py-2 rounded-full">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-between items-start gap-6">
                                    <div className="flex-shrink-0">
                                        <img
                                            src={cookie.image}
                                            alt={cookie.name}
                                            className="w-32 h-32 object-cover rounded-xl"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-black text-xl mb-2">{cookie.name}</h3>
                                        <p className="text-gray-700 text-sm mb-2">{cookie.description}</p>
                                        <p className="text-sm text-gray-500">Ingredients: {cookie.ingredients}</p>
                                        <p className="text-sm text-gray-500 mt-1">Category: {cookie.category}</p>
                                        <p className="text-lg font-bold mt-2">₱{cookie.price} ({cookie.weight})</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(cookie)} className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm">Edit</button>
                                        <button onClick={() => handleDelete(cookie.id)} className="bg-red-500 text-white px-4 py-2 rounded-full text-sm">Delete</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminCookies;
