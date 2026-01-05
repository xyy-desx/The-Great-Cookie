import React from 'react';

interface ThankYouModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ThankYouModal: React.FC<ThankYouModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 md:p-12 text-center transform animate-bounce-in"
                onClick={(e) => e.stopPropagation()}
                style={{
                    animation: 'modalFadeScale 0.3s ease-out forwards'
                }}
            >
                {/* Success Icon */}
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h2 className="text-3xl font-black text-black mb-4">
                    Thank You! 🎉
                </h2>
                <p className="text-gray-600 text-lg mb-2">
                    We appreciate your feedback!
                </p>
                <p className="text-gray-500 text-sm mb-8">
                    Your review helps us serve you better and inspires others to enjoy The Great Cookie by Alex.
                </p>

                <button
                    onClick={onClose}
                    className="bg-black text-white font-bold py-3 px-8 rounded-full hover:bg-gray-800 transition-all transform hover:scale-105 active:scale-95"
                >
                    Close
                </button>
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

export default ThankYouModal;
