import React from 'react';
import { MdNotificationsNone } from 'react-icons/md';

const EmptyNotification = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-2xl border border-gray-100 mt-6">
      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        <MdNotificationsNone className="text-4xl text-gray-300" />
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        No notifications yet
      </h3>
      <p className="text-gray-500 max-w-sm">
        We'll notify you when something important happens. Stay tuned for updates on your bookings and services.
      </p>
    </div>
  );
};

export default EmptyNotification;
