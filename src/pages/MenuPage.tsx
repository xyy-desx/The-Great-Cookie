import React, { useState } from 'react';
import Menu from '../components/Menu';
import OrderFormModal from '../components/OrderFormModal';

const MenuPage: React.FC = () => {
    const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
    const [selectedCookie, setSelectedCookie] = useState('');

    const handleOrderClick = (cookieName: string) => {
        setSelectedCookie(cookieName);
        setIsOrderFormOpen(true);
    };

    return (
        <>
            <Menu onOrderClick={handleOrderClick} />

            <OrderFormModal
                isOpen={isOrderFormOpen}
                onClose={() => setIsOrderFormOpen(false)}
                selectedCookie={selectedCookie}
            />
        </>
    );
};

export default MenuPage;
