import React, { useState } from 'react';

interface ReviewFormProps {
    onSubmit: (name: string, rating: number, comment: string) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit }) => {
    const [name, setName] = useState('');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hoveredStar, setHoveredStar] = useState(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && rating && comment) {
            onSubmit(name, rating, comment);
            setName('');
            setRating(0);
            setComment('');
        }
    };

    return (
        <section id="about" className="py-12 md:py-16 px-6 md:px-12 max-w-4xl mx-auto">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 md:p-10 border border-gray-200">
                <h2 className="text-2xl md:text-3xl font-black text-black mb-2 text-center">
                    Share Your Experience
                </h2>
                <p className="text-gray-600 text-center mb-6 text-sm md:text-base">
                    We'd love to hear from you!
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Input */}
                    <div className="animate-slide-up opacity-0" style={{ animationDelay: '0.1s' }}>
                        <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                            Your Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                            placeholder="Enter your name"
                        />
                    </div>

                    {/* Star Rating */}
                    <div className="animate-slide-up opacity-0" style={{ animationDelay: '0.2s' }}>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Your Rating
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredStar(star)}
                                    onMouseLeave={() => setHoveredStar(0)}
                                    className="transition-transform hover:scale-125 active:scale-95"
                                >
                                    <svg
                                        className={`w-8 h-8 md:w-10 md:h-10 ${star <= (hoveredStar || rating)
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-gray-300'
                                            } transition-colors`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Comment Textarea */}
                    <div className="animate-slide-up opacity-0" style={{ animationDelay: '0.3s' }}>
                        <label htmlFor="comment" className="block text-sm font-bold text-gray-700 mb-2">
                            Your Review
                        </label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                            rows={3}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none"
                            placeholder="Tell us about your experience..."
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="animate-slide-up opacity-0" style={{ animationDelay: '0.4s' }}>
                        <button
                            type="submit"
                            className="w-full bg-black text-white font-black py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 hover:scale-105 active:scale-95"
                        >
                            Submit Review
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default ReviewForm;
