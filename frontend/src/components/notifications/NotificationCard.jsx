import React from 'react';
import { MdNotifications, MdCheckCircle, MdError, MdInfo } from 'react-icons/md';

const NotificationCard = ({ notification, onMarkAsRead }) => {
  const { notification_id, title, message, time, status, type } = notification;
  const isRead = status === 'read';

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <MdCheckCircle className="text-green-500 text-xl" />;
      case 'error':
        return <MdError className="text-red-500 text-xl" />;
      case 'info':
        return <MdInfo className="text-blue-500 text-xl" />;
      default:
        return <MdNotifications className="text-gray-500 text-xl" />;
    }
  };

  return (
    <div
      onClick={() => !isRead && onMarkAsRead(notification_id)}
      className={`group relative p-4 mb-3 rounded-xl border transition-all duration-300 cursor-pointer ${
        isRead
          ? 'bg-white border-gray-100 hover:border-gray-200'
          : 'bg-blue-50/30 border-blue-100 hover:border-blue-200'
      }`}
    >
      <div className="flex gap-4">
        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
          isRead ? 'bg-gray-100' : 'bg-blue-100'
        }`}>
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h3 className={`text-sm font-semibold truncate ${
              isRead ? 'text-gray-700' : 'text-gray-900'
            }`}>
              {title}
            </h3>
            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
              {time}
            </span>
          </div>
          <p className={`text-sm line-clamp-2 ${
            isRead ? 'text-gray-500' : 'text-gray-600'
          }`}>
            {message}
          </p>
        </div>

        {!isRead && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
            <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCard;
