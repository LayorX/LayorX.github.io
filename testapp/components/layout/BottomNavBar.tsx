
import React from 'react';
import { HomeIcon, UserIcon, PlanetIcon, SearchIcon } from '../icons';
import { AppView } from '../../App';
import NotificationBell from '../notifications/NotificationBell';

interface BottomNavBarProps {
    onNavigate: (view: AppView) => void;
    activeView: AppView;
    unreadCount: number;
}

const NavButton: React.FC<{
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, isActive, onClick }) => (
    <button onClick={onClick} className={`flex-1 flex justify-center items-center p-2 rounded-full transition-colors ${isActive ? 'text-dark-primary' : 'text-dark-secondary-text'} hover:bg-dark-surface`}>
        {icon}
    </button>
);

const BottomNavBar: React.FC<BottomNavBarProps> = ({ onNavigate, activeView, unreadCount }) => {
    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-dark-background/80 backdrop-blur-md border-t border-stone-200 dark:border-dark-border z-40">
            <div className="flex justify-around items-center h-16">
                <NavButton
                    icon={<HomeIcon className="w-7 h-7" />}
                    isActive={activeView === 'home' || activeView === 'planet' || activeView === 'contentDetail'}
                    onClick={() => onNavigate('home')}
                />
                 <NavButton
                    icon={<PlanetIcon className="w-7 h-7" />}
                    isActive={activeView === 'explore'}
                    onClick={() => onNavigate('explore')}
                />
                <NavButton
                    icon={<SearchIcon className="w-7 h-7" />}
                    isActive={activeView === 'search'}
                    onClick={() => onNavigate('search')}
                />
                <NavButton
                    icon={<NotificationBell hasUnread={unreadCount > 0} />}
                    isActive={activeView === 'notifications'}
                    onClick={() => onNavigate('notifications')}
                />
                <NavButton
                    icon={<UserIcon className="w-7 h-7" />}
                    isActive={activeView === 'profile'}
                    onClick={() => onNavigate('profile')}
                />
            </div>
        </nav>
    );
};

export default BottomNavBar;