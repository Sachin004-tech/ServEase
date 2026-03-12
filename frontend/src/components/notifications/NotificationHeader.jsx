import { MdDoneAll } from 'react-icons/md';

const NotificationHeader = ({ onMarkAllAsRead, unreadCount }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        {unreadCount > 0 && (
          <p className="text-sm text-gray-500 mt-1">
            You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>
      <button
        onClick={onMarkAllAsRead}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
      >
        <MdDoneAll className="text-lg" />
        Mark all as read
      </button>
    </div>
  );
};

export default NotificationHeader;
