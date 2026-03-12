import React, { useState, useEffect } from 'react';
import NotificationHeader from '../../components/notifications/NotificationHeader';
import NotificationList from '../../components/notifications/NotificationList';
import { getNotifications, readNotification } from '../../api/auth';
import { toast } from 'react-toastify';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await getNotifications();
            // Assuming response and backend structure
            // If response is { success: true, notifications: [...] }
            setNotifications(response.notifications || response || []);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            toast.error("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await readNotification(id);
            setNotifications(prev =>
                prev.map(notif =>
                    notif.notification_id === id ? { ...notif, status: "read" } : notif
                )
            );
        } catch (error) {
            console.error("Error marking notification as read:", error);
            toast.error("Failed to update notification");
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            // If there's no bulk read API, we might need to loop or have a single endpoint
            // For now, let's assume we mark them all one by one or if API exists
            // Since I don't see a bulk API in auth.jsx, I'll loop for now but normally 
            // a bulk API is better.
            const unread = notifications.filter(n => n.status !== "read");
            await Promise.all(unread.map(n => readNotification(n.notification_id)));

            setNotifications(prev =>
                prev.map(notif => ({ ...notif, status: "read" }))
            );
            toast.success("All notifications marked as read");
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
            toast.error("Failed to update all notifications");
        }
    };

    const unreadCount = notifications.filter(n => n.status !== "read").length;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
            <NotificationHeader
                unreadCount={unreadCount}
                onMarkAllAsRead={handleMarkAllAsRead}
            />

            <div className="mt-4">
                <NotificationList
                    notifications={notifications}
                    onMarkAsRead={handleMarkAsRead}
                />
            </div>
        </div>
    );
};

export default Notifications;
