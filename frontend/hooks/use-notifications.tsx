
import { Notification } from '@/lib/types';
import { createContext, useContext, useEffect, useState } from 'react';

interface NotificationContextType {
    notifications: Notification[]
}

const NotificationContext = createContext<NotificationContextType>({
    notifications: []
});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        global.api.on("low-stock-warning",(_,data) => {
            setNotifications((prev) => [...prev, data]);
        });
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications }}>
            {children}
        </NotificationContext.Provider>
    );
};
