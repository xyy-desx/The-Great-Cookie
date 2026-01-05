import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/menu?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            setIsSearchOpen(false);
            setIsMenuOpen(false);
        }
    };

    return (
        <nav className="relative flex justify-between items-center py-4 md:py-6 px-6 md:px-12 max-w-7xl mx-auto w-full z-50">
            {/* Decorative Top Line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-50"></div>

            <Link to="/" className="flex items-center group cursor-pointer">
                <div className="relative transform transition-transform duration-500 hover:scale-105">
                    <img src={`${logo}?v=2`} alt="The Great Cookie by Alex" className="h-10 md:h-14 w-auto object-contain" />
                </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-12 text-base font-medium text-gray-800">
                <Link to="/" className="relative py-1 group transition-colors hover:text-black">
                    Home
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link to="/about" className="relative py-1 group transition-colors hover:text-black">
                    About Us
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link to="/menu" className="relative py-1 group transition-colors hover:text-black">
                    Menu
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
                </Link>
            </div>

            {/* Desktop Search & Mobile Menu Toggle */}
            <div className="flex gap-4 items-center">
                {/* Search Button/Bar */}
                {!isSearchOpen ? (
                    <button
                        className="p-2 hover:bg-white/50 rounded-full transition-all duration-300 hover:scale-125 active:scale-95 group shadow-sm hover:shadow-md"
                        onClick={() => setIsSearchOpen(true)}
                        title="Search"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 group-hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                ) : (
                    <form onSubmit={handleSearch} className="flex items-center gap-2 animate-fade-in">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            className="px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black w-48 md:w-64"
                            autoFocus
                        />
                        <button type="submit" className="p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                        <button type="button" onClick={() => setIsSearchOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </form>
                )}

                {/* Mobile Hamburger Menu */}
                <button
                    className="md:hidden p-2 hover:bg-white/50 rounded-lg transition-all active:scale-95"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <div className="w-6 h-5 flex flex-col justify-between">
                        <span className={`block h-0.5 w-full bg-gray-700 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`block h-0.5 w-full bg-gray-700 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`block h-0.5 w-full bg-gray-700 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                    </div>
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-md shadow-lg md:hidden animate-slide-down border-t border-gray-200">
                    <div className="flex flex-col p-6 space-y-4">
                        <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-left text-lg font-medium text-gray-800 hover:text-black transition-colors py-2">
                            Home
                        </Link>
                        <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-left text-lg font-medium text-gray-800 hover:text-black transition-colors py-2">
                            About Us
                        </Link>
                        <Link to="/menu" onClick={() => setIsMenuOpen(false)} className="text-left text-lg font-medium text-gray-800 hover:text-black transition-colors py-2">
                            Menu
                        </Link>
                    </div>
                </div>
            )}

            {/* Decorative Bottom Line */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-50"></div>
        </nav>
    );
};

export default Navbar;
