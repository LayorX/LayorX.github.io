
import React from 'react';
import { NotificationIcon } from '../icons';

interface NotificationBellProps {
    hasUnread: boolean;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ hasUnread }) => {
    return (
        <div className="relative">
            <NotificationIcon className="w-7 h-7" />
            {hasUnread && (
                <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-dark-surface"></span>
            )}
        </div>
    );
};

export default NotificationBell;