import { useEffect, useState, useRef } from 'react';
import API_URL from '../config/api';

export const useOrderNotifications = () => {
    const [newOrdersCount, setNewOrdersCount] = useState(0);
    const [lastCheckedId, setLastCheckedId] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        // Initialize audio
        audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuG0fPTgjMHIn/K79eLOgcUYrXr7KFOEg1Po+DyvmsiBS2J1PPWhjcIF3/J8Nt+KQYmfc3w4JlIDRVpuunqnlMPD1Cn4/K5ZhwGN5HX8s14LAYpftDw3ZI/ChVdtOvspFUUDUif4fK8bSAFKoXR89WBMAceGgAAAABiB==');

        // Poll for new orders every 30 seconds
        const interval = setInterval(checkForNewOrders, 30000);

        // Check immediately on mount
        checkForNewOrders();

        return () => clearInterval(interval);
    }, []);

    const checkForNewOrders = async () => {
        const token = localStorage.getItem('admin_token');
        if (!token) return;

        try {
            const response = await fetch(`${API_URL.replace('/api', '')}/api/admin/orders?status=pending`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const orders = await response.json();
                const newOrders = orders.filter((order: any) => order.id > lastCheckedId);

                if (newOrders.length > 0) {
                    setNewOrdersCount(prev => prev + newOrders.length);
                    setLastCheckedId(Math.max(...orders.map((o: any) => o.id)));

                    // Play sound
                    if (audioRef.current) {
                        audioRef.current.play().catch(e => console.log('Audio play failed:', e));
                    }

                    // Show browser notification
                    if ('Notification' in window && Notification.permission === 'granted') {
                        new Notification('🍪 New Order!', {
                            body: `You have ${newOrders.length} new order(s)`,
                            icon: '/cookie-icon.png'
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Failed to check for new orders:', error);
        }
    };

    const clearNotifications = () => {
        setNewOrdersCount(0);
    };

    return { newOrdersCount, clearNotifications };
};
