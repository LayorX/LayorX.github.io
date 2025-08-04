
import React from 'react';
import { FixedSizeList as List } from 'react-window';
import { User, Notification as NotificationType } from '../../types';
import { CommentIcon, CheckIcon } from '../icons';

const formatTimestamp = (timestamp: number) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) return "剛剛";
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes} 分鐘前`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} 小時前`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} 天前`;
};


interface NotificationsPageProps {
    user: User;
    users: Record<string, User>;
    onNavigate: (view: 'contentDetail', payload: { planetId: string, contentId: string, contentType: 'argument' | 'comment' }) => void;
    onOpenProfilePreview: (userId: string) => void;
}

const NotificationItem: React.FC<{
    notification: NotificationType;
    allUsers: Record<string, User>;
    onNavigate: NotificationsPageProps['onNavigate'];
    onOpenProfilePreview: NotificationsPageProps['onOpenProfilePreview'];
}> = ({ notification, allUsers, onNavigate, onOpenProfilePreview }) => {
    const fromUser = allUsers[notification.fromUserId];
    if (!fromUser) return null;

    let icon: React.ReactNode;
    let text: React.ReactNode;

    switch (notification.type) {
        case 'reply':
            icon = <CommentIcon className="w-6 h-6 text-sky-500" />;
            text = <><strong className="cursor-pointer hover:underline" onClick={(e) => { e.stopPropagation(); onOpenProfilePreview(fromUser.id);}}>{fromUser.name}</strong> 回覆了你的內容。</>;
            break;
        case 'rating':
            icon = <CheckIcon className="w-6 h-6 text-green-500" />;
            text = <><strong className="cursor-pointer hover:underline" onClick={(e) => { e.stopPropagation(); onOpenProfilePreview(fromUser.id);}}>{fromUser.name}</strong> 評價了你的內容。</>;
            break;
        default:
            return null;
    }

    return (
        <button 
            onClick={() => onNavigate('contentDetail', { planetId: notification.planetId, contentId: notification.contentId, contentType: notification.contentType })}
            className={`w-full text-left p-4 flex items-start space-x-4 transition-colors ${!notification.read ? 'bg-sky-50 dark:bg-sky-900/20' : 'hover:bg-stone-50 dark:hover:bg-dark-surface/50'}`}
        >
            <div className="flex-shrink-0 mt-1">{icon}</div>
            <div className="flex-1">
                <img src={fromUser.avatar} alt={fromUser.name} className="w-8 h-8 rounded-full mb-2" />
                <p className="text-sm">{text}</p>
                <p className="text-xs text-dark-secondary-text mt-1">{formatTimestamp(notification.timestamp)}</p>
            </div>
        </button>
    );
}


const NotificationsPage: React.FC<NotificationsPageProps> = ({ user, users, onNavigate, onOpenProfilePreview }) => {
    
    const Row = ({ index, style }: { index: number, style: React.CSSProperties }) => {
        const notification = user.notifications[index];
        return (
            <div style={style}>
                <NotificationItem notification={notification} allUsers={users} onNavigate={onNavigate} onOpenProfilePreview={onOpenProfilePreview} />
            </div>
        );
    };

    return (
        <div>
            <div className="p-4 border-b border-stone-200 dark:border-dark-border sticky top-0 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-sm z-10">
                <h1 className="text-xl font-bold">通知</h1>
            </div>
            {user.notifications.length === 0 ? (
                <p className="text-center text-dark-secondary-text p-8">這裡還沒有任何通知。</p>
            ) : (
                <List
                    height={window.innerHeight - 100} // Approximate height
                    itemCount={user.notifications.length}
                    itemSize={120} // Estimate
                    width="100%"
                >
                    {Row}
                </List>
            )}
        </div>
    );
};

export default NotificationsPage;