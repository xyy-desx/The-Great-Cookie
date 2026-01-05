import React, { useState, useEffect } from 'react';
import API_URL from '../config/api';

interface OrderFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedCookie?: string;
}

const OrderFormModal: React.FC<OrderFormModalProps> = ({ isOpen, onClose, selectedCookie }) => {
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [cookie, setCookie] = useState(selectedCookie || '');
    const [quantity, setQuantity] = useState(1);
    const [notes, setNotes] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Update cookie selection when selectedCookie prop changes
    useEffect(() => {
        if (selectedCookie) {
            setCookie(selectedCookie);
        }
    }, [selectedCookie]);

    if (!isOpen) return null;

    const handleMessengerOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!name || !contact || !cookie) {
            alert("Please fill in your Name, Contact, and ensure a Cookie is selected.");
            return;
        }

        setLoading(true); // Show loading state while saving

        // 1. Save to Database First (to capture Revenue)
        try {
            await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer_name: name,
                    contact: contact,
                    cookie_name: cookie,
                    quantity: quantity,
                    notes: notes,
                    delivery_address: deliveryAddress,
                    total_price: null, // Backend calculates this
                    payment_method: paymentMethod,
                    delivery_date: deliveryDate,
                    order_source: 'messenger' // Mark as Messenger order
                }),
            });
        } catch (error) {
            console.error("Failed to save messenger order to DB", error);
            // Continue anyway so the user can still message
        }

        // 2. Create message for Facebook
        const fbMessage = `🍪 NEW ORDER from ${name}

Cookie: ${cookie}
Quantity: ${quantity}
Contact: ${contact}
${deliveryAddress ? `Delivery Address: ${deliveryAddress}` : ''}
${paymentMethod ? `Payment: ${paymentMethod}` : ''}
${deliveryDate ? `Delivery Date: ${deliveryDate}` : ''}
${notes ? `Notes: ${notes}` : ''}

Please confirm this order. Thank you!`;

        // 3. Open Messenger
        const messengerUrl = `https://m.me/homemadebakedpastries?text=${encodeURIComponent(fbMessage)}`;
        window.open(messengerUrl, '_blank');

        setLoading(false);
        resetForm();
        onClose();
    };

    const handleDirectOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customer_name: name,
                    contact: contact,
                    cookie_name: cookie,
                    quantity: quantity,
                    notes: notes,
                    delivery_address: deliveryAddress,
                    total_price: null, // Can be calculated based on cookie price
                    payment_method: paymentMethod,
                    delivery_date: deliveryDate,
                    order_source: 'website'
                }),
            });

            if (response.ok) {
                setMessage({ type: 'success', text: '✓ Order placed successfully! We\'ll contact you shortly.' });
                setTimeout(() => {
                    resetForm();
                    onClose();
                }, 2000);
            } else {
                setMessage({ type: 'error', text: '✗ Failed to place order. Please try again.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: '✗ Connection error. Please check your internet.' });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setName('');
        setContact('');
        setCookie('');
        setQuantity(1);
        setNotes('');
        setDeliveryAddress('');
        setPaymentMethod('COD');
        setDeliveryDate('');
        setMessage(null);
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-2xl w-full p-6 md:p-8 transform max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
                style={{ animation: 'modalFadeScale 0.3s ease-out forwards' }}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl md:text-3xl font-black text-black">
                        Place Your Order
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <p className="text-gray-600 text-sm mb-6">
                    Fill in your details below
                </p>

                {message && (
                    <div className={`mb-4 p-3 rounded-xl text-sm font-semibold ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {message.text}
                    </div>
                )}

                <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                                Your Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                placeholder="Enter your name"
                            />
                        </div>

                        <div>
                            <label htmlFor="contact" className="block text-sm font-bold text-gray-700 mb-2">
                                Contact Number *
                            </label>
                            <input
                                type="tel"
                                id="contact"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                placeholder="09XX XXX XXXX"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="cookie" className="block text-sm font-bold text-gray-700 mb-2">
                                Select Cookie *
                            </label>
                            <select
                                id="cookie"
                                value={cookie}
                                onChange={(e) => setCookie(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                            >
                                <option value="">Choose a cookie</option>
                                <option value="Alcapone Cookie">Alcapone Cookie</option>
                                <option value="Biscoff Campfire">Biscoff Campfire</option>
                                <option value="Chocobomb Walnut">Chocobomb Walnut</option>
                                <option value="Classic Belgian">Classic Belgian</option>
                                <option value="Funfetti Cookie">Funfetti Cookie</option>
                                <option value="Red Velvet">Red Velvet</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="quantity" className="block text-sm font-bold text-gray-700 mb-2">
                                Quantity *
                            </label>
                            <input
                                type="number"
                                id="quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                                min="1"
                                required
                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="deliveryAddress" className="block text-sm font-bold text-gray-700 mb-2">
                            Delivery Address
                        </label>
                        <input
                            type="text"
                            id="deliveryAddress"
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                            placeholder="Street, Barangay, City, Province"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="paymentMethod" className="block text-sm font-bold text-gray-700 mb-2">
                                Payment Method
                            </label>
                            <select
                                id="paymentMethod"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                            >
                                <option value="COD">Cash on Delivery</option>
                                <option value="GCash">GCash</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="deliveryDate" className="block text-sm font-bold text-gray-700 mb-2">
                                Preferred Delivery Date
                            </label>
                            <input
                                type="date"
                                id="deliveryDate"
                                value={deliveryDate}
                                onChange={(e) => setDeliveryDate(e.target.value)}
                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="notes" className="block text-sm font-bold text-gray-700 mb-2">
                            Special Requests (Optional)
                        </label>
                        <textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none"
                            placeholder="Any special requests or delivery instructions?"
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleDirectOrder}
                            disabled={loading}
                            className="flex-1 bg-black text-white font-black py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Place Order Now
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleMessengerOrder}
                            className="flex-1 bg-blue-600 text-white font-black py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Send via Messenger
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                @keyframes modalFadeScale {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `}</style>
        </div>
    );
};

export default OrderFormModal;
