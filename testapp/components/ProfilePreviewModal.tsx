
import React, { useEffect, useState } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';
import Loader from './Loader';
import MetricDisplay from './MetricDisplay';
import { AppView } from '../App';

interface ProfilePreviewModalProps {
    userId: string;
    currentUser: User;
    onClose: () => void;
    onNavigate: (view: AppView, payload?: any) => void;
}

const ProfilePreviewModal: React.FC<ProfilePreviewModalProps> = ({ userId, currentUser, onClose, onNavigate }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        const users = authService.getUsers();
        setUser(users[userId] || null);
    }, [userId]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 300);
    };
    
    const handleNavigateToProfile = () => {
        if (currentUser.id === userId) {
            onNavigate('profile');
        } else {
            // This is a placeholder for future functionality where you might view another user's profile
            // For now, we'll just navigate to the current user's profile page as an example
            onNavigate('profile', { profileUserId: userId });
        }
        handleClose();
    }

    const isSelf = currentUser.id === userId;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 sm:p-0"
            onClick={handleClose}
        >
            <div
                className={`
                    bg-white dark:bg-dark-surface rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-md
                    absolute bottom-0 sm:relative 
                    transition-transform duration-300 ease-out
                    ${isClosing ? 'translate-y-full sm:translate-y-0 sm:scale-95' : 'translate-y-0 sm:scale-100'}
                    ${!isClosing && 'animate-slide-in-bottom sm:animate-fade-in-up'}
                `}
                onClick={(e) => e.stopPropagation()}
            >
                {!user ? <Loader /> : (
                    <div>
                        <div className="h-24 bg-sky-300 dark:bg-sky-800 rounded-t-2xl sm:rounded-t-lg"></div>
                        <div className="p-4 -mt-16">
                            <div className="flex justify-between items-end">
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-28 h-28 rounded-full border-4 border-white dark:border-dark-surface"
                                />
                                <div className="flex space-x-2">
                                    {isSelf ? (
                                        <button onClick={() => { onNavigate('profile'); handleClose();}} className="bg-sky-600 text-white font-bold px-4 py-1.5 rounded-full text-sm">編輯檔案</button>
                                    ) : (
                                        <>
                                            <button onClick={() => alert('追蹤功能開發中')} className="bg-dark-primary-text text-dark-background font-bold px-4 py-1.5 rounded-full text-sm">追蹤</button>
                                            <button onClick={handleNavigateToProfile} className="border border-dark-border text-dark-primary-text font-bold px-4 py-1.5 rounded-full text-sm">查看</button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="mt-2">
                                <h3 className="text-xl font-bold">{user.name}</h3>
                                <p className="text-sm text-dark-secondary-text">{user.id}</p>
                            </div>
                            <p className="mt-4 text-sm">{user.bio || '這位用戶很低調。'}</p>
                            <div className="mt-4 space-y-2">
                                <MetricDisplay metric={user.metrics.trust} name="信任" mode="public" />
                                <MetricDisplay metric={user.metrics.depth} name="深度" mode="public" />
                                <MetricDisplay metric={user.metrics.contribution} name="貢獻" mode="public" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePreviewModal;