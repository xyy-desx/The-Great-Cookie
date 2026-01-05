import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../config/api';

interface Order {
    id: number;
    customer_name: string;
    contact: string;
    cookie_name: string;
    quantity: number;
    notes: string | null;
    delivery_address: string | null;
    total_price: number | null;
    payment_method: string | null;
    delivery_date: string | null;
    order_source: string;
    status: string;
    created_at: string;
    updated_at: string;
}

const AdminOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    // Manual Order State
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);
    const [manualOrder, setManualOrder] = useState({
        customer_name: '',
        contact: '',
        cookie_name: 'Alcapone Cookie',
        quantity: 1,
        notes: '',
        payment_method: 'Cash',
        order_source: 'manual'
    });
    const [submitting, setSubmitting] = useState(false);

    // Edit Order State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState<{
        id: number;
        cookie_name: string;
        quantity: number;
        notes: string;
    } | null>(null);

    useEffect(() => {
        fetchOrders();
    }, [filterStatus]);

    const fetchOrders = async () => {
        const token = localStorage.getItem('admin_token');
        const url = filterStatus === 'all'
            ? `${API_URL.replace('/api', '')}/api/admin/orders`
            : `${API_URL.replace('/api', '')}/api/admin/orders?status=${filterStatus}`;

        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            setOrders(await response.json());
        }
    };

    const updateOrderStatus = async (orderId: number, newStatus: string) => {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`${API_URL.replace('/api', '')}/api/admin/orders/${orderId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (response.ok) {
            fetchOrders(); // Refresh orders
        }
    };

    const handleCreateManualOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await fetch(`${API_URL.replace('/api', '')}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...manualOrder,
                    total_price: null // Backend will calculate
                })
            });

            if (response.ok) {
                fetchOrders();
                setIsManualModalOpen(false);
                setManualOrder({
                    customer_name: '',
                    contact: '',
                    cookie_name: 'Alcapone Cookie',
                    quantity: 1,
                    notes: '',
                    payment_method: 'Cash',
                    order_source: 'manual'
                });
            } else {
                alert('Failed to create order');
            }
        } catch (error) {
            console.error(error);
            alert('Error creating order');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingOrder) return;
        setSubmitting(true);
        const token = localStorage.getItem('admin_token');

        try {
            const response = await fetch(`${API_URL.replace('/api', '')}/api/admin/orders/${editingOrder.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cookie_name: editingOrder.cookie_name,
                    quantity: editingOrder.quantity,
                    notes: editingOrder.notes
                })
            });

            if (response.ok) {
                fetchOrders();
                setIsEditModalOpen(false);
                setEditingOrder(null);
            } else {
                alert('Failed to update order');
            }
        } catch (error) {
            console.error(error);
            alert('Error updating order');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusColor = (status: string) => {
        const colors: { [key: string]: string } = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'confirmed': 'bg-blue-100 text-blue-800',
            'preparing': 'bg-purple-100 text-purple-800',
            'out_for_delivery': 'bg-orange-100 text-orange-800',
            'completed': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const formatStatus = (status: string) => {
        return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const filteredOrders = orders.filter(order =>
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.contact.includes(searchTerm) ||
        order.cookie_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm mb-6">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-black">Customer Orders</h1>
                    <div className="flex gap-4 items-center">
                        <a
                            href={`${API_URL.replace('/api', '')}/api/admin/orders/export${filterStatus !== 'all' ? `?status=${filterStatus}` : ''}`}
                            className="bg-green-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                            onClick={(e) => {
                                const token = localStorage.getItem('admin_token');
                                e.preventDefault();
                                fetch(e.currentTarget.href, {
                                    headers: { 'Authorization': `Bearer ${token}` }
                                }).then(res => res.blob()).then(blob => {
                                    const url = window.URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
                                    a.click();
                                });
                            }}
                        >
                            📥 Export Orders
                        </a>
                        <button
                            onClick={() => setIsManualModalOpen(true)}
                            className="bg-black text-white px-4 py-2 rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"
                        >
                            + Create Manual Order
                        </button>
                        <Link to="/admin/dashboard" className="text-gray-600 hover:text-black">← Back to Dashboard</Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6">
                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search by customer name, contact, or cookie..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {['all', 'pending', 'confirmed', 'preparing', 'out_for_delivery', 'completed'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-4 py-2 rounded-xl font-semibold transition-all ${filterStatus === status
                                        ? 'bg-black text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {status === 'all' ? 'All' : formatStatus(status)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left font-bold">ID</th>
                                    <th className="px-6 py-4 text-left font-bold">Customer</th>
                                    <th className="px-6 py-4 text-left font-bold">Contact</th>
                                    <th className="px-6 py-4 text-left font-bold">Cookie</th>
                                    <th className="px-6 py-4 text-left font-bold">Qty</th>
                                    <th className="px-6 py-4 text-left font-bold">Payment</th>
                                    <th className="px-6 py-4 text-left font-bold">Status</th>
                                    <th className="px-6 py-4 text-left font-bold">Date</th>
                                    <th className="px-6 py-4 text-left font-bold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map(order => (
                                    <tr key={order.id} className="border-t hover:bg-gray-50">
                                        <td className="px-6 py-4">#{order.id}</td>
                                        <td className="px-6 py-4 font-semibold">{order.customer_name}</td>
                                        <td className="px-6 py-4 text-sm">{order.contact}</td>
                                        <td className="px-6 py-4">{order.cookie_name}</td>
                                        <td className="px-6 py-4">{order.quantity}</td>
                                        <td className="px-6 py-4 text-sm">{order.payment_method || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)} border-0 cursor-pointer`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="preparing">Preparing</option>
                                                <option value="out_for_delivery">Out for Delivery</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => {
                                                    setEditingOrder({
                                                        id: order.id,
                                                        cookie_name: order.cookie_name,
                                                        quantity: order.quantity,
                                                        notes: order.notes || ''
                                                    });
                                                    setIsEditModalOpen(true);
                                                }}
                                                className="text-green-600 hover:text-green-800 font-semibold text-sm mr-3"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredOrders.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No orders found
                        </div>
                    )}
                </div>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedOrder(null)}
                >
                    <div
                        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black">Order #{selectedOrder.id}</h2>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-700">Customer Name</label>
                                    <p className="text-gray-900">{selectedOrder.customer_name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-700">Contact</label>
                                    <p className="text-gray-900">{selectedOrder.contact}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-700">Cookie</label>
                                    <p className="text-gray-900">{selectedOrder.cookie_name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-700">Quantity</label>
                                    <p className="text-gray-900">{selectedOrder.quantity}</p>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-bold text-gray-700">Delivery Address</label>
                                <p className="text-gray-900">{selectedOrder.delivery_address || 'Not provided'}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-700">Payment Method</label>
                                    <p className="text-gray-900">{selectedOrder.payment_method || 'Not specified'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-700">Delivery Date</label>
                                    <p className="text-gray-900">{selectedOrder.delivery_date || 'Not specified'}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-700">Order Source</label>
                                    <p className="text-gray-900 capitalize">{selectedOrder.order_source}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-700">Status</label>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedOrder.status)}`}>
                                        {formatStatus(selectedOrder.status)}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-bold text-gray-700">Special Notes</label>
                                <p className="text-gray-900">{selectedOrder.notes || 'No special requests'}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                <div>
                                    <label className="text-sm font-bold text-gray-700">Created At</label>
                                    <p className="text-gray-900 text-sm">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-700">Last Updated</label>
                                    <p className="text-gray-900 text-sm">{new Date(selectedOrder.updated_at).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Manual Order Modal */}
            {isManualModalOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setIsManualModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 md:p-8 transform"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black">Create Order</h2>
                            <button onClick={() => setIsManualModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">✕</button>
                        </div>
                        <form onSubmit={handleCreateManualOrder} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Customer Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl"
                                    value={manualOrder.customer_name}
                                    onChange={e => setManualOrder({ ...manualOrder, customer_name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Contact</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl"
                                    value={manualOrder.contact}
                                    onChange={e => setManualOrder({ ...manualOrder, contact: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Cookie</label>
                                    <select
                                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl"
                                        value={manualOrder.cookie_name}
                                        onChange={e => setManualOrder({ ...manualOrder, cookie_name: e.target.value })}
                                    >
                                        <option value="Alcapone Cookie">Alcapone Cookie</option>
                                        <option value="Biscoff Campfire">Biscoff Campfire</option>
                                        <option value="Chocobomb Walnut">Chocobomb Walnut</option>
                                        <option value="Classic Belgian">Classic Belgian</option>
                                        <option value="Funfetti Cookie">Funfetti Cookie</option>
                                        <option value="Red Velvet">Red Velvet</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Quantity</label>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl"
                                        value={manualOrder.quantity}
                                        onChange={e => setManualOrder({ ...manualOrder, quantity: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Notes</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl"
                                    placeholder="Optional"
                                    value={manualOrder.notes}
                                    onChange={e => setManualOrder({ ...manualOrder, notes: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 disabled:opacity-50"
                            >
                                {submitting ? 'Creating...' : 'Create Order'}
                            </button>
                        </form>
                    </div>
                </div>
            {/* Edit Order Modal */}
            {isEditModalOpen && editingOrder && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setIsEditModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 md:p-8 transform"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black">Edit Order #{editingOrder.id}</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">✕</button>
                        </div>
                        <form onSubmit={handleUpdateOrder} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Cookie</label>
                                    <select
                                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl"
                                        value={editingOrder.cookie_name}
                                        onChange={e => setEditingOrder({ ...editingOrder, cookie_name: e.target.value })}
                                    >
                                        <option value="Alcapone Cookie">Alcapone Cookie</option>
                                        <option value="Biscoff Campfire">Biscoff Campfire</option>
                                        <option value="Chocobomb Walnut">Chocobomb Walnut</option>
                                        <option value="Classic Belgian">Classic Belgian</option>
                                        <option value="Funfetti Cookie">Funfetti Cookie</option>
                                        <option value="Red Velvet">Red Velvet</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Quantity</label>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl"
                                        value={editingOrder.quantity}
                                        onChange={e => setEditingOrder({ ...editingOrder, quantity: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Notes</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl"
                                    value={editingOrder.notes}
                                    onChange={e => setEditingOrder({ ...editingOrder, notes: e.target.value })}
                                />
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-xl text-sm text-yellow-800">
                                ℹ️ Price will be automatically recalculated based on the new quantity.
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 disabled:opacity-50"
                            >
                                {submitting ? 'Updating...' : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
