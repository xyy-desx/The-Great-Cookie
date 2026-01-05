import React from 'react';
import cookie3 from '../assets/cookies/cookie3.png';

const AboutUs: React.FC = () => {
    return (
        <section id="about" className="relative py-16 md:py-24 px-6 md:px-12 max-w-6xl mx-auto overflow-hidden">
            {/* Cookie Rain Animation */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {[...Array(15)].map((_, i) => (
                    <img
                        key={i}
                        src={cookie3}
                        alt="Falling cookie"
                        className="absolute opacity-10"
                        style={{
                            width: `${30 + Math.random() * 40}px`,
                            left: `${Math.random() * 100}%`,
                            animation: `cookieRain ${8 + Math.random() * 8}s linear infinite`,
                            animationDelay: `${Math.random() * 5}s`,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10">
                <div className="text-center mb-12 animate-slide-up opacity-0" style={{ animationDelay: '0.1s' }}>
                    <h2 className="text-4xl md:text-5xl font-black text-black mb-4">
                        About Us
                    </h2>
                    <div className="w-20 h-1 bg-black mx-auto mb-8"></div>
                </div>

                <div className="space-y-6 text-gray-700 leading-relaxed animate-slide-up opacity-0 mb-16" style={{ animationDelay: '0.3s' }}>
                    <p className="text-base md:text-lg">
                        Founded in 2020, <span className="font-bold text-black">The Great Cookie by Alex</span> began with a simple yet powerful belief: that exceptional cookies have the power to create joy, bring people together, and transform ordinary moments into extraordinary memories. From day one, we've been dedicated to crafting each cookie from scratch using only the finest ingredients, unwavering passion, and meticulous attention to detail.
                    </p>

                    <p className="text-base md:text-lg">
                        What began as a humble kitchen passion has blossomed into an unwavering commitment to excellence. Every single cookie we bake embodies our dedication to <span className="font-bold text-black">freshness, bold flavors, and genuine authenticity</span>. We believe that truly great treats aren't made by cutting corners—they're crafted with purpose, creativity, and heart. That's why we use premium ingredients, time-tested recipes, and bake each batch with the same care we'd give to cookies for our own loved ones.
                    </p>

                    <p className="text-base md:text-lg">
                        Our mission extends far beyond simply selling cookies. We're here to deliver <span className="font-bold text-black">comfort, happiness, and unforgettable moments of pure delight</span> with every single bite. We're proud to prove that small businesses can create a meaningful impact—one thoughtfully crafted cookie at a time.
                    </p>

                    <p className="text-base md:text-lg text-center italic font-medium pt-4">
                        Thank you for being part of our sweet journey. Together, we're sharing joy, celebrating quality, and making life a little brighter—one great cookie at a time. 🍪✨
                    </p>
                </div>

                {/* Contact Information */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 md:p-8 animate-slide-up opacity-0" style={{ animationDelay: '0.5s' }}>
                    <h3 className="text-xl md:text-2xl font-black text-black mb-6 text-center">
                        Get In Touch
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Location */}
                        <div className="flex flex-col items-center text-center space-y-2 group">
                            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center transform transition-transform group-hover:scale-110 group-hover:rotate-12">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-black mb-1">Location</h4>
                                <p className="text-gray-700 text-xs font-medium">San Rafael, Sto. Tomas City</p>
                                <p className="text-gray-600 text-xs">Batangas, Philippines</p>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="flex flex-col items-center text-center space-y-2 group">
                            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center transform transition-transform group-hover:scale-110 group-hover:rotate-12">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-black mb-1">Phone</h4>
                                <p className="text-gray-700 text-xs font-medium">+63 975 012 0382</p>
                                <p className="text-gray-600 text-xs">Mon-Sat, 9:00 AM - 6:00 PM</p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex flex-col items-center text-center space-y-2 group">
                            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center transform transition-transform group-hover:scale-110 group-hover:rotate-12">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-black mb-1">Email</h4>
                                <p className="text-gray-700 text-xs font-medium break-all">thegreatcookiebyalex@gmail.com</p>
                                <p className="text-gray-600 text-xs">Response within 24 hours</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes cookieRain {
                    0% {
                        transform: translateY(-100px) rotate(0deg);
                        opacity: 0;
                    }
                    10% {
                        opacity: 0.1;
                    }
                    90% {
                        opacity: 0.1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
            `}</style>
        </section>
    );
};

export default AboutUs;
