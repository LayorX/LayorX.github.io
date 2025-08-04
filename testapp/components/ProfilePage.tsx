
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { User } from '../types';
import { dataService } from '../services/dataService';
import { themeService } from '../services/themeService';
import MetricDisplay from './MetricDisplay';
import ContentCard from './ContentCard';
import Loader from './Loader';
import { ActivityIcon, SettingsIcon, SunIcon, MoonIcon, TrustIcon, DepthIcon, ContributionIcon, PinIcon, EditIcon } from './icons';
import { authService } from '../services/authService';
import MetricHistoryDisplay from './MetricHistoryDisplay';

type ProfileTab = 'profile' | 'activity' | 'history' | 'settings';

interface ProfilePageProps {
  user: User;
  onNavigate: (view: 'home' | 'planet' | 'profile' | 'contentDetail' | 'search' | 'notifications', payload?: any) => void;
  onUpdateUser: (user: User) => void;
  onOpenProfilePreview: (userId: string) => void;
}

const ThemeToggle: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState(themeService.isDark());

    const handleToggle = () => {
        themeService.toggleTheme();
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div className="flex items-center justify-between p-4 bg-stone-100 dark:bg-dark-background rounded-lg">
            <div className="flex items-center">
                {isDarkMode ? <MoonIcon className="w-5 h-5 mr-3 text-yellow-300" /> : <SunIcon className="w-5 h-5 mr-3 text-orange-500" />}
                <span className="font-semibold">{isDarkMode ? '夜間模式' : '日間模式'}</span>
            </div>
            <button
                onClick={handleToggle}
                className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors bg-stone-200 dark:bg-stone-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
                <span className={`${isDarkMode ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                />
            </button>
        </div>
    )
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onNavigate, onUpdateUser, onOpenProfilePreview }) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('profile');
  const [activity, setActivity] = useState<Array<{ planetId: string; content: any }>>([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(false);
  const [allUsers, setAllUsers] = useState<Record<string, User>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState(user.bio);
  const [selectedPin, setSelectedPin] = useState<string | undefined>(user.pinnedContentId);

  const pinnedContentData = useMemo(() => {
    if (!user.pinnedContentId) return null;
    const content = dataService.getContentByAuthorId(user.id).find(item => item.content.id === user.pinnedContentId);
    return content;
  }, [user.id, user.pinnedContentId]);

  useEffect(() => {
    setAllUsers(authService.getUsers());
    const userActivity = dataService.getContentByAuthorId(user.id);
    setActivity(userActivity);
  }, [user.id]);
  
  const handleSaveProfile = () => {
      const updatedUser = authService.updateUserProfile(user.id, {bio: editBio, pinnedContentId: selectedPin });
      onUpdateUser(updatedUser);
      setIsEditing(false);
  }

  const ActivityRow = ({ index, style }: { index: number, style: React.CSSProperties }) => {
    const { planetId, content } = activity[index];
    const author = allUsers[content.authorId];
    if (!author) return null;
    return (
        <div style={style}>
            <ContentCard
                key={content.id}
                planetId={planetId}
                content={content}
                author={author}
                currentUser={user}
                onAnalyze={() => {}}
                onDelete={() => {}}
                onEdit={() => {}}
                onReport={() => {}}
                onRemoveRating={() => {}}
                onOpenRatingMenu={() => {}}
                onNavigateToDetail={(pId, cId, cType) => onNavigate('contentDetail', { planetId: pId, contentId: cId, contentType: cType })}
                onOpenProfilePreview={onOpenProfilePreview}
            />
        </div>
    );
  };
  
  const TABS: { id: ProfileTab, label: string, icon: React.ReactNode }[] = [
      { id: 'profile', label: '個人資料', icon: <img src={user.avatar} className="w-5 h-5 rounded-full" /> },
      { id: 'activity', label: '我的活動', icon: <ActivityIcon className="w-5 h-5" /> },
      { id: 'history', label: '數值紀錄', icon: <TrustIcon className="w-5 h-5" /> },
      { id: 'settings', label: '設定', icon: <SettingsIcon className="w-5 h-5" /> },
  ]
  
  const tabClass = (tabId: ProfileTab) => 
    `flex-1 sm:flex-none sm:px-6 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors border-b-2 ${
        activeTab === tabId
        ? 'border-dark-primary text-dark-primary'
        : 'border-transparent text-dark-secondary-text hover:text-dark-primary-text hover:border-stone-300 dark:hover:border-dark-border'
    }`;


  return (
    <div className="w-full">
      {/* Profile Header */}
      <div className="bg-white dark:bg-dark-surface p-6 border-b border-stone-200 dark:border-dark-border">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full border-4 border-sky-300 dark:border-dark-primary shadow-lg"/>
            <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-stone-500 dark:text-dark-secondary-text mt-1">{user.bio || '這位用戶很低調，還沒有個人簡介。'}</p>
            </div>
            <button onClick={() => setIsEditing(true)} className="bg-sky-600 text-white px-4 py-1.5 rounded-full text-sm font-bold hover:bg-sky-700">編輯個人檔案</button>
        </div>
         {pinnedContentData && (
            <div className="mt-4">
                <h3 className="font-bold text-sm text-dark-secondary-text mb-2 flex items-center"><PinIcon className="w-4 h-4 mr-1" /> 置頂內容</h3>
                <div className="border border-sky-400 rounded-lg overflow-hidden">
                <ContentCard
                    planetId={pinnedContentData.planetId}
                    content={pinnedContentData.content}
                    author={user}
                    currentUser={user}
                    onAnalyze={() => {}}
                    onDelete={() => {}}
                    onEdit={() => {}}
                    onReport={() => {}}
                    onRemoveRating={() => {}}
                    onOpenRatingMenu={() => {}}
                    onNavigateToDetail={(pId, cId, cType) => onNavigate('contentDetail', { planetId: pId, contentId: cId, contentType: cType })}
                    onOpenProfilePreview={onOpenProfilePreview}
                />
                </div>
            </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-dark-surface flex border-b border-stone-200 dark:border-dark-border overflow-x-auto sticky top-0 z-10">
          {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={tabClass(tab.id)}>
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
              </button>
          ))}
      </div>

      {/* Tab Content */}
      <div className="p-2 sm:p-4">
        {activeTab === 'profile' && (
          <div className="space-y-6 bg-white dark:bg-dark-surface p-4 rounded-lg">
            <MetricDisplay metric={user.metrics.contribution} name="貢獻" mode="private" />
            <MetricDisplay metric={user.metrics.trust} name="信任" mode="private" />
            <MetricDisplay metric={user.metrics.depth} name="深度" mode="private" />
          </div>
        )}
        {activeTab === 'activity' && (
          <div>
              {isLoadingActivity ? <div className="flex justify-center mt-8"><Loader text="載入活動中..." /></div> : (
                  activity.length > 0 ? (
                      <List
                          height={1000} // Adjust as needed
                          itemCount={activity.length}
                          itemSize={180} // Estimate; adjust based on avg card height
                          width="100%"
                      >
                          {ActivityRow}
                      </List>
                  ) : (
                      <p className="text-dark-secondary-text text-center mt-8">尚無活動紀錄。</p>
                  )
              )}
          </div>
        )}
        {activeTab === 'history' && (
           <div className="bg-white dark:bg-dark-surface p-4 rounded-lg">
             <h2 className="text-xl font-bold mb-4">數值變動紀錄</h2>
             <MetricHistoryDisplay history={user.metricHistory} />
           </div>
        )}
        {activeTab === 'settings' && (
            <div className="bg-white dark:bg-dark-surface p-4 rounded-lg">
                 <h2 className="text-xl font-bold mb-4">應用程式設定</h2>
                 <div className="space-y-4 max-w-md mx-auto">
                     <ThemeToggle />
                 </div>
            </div>
        )}
      </div>
      
      {/* Edit Profile Modal */}
      {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={() => setIsEditing(false)}>
              <div className="bg-white dark:bg-dark-surface rounded-lg shadow-xl w-full max-w-lg p-6 relative animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                  <h3 className="text-xl font-bold mb-4">編輯個人檔案</h3>
                  <div className="space-y-4">
                      <div>
                          <label className="font-semibold text-sm">個人簡介</label>
                          <textarea value={editBio} onChange={e => setEditBio(e.target.value)} rows={3} className="w-full mt-1 p-2 bg-stone-100 dark:bg-dark-background border border-dark-border rounded-md"></textarea>
                      </div>
                      <div>
                          <label className="font-semibold text-sm">置頂內容</label>
                          <select value={selectedPin || ''} onChange={e => setSelectedPin(e.target.value || undefined)} className="w-full mt-1 p-2 bg-stone-100 dark:bg-dark-background border border-dark-border rounded-md">
                              <option value="">不置頂</option>
                              {activity.map(({content}) => (
                                  <option key={content.id} value={content.id}>{content.text.substring(0, 40)}...</option>
                              ))}
                          </select>
                      </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                      <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-medium rounded-md bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600">取消</button>
                      <button onClick={handleSaveProfile} className="px-4 py-2 text-sm font-medium rounded-md bg-sky-600 text-white hover:bg-sky-700">儲存變更</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default ProfilePage;