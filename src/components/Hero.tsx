import React, { useMemo } from 'react';
import heroGif from '../assets/cookies/gif1.gif';

const Hero: React.FC = () => {
    // Memoize crumb positions to prevent flickering
    const crumbPositions = useMemo(() => {
        return [...Array(40)].map(() => ({
            width: 3 + Math.random() * 8,
            top: Math.random() * 90,
            left: Math.random() * 95,
            opacity: 0.15 + Math.random() * 0.25,
            delay: Math.random() * 5,
            duration: 15 + Math.random() * 10,
        }));
    }, []);

    return (
        <section className="relative flex flex-col items-center justify-center px-6 md:px-12 max-w-7xl mx-auto w-full mt-6 md:mt-10 lg:mt-20 gap-12 overflow-hidden min-h-[70vh]">

            {/* Cookie Crumbs Background */}
            <div className="absolute inset-0 pointer-events-none">
                {crumbPositions.map((pos, index) => (
                    <div
                        key={index}
                        className="absolute rounded-full bg-amber-900 animate-float-3d"
                        style={{
                            width: `${pos.width}px`,
                            height: `${pos.width}px`,
                            top: `${pos.top}%`,
                            left: `${pos.left}%`,
                            opacity: pos.opacity,
                            animationDelay: `${pos.delay}s`,
                            animationDuration: `${pos.duration}s`,
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8 z-10">
                {/* Left Content */}
                <div className="flex-1 space-y-6 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl lg:text-6xl font-black leading-tight tracking-tighter text-black animate-slide-up opacity-0" style={{ animationDelay: '0.2s' }}>
                        ELEVATE YOUR DAY WITH A GREAT COOKIE EXPERIENCE
                    </h1>
                    <p className="text-base md:text-lg lg:text-xl text-gray-600 font-medium animate-slide-up opacity-0" style={{ animationDelay: '0.4s' }}>
                        "Savor Every Dash of Premium Quality Ingredients"
                    </p>

                    <div className="flex gap-4 justify-center md:justify-start pt-4 animate-slide-up opacity-0" style={{ animationDelay: '0.6s' }}>
                        <button
                            onClick={() => {
                                window.location.href = '/menu';
                            }}
                            className="relative overflow-hidden bg-black text-white font-black py-4 px-10 rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:-translate-y-2 hover:scale-105 active:scale-95 group"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                ORDER NOW
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </span>
                            <div className="absolute top-0 left-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-shimmer"></div>
                        </button>
                    </div>
                </div>

                {/* Center GIF with 3D effect */}
                <div className="flex-1 relative w-full flex items-center justify-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
                    <div
                        className="relative w-full max-w-xs md:max-w-2xl lg:max-w-4xl transform-gpu transition-all duration-700"
                        style={{
                            transform: 'perspective(1000px) rotateY(-5deg)',
                            transition: 'transform 0.3s ease-out'
                        }}
                        onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;
                            const centerX = rect.width / 2;
                            const centerY = rect.height / 2;
                            const rotateX = -(y - centerY) / 25;
                            const rotateY = (x - centerX) / 25;
                            e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'perspective(1000px) rotateY(-5deg) scale(1)';
                        }}
                    >
                        <img
                            src={heroGif}
                            alt="Hero Animation"
                            className="w-full h-full object-contain scale-110 md:scale-125 lg:scale-140"
                            style={{ filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.25))' }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
