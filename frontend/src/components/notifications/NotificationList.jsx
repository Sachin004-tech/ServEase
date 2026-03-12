import React from 'react';
import NotificationCard from './NotificationCard';
import EmptyNotification from './EmptyNotification';

const NotificationList = ({ notifications, onMarkAsRead }) => {
  if (!notifications || notifications.length === 0) {
    return <EmptyNotification />;
  }

  return (
    <div className="space-y-2">
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.notification_id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
        />
      ))}
    </div>
  );
};

export default NotificationList;
