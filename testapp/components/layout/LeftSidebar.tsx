
import React from 'react';
import { User } from '../../types';
import { HomeIcon, UserIcon, LogoutIcon, SearchIcon } from '../icons';
import NotificationBell from '../notifications/NotificationBell';
import { AppView } from '../../App'; // Import AppView type

interface LeftSidebarProps {
    user: User;
    onNavigate: (view: AppView) => void;
    onLogout: () => void;
    activeView: AppView;
    unreadCount: number;
}

const NavButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button onClick={onClick} className="flex items-center w-full p-3 rounded-full hover:bg-stone-200 dark:hover:bg-dark-surface transition-colors group">
        <div className={`w-7 h-7 ${isActive ? 'text-dark-primary-text' : 'text-dark-secondary-text'} group-hover:text-dark-primary-text`}>{icon}</div>
        <span className={`ml-4 text-xl ${isActive ? 'font-bold' : 'font-normal'}`}>{label}</span>
    </button>
);

const LeftSidebar: React.FC<LeftSidebarProps> = ({ user, onNavigate, onLogout, activeView, unreadCount }) => {
    return (
        <aside className="hidden lg:flex flex-col w-64 xl:w-72 p-2 h-screen sticky top-0">
            <div className="flex-1">
                <div className="p-2 mb-4">
                    <h1 className="text-2xl font-bold text-dark-primary">理性社群</h1>
                </div>
                <nav className="space-y-2">
                    <NavButton
                        icon={<HomeIcon />}
                        label="首頁"
                        isActive={activeView === 'home' || activeView === 'planet' || activeView === 'contentDetail' || activeView === 'explore'}
                        onClick={() => onNavigate('home')}
                    />
                     <NavButton
                        icon={<SearchIcon />}
                        label="搜尋"
                        isActive={activeView === 'search'}
                        onClick={() => onNavigate('search')}
                    />
                    <NavButton
                        icon={<NotificationBell hasUnread={unreadCount > 0} />}
                        label="通知"
                        isActive={activeView === 'notifications'}
                        onClick={() => onNavigate('notifications')}
                    />
                    <NavButton
                        icon={<UserIcon />}
                        label="個人資料"
                        isActive={activeView === 'profile'}
                        onClick={() => onNavigate('profile')}
                    />
                </nav>
            </div>
            <div className="p-2">
                 <button onClick={onLogout} className="flex items-center w-full p-3 rounded-full hover:bg-stone-200 dark:hover:bg-dark-surface transition-colors group">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                    <div className="ml-3 flex-1 text-left">
                        <div className="font-bold text-sm">{user.name}</div>
                        <div className="text-xs text-dark-secondary-text">登出</div>
                    </div>
                    <LogoutIcon className="w-6 h-6 text-dark-secondary-text" />
                </button>
            </div>
        </aside>
    );
};

export default LeftSidebar;