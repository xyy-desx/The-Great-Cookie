import React, { useState } from 'react';
import Hero from '../components/Hero';
import Reviews from '../components/Reviews';
import ReviewFormModal from '../components/ReviewFormModal';
import ThankYouModal from '../components/ThankYouModal';

const HomePage: React.FC = () => {
    const [isThankYouModalOpen, setIsThankYouModalOpen] = useState(false);
    const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
    const [refreshReviews, setRefreshReviews] = useState(0);

    const handleReviewSubmit = (name: string, rating: number, comment: string) => {
        console.log('Review submitted:', { name, rating, comment });
        setIsThankYouModalOpen(true);
        // Trigger reviews component to refresh
        setRefreshReviews(prev => prev + 1);
    };

    return (
        <>
            <Hero />
            <Reviews key={refreshReviews} onOpenForm={() => setIsReviewFormOpen(true)} />

            <ReviewFormModal
                isOpen={isReviewFormOpen}
                onClose={() => setIsReviewFormOpen(false)}
                onSubmit={handleReviewSubmit}
            />
            <ThankYouModal isOpen={isThankYouModalOpen} onClose={() => setIsThankYouModalOpen(false)} />
        </>
    );
};

export default HomePage;
