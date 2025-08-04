import React from 'react';
import { Planet, User } from '../../types';
import { authService } from '../../services/authService';

interface RightSidebarProps {
    planets: Planet[];
    onSelectPlanet: (id: string) => void;
    onOpenProfilePreview: (userId: string) => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ planets, onSelectPlanet, onOpenProfilePreview }) => {
    const users = Object.values(authService.getUsers()).slice(0, 3);

    return (
        <aside className="hidden lg:block w-80 xl:w-96 p-4 h-screen sticky top-0">
            <div className="space-y-4">
                <div className="bg-stone-100 dark:bg-dark-surface rounded-xl p-4">
                    <h3 className="font-bold text-xl mb-4">探索星球</h3>
                    <div className="space-y-3">
                        {planets.slice(0, 3).map(planet => (
                            <button key={planet.id} onClick={() => onSelectPlanet(planet.id)} className="flex items-center w-full text-left group">
                                <div className="text-2xl mr-3">{planet.icon}</div>
                                <div className="flex-1">
                                    <p className="font-bold text-sm group-hover:underline">{planet.title}</p>
                                    <p className="text-xs text-dark-secondary-text">{planet.category}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
                
                 <div className="bg-stone-100 dark:bg-dark-surface rounded-xl p-4">
                    <h3 className="font-bold text-xl mb-4">建議用戶</h3>
                     <div className="space-y-3">
                        {users.map(user => (
                            <div key={user.id} className="flex items-center w-full">
                                <button onClick={() => onOpenProfilePreview(user.id)} className="flex items-center text-left group flex-1">
                                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mr-3" />
                                    <div className="flex-1">
                                        <p className="font-bold text-sm group-hover:underline">{user.name}</p>
                                        <p className="text-xs text-dark-secondary-text">ID: {user.id}</p>
                                    </div>
                                </button>
                                <button className="bg-dark-primary-text text-dark-background text-sm font-bold px-4 py-1.5 rounded-full ml-2 flex-shrink-0">關注</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default RightSidebar;