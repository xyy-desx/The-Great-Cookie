import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API_URL from '../config/api';

interface MenuProps {
    onOrderClick: (cookieName: string) => void;
}

interface Cookie {
    id: number;
    name: string;
    description: string;
    ingredients: string;
    category: string;
    price: number;
    weight?: string;
    image: string;
}

const Menu: React.FC<MenuProps> = ({ onOrderClick }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const searchQuery = searchParams.get('search') || '';
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [cookies, setCookies] = useState<Cookie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const categories = ['All', 'Chocolate', 'Nutty', 'Caramel', 'Fruity', 'Classic'];

    useEffect(() => {
        fetchCookies();
    }, []);

    const fetchCookies = async () => {
        setLoading(true);
        setError(null);

        try {
            // Add timeout to fetch request
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            const response = await fetch(`${API_URL}/cookies`, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // Add weight if not present
            const cookiesWithWeight = data.map((cookie: Cookie) => ({
                ...cookie,
                weight: cookie.weight || '120g'
            }));
            setCookies(cookiesWithWeight);
        } catch (err: any) {
            if (err.name === 'AbortError') {
                setError('Request timed out. Please check your connection and try again.');
            } else {
                setError('Failed to load menu. Please try again.');
            }
            console.error('Error fetching cookies:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredCookies = cookies.filter(cookie => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
            cookie.name.toLowerCase().includes(searchLower) ||
            cookie.description.toLowerCase().includes(searchLower) ||
            cookie.ingredients.toLowerCase().includes(searchLower) ||
            cookie.category.toLowerCase().includes(searchLower) ||
            cookie.price.toString().includes(searchLower);
        const matchesCategory = selectedCategory === 'All' || cookie.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Skeleton Loader Component
    const SkeletonCard = () => (
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden animate-pulse">
            <div className="h-64 bg-gray-200"></div>
            <div className="p-6 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-10 bg-gray-200 rounded-full mt-4"></div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <section id="menu" className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="text-center mb-12 animate-slide-up opacity-0" style={{ animationDelay: '0.1s' }}>
                    <h2 className="text-4xl md:text-5xl font-black text-black mb-4">
                        Our Menu
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Handcrafted with premium ingredients, baked fresh with love
                    </p>
                    <div className="w-20 h-1 bg-black mx-auto mt-4"></div>
                </div>

                {/* Show skeleton loaders while loading */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="menu" className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="text-center">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
                        <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-xl font-bold text-red-900 mb-2">Oops!</h3>
                        <p className="text-red-700 mb-4">{error}</p>
                        <button
                            onClick={fetchCookies}
                            className="bg-black text-white font-bold py-3 px-8 rounded-full hover:bg-gray-800 transition-all"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="menu" className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto">
            <div className="text-center mb-12 animate-slide-up opacity-0" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-4xl md:text-5xl font-black text-black mb-4">
                    Our Menu
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Handcrafted with premium ingredients, baked fresh with love
                </p>
                <div className="w-20 h-1 bg-black mx-auto mt-4"></div>
            </div>

            {/* Pricing Info */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-12 max-w-2xl mx-auto">
                <h3 className="font-black text-xl text-center mb-4">Assorted Box Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-600">Box of 3</p>
                        <p className="text-2xl font-black text-black">₱309</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-600">Box of 6</p>
                        <p className="text-2xl font-black text-black">₱614</p>
                    </div>
                </div>
                <p className="text-center text-sm text-gray-500 mt-4 italic">
                    All boxes are assorted with your choice of flavors! 🍪
                </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-6 py-2 rounded-full font-semibold transition-all ${selectedCategory === category
                            ? 'bg-black text-white shadow-lg scale-105'
                            : 'bg-white/80 text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {searchQuery && (
                <p className="text-center text-gray-600 mb-6">
                    Showing results for: <span className="font-bold text-black">"{searchQuery}"</span>
                    <button onClick={() => navigate('/menu')} className="ml-3 text-sm underline hover:text-black">
                        Clear search
                    </button>
                </p>
            )}

            {filteredCookies.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-2xl text-gray-400 mb-4">No cookies found</p>
                    <button onClick={() => navigate('/menu')} className="text-black underline">
                        View all cookies
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCookies.map((cookie, index) => (
                        <div
                            key={cookie.id}
                            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-slide-up opacity-0 overflow-hidden group flex flex-col h-full"
                            style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                        >
                            <div className="relative overflow-hidden h-64 shrink-0 bg-gray-100">
                                <img
                                    src={cookie.image}
                                    alt={cookie.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4 bg-black text-white px-4 py-2 rounded-full font-bold">
                                    <span className="text-lg">₱{cookie.price}</span>
                                </div>
                                <div className="absolute top-4 left-4 bg-white/90 text-black px-3 py-1 rounded-full text-xs font-semibold">
                                    {cookie.weight}
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>

                            <div className="p-6 space-y-3 flex flex-col flex-grow">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-black text-black flex-1">
                                        {cookie.name}
                                    </h3>
                                    <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                                        {cookie.category}
                                    </span>
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed italic line-clamp-3">
                                    {cookie.description}
                                </p>
                                <p className="text-xs text-gray-500">
                                    <span className="font-semibold">Ingredients:</span> <span className="line-clamp-2">{cookie.ingredients}</span>
                                </p>

                                <div className="mt-auto pt-4">
                                    <button
                                        onClick={() => onOrderClick(cookie.name)}
                                        className="w-full bg-black text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 hover:scale-105 active:scale-95"
                                    >
                                        Order Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default Menu;
