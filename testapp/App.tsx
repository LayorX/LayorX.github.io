
import React, { useState, useCallback, useEffect } from 'react';
import { FixedSizeList as List } from 'react-window';
import { User, Planet, Argument, Comment, Rating } from './types';
import { authService } from './services/authService';
import { dataService } from './services/dataService';
import { geminiService } from './services/geminiService';
import { themeService } from './services/themeService';
import Auth from './components/Auth';
import AnalysisModal from './components/AnalysisModal';
import ReportModal from './components/ReportModal';
import Loader from './components/Loader';
import ContentCard from './components/ContentCard';
import RatingMenu from './components/RatingMenu';
import ProfilePage from './components/ProfilePage';
import LeftSidebar from './components/layout/LeftSidebar';
import RightSidebar from './components/layout/RightSidebar';
import BottomNavBar from './components/layout/BottomNavBar';
import DevPanel from './components/DevPanel';
import SearchPage from './components/SearchPage';
import NotificationsPage from './components/notifications/NotificationsPage';
import ProfilePreviewModal from './components/ProfilePreviewModal';
import { AiSparkleIcon } from './components/icons';

export type AppView = 'home' | 'planet' | 'profile' | 'contentDetail' | 'explore' | 'search' | 'notifications';
type ViewPayload = {
  planetId?: string;
  contentId?: string;
  contentType?: 'argument' | 'comment';
  profileUserId?: string;
}

const PlanetCard: React.FC<{ planet: Planet; onSelect: (id: string) => void }> = ({ planet, onSelect }) => (
    <button onClick={() => onSelect(planet.id)} className="bg-white dark:bg-dark-surface rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-4 w-full text-left flex items-start space-x-4 border border-stone-200 dark:border-dark-border">
        <div className="text-4xl mt-1">{planet.icon}</div>
        <div className="flex-1">
            <h4 className="font-bold text-stone-800 dark:text-dark-primary-text">{planet.title}</h4>
            <div className="flex items-center text-sm text-stone-500 dark:text-dark-secondary-text mt-2 flex-wrap gap-2">
                <span className={`${planet.categoryColor} px-2 py-0.5 rounded-full text-xs font-medium`}>{planet.category}</span>
                <span className="text-xs">🔥 熱度: {planet.hotness} {planet.isControversial && '(高爭議)'}</span>
            </div>
        </div>
    </button>
);

const Form: React.FC<{
    onSubmit: (text: string) => void;
    currentUser: User;
    placeholder: string;
    submitLabel: string;
}> = ({ onSubmit, currentUser, placeholder, submitLabel }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSubmit(text);
        setText('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-start space-x-3 p-4 bg-stone-50 dark:bg-dark-surface border-t border-stone-200 dark:border-dark-border">
            <img src={currentUser.avatar} alt="Your avatar" className="w-10 h-10 rounded-full"/>
            <div className="flex-1">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={placeholder}
                    className="w-full p-2 text-sm bg-white dark:bg-dark-background border border-stone-200 dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    rows={3}
                />
                <button type="submit" className="mt-2 px-4 py-1.5 text-sm font-bold text-white bg-sky-600 rounded-full hover:bg-sky-700 transition-colors">
                    {submitLabel}
                </button>
            </div>
        </form>
    );
};

type RatingMenuState = {
    isOpen: boolean;
    target: { planetId: string, contentId: string, contentType: 'argument' | 'comment' } | null;
    position: { x: number, y: number };
}

type ReportModalState = {
    isOpen: boolean;
    target: { planetId: string, contentId: string, contentType: 'argument' | 'comment' } | null;
}

type AnalysisState = {
    isOpen: boolean;
    isLoading: boolean;
    content: string;
}

type ProfilePreviewState = {
    isOpen: boolean;
    userId: string | null;
}

function App() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<Record<string, User>>({});
    const [planets, setPlanets] = useState<Planet[]>([]);
    const [view, setView] = useState<AppView>('home');
    const [viewPayload, setViewPayload] = useState<ViewPayload | undefined>();
    const [appIsLoading, setAppIsLoading] = useState(true);
    const [devPanelOpen, setDevPanelOpen] = useState(false);

    const [ratingMenuState, setRatingMenuState] = useState<RatingMenuState>({ isOpen: false, target: null, position: { x: 0, y: 0 } });
    const [reportModalState, setReportModalState] = useState<ReportModalState>({ isOpen: false, target: null });
    const [analysisState, setAnalysisState] = useState<AnalysisState>({isOpen: false, isLoading: false, content: ''});
    const [profilePreview, setProfilePreview] = useState<ProfilePreviewState>({isOpen: false, userId: null});
    const [aiSummary, setAiSummary] = useState<{ [planetId: string]: string }>({});
    
    const unreadNotificationsCount = currentUser?.notifications.filter(n => !n.read).length || 0;

    const handleContentMutation = (updatedPlanets?: Planet[]) => {
        setPlanets(updatedPlanets || dataService.getPlanets());
        const loggedInUser = authService.getCurrentUser();
        if (loggedInUser) {
            setCurrentUser(loggedInUser);
        }
        setUsers(authService.getUsers());
    }

    useEffect(() => {
        themeService.initTheme();
        handleContentMutation();
        setAppIsLoading(false);
        
        // Developer mode hotkey
        let keySequence: string[] = [];
        const onKeyDown = (e: KeyboardEvent) => {
            keySequence.push(e.key);
            keySequence = keySequence.slice(-3);
            if (keySequence.join('') === 'ddd') {
                setDevPanelOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    const handleLoginSuccess = useCallback((user: User) => {
        handleContentMutation();
        setView('home');
    }, []);

    const handleLogout = useCallback(() => {
        authService.logout();
        setCurrentUser(null);
        setView('home');
        setViewPayload(undefined);
    }, []);
    
    const handleMarkNotificationsRead = useCallback(() => {
        if(!currentUser || unreadNotificationsCount === 0) return;
        const updatedUser = dataService.markNotificationsAsRead(currentUser.id);
        if (updatedUser) setCurrentUser(updatedUser);
    }, [currentUser, unreadNotificationsCount]);

    const handleNavigation = useCallback((targetView: AppView, payload?: ViewPayload) => {
        if (targetView === 'notifications') {
            handleMarkNotificationsRead();
        }
        setView(targetView);
        setViewPayload(payload);
        window.scrollTo(0, 0);
    }, [handleMarkNotificationsRead]);
    
    const onEditContent = (planetId: string, contentId: string, newText: string, contentType: 'argument' | 'comment') => {
        const updated = (contentType === 'argument' ? dataService.editArgument(planetId, contentId, newText) : dataService.editComment(planetId, contentId, newText));
        handleContentMutation(updated);
    }
    const onDeleteContent = (planetId: string, contentId: string, contentType: 'argument' | 'comment') => {
        const updated = (contentType === 'argument' ? dataService.deleteArgument(planetId, contentId) : dataService.deleteComment(planetId, contentId));
        handleContentMutation(updated);
    }
    const onRateContent = (rating: Omit<Rating, 'byUserId'>) => {
        if (!ratingMenuState.target || !currentUser) return;
        const { planetId, contentId } = ratingMenuState.target;
        const updated = dataService.rateContent(planetId, contentId, rating, currentUser.id);
        handleContentMutation(updated);
    };
    const onRemoveRating = (planetId: string, contentId: string) => {
        if (!currentUser) return;
        const updated = dataService.removeRating(planetId, contentId, currentUser.id);
        handleContentMutation(updated);
    };
    const onReportContent = (planetId: string, contentId: string, contentType: 'argument' | 'comment') => {
        setReportModalState({ isOpen: true, target: { planetId, contentId, contentType } });
    };
    const handleReportSubmit = (reason: string, notes: string) => {
        if (!reportModalState.target || !currentUser) return;
        const { planetId, contentId } = reportModalState.target;
        dataService.reportContent(planetId, contentId, reason, notes, currentUser.id);
        handleContentMutation();
        setReportModalState({ isOpen: false, target: null });
        alert('感謝您的舉報，我們將會審查此內容。');
    };
    
    const handleOpenRatingMenu = (event: React.MouseEvent | React.TouchEvent, target: { planetId: string, contentId: string, contentType: 'argument' | 'comment' }) => {
        const getXY = (e: React.MouseEvent | React.TouchEvent) => 'touches' in e ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY };
        const { x, y } = getXY(event);
        if ('vibrate' in navigator) navigator.vibrate(50);
        setRatingMenuState({ isOpen: true, target, position: { x, y } });
    };

    const handleAnalyze = async (text: string) => {
        setAnalysisState({isOpen: true, isLoading: true, content: ''});
        const result = await geminiService.analyzeArgument(text);
        setAnalysisState({isOpen: true, isLoading: false, content: result});
    }

    const handleGenerateSummary = async (planetId: string, title: string) => {
        if (aiSummary[planetId] && !aiSummary[planetId]?.includes("生成中")) return;
        setAiSummary(prev => ({...prev, [planetId]: "AI 摘要生成中..."}));
        const result = await geminiService.generateSummary(title);
        setAiSummary(prev => ({...prev, [planetId]: result}));
    }

    const handleOpenProfilePreview = (userId: string) => {
        setProfilePreview({ isOpen: true, userId });
    }
    
    const renderHomePage = () => {
        return (
            <div className="p-2 sm:p-4 space-y-2 sm:space-y-4">
                {planets.map(planet => (
                    <PlanetCard key={planet.id} planet={planet} onSelect={(id) => handleNavigation('planet', { planetId: id })} />
                ))}
            </div>
        );
    };

    const renderPlanetPage = () => {
        if (!viewPayload?.planetId) return <div>找不到星球</div>;
        const planet = planets.find(p => p.id === viewPayload.planetId);
        if (!planet) return <div>找不到星球</div>;

        const handleAddArgument = (type: 'pro' | 'con') => (text: string) => {
            if (!currentUser) return;
            const updated = dataService.addArgument(planet.id, { authorId: currentUser.id, type, text, evidence: '' });
            handleContentMutation(updated);
        }
        const handleAddComment = (text: string) => {
            if (!currentUser) return;
            const updated = dataService.addComment(planet.id, { authorId: currentUser.id, text });
            handleContentMutation(updated);
        }
        
        const proArgs = planet.arguments.filter(a => a.type === 'pro');
        const conArgs = planet.arguments.filter(a => a.type === 'con');
        const mainComments = planet.comments.filter(c => !c.parentId);

        return (
            <div>
                 <div className="p-4 bg-white dark:bg-dark-surface border-b border-stone-200 dark:border-dark-border sticky top-0 z-10">
                    <button onClick={() => handleNavigation('home')} className="text-sm text-sky-600 dark:text-dark-primary font-bold mb-2">← 返回星球牆</button>
                    <h2 className="text-xl font-bold">{planet.title}</h2>
                    <p className="text-sm text-stone-600 dark:text-dark-secondary-text mt-1">{planet.neutralDescription}</p>
                    <button onClick={() => handleGenerateSummary(planet.id, planet.title)} className="w-full text-left bg-sky-100 dark:bg-sky-900/50 text-sky-800 dark:text-sky-300 p-2 rounded-lg hover:bg-sky-200 dark:hover:bg-sky-900 transition flex items-center justify-center mt-3 text-sm">
                        <AiSparkleIcon className="w-5 h-5 mr-2" />
                        <span>{aiSummary[planet.id] && !aiSummary[planet.id].includes("生成中") ? "顯示 AI 生成摘要" : "AI 生成中立摘要"}</span>
                    </button>
                    {aiSummary[planet.id] && <div className="mt-2 text-sm text-stone-600 dark:text-dark-secondary-text bg-stone-50 dark:bg-dark-background p-3 rounded-lg">{aiSummary[planet.id]}</div>}
                </div>
                <div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20"><h3 className="font-bold text-green-800 dark:text-green-300">正方論述</h3></div>
                    {proArgs.map(arg => <ContentCard key={arg.id} planetId={planet.id} content={arg} author={users[arg.authorId]} currentUser={currentUser!} onEdit={onEditContent} onDelete={onDeleteContent} onReport={onReportContent} onRemoveRating={onRemoveRating} onOpenRatingMenu={handleOpenRatingMenu} onAnalyze={handleAnalyze} onNavigateToDetail={(pId, cId, cType) => handleNavigation('contentDetail', { planetId: pId, contentId: cId, contentType: cType })} onOpenProfilePreview={handleOpenProfilePreview} />)}
                    <Form onSubmit={handleAddArgument('pro')} currentUser={currentUser!} placeholder="發表你的正方論點..." submitLabel="發表正方論點" />
                    
                    <div className="p-4 bg-red-50 dark:bg-red-900/20"><h3 className="font-bold text-red-800 dark:text-red-300">反方論述</h3></div>
                    {conArgs.map(arg => <ContentCard key={arg.id} planetId={planet.id} content={arg} author={users[arg.authorId]} currentUser={currentUser!} onEdit={onEditContent} onDelete={onDeleteContent} onReport={onReportContent} onRemoveRating={onRemoveRating} onOpenRatingMenu={handleOpenRatingMenu} onAnalyze={handleAnalyze} onNavigateToDetail={(pId, cId, cType) => handleNavigation('contentDetail', { planetId: pId, contentId: cId, contentType: cType })} onOpenProfilePreview={handleOpenProfilePreview} />)}
                    <Form onSubmit={handleAddArgument('con')} currentUser={currentUser!} placeholder="發表你的反方論點..." submitLabel="發表反方論點" />
                    
                    <div className="p-4 bg-stone-100 dark:bg-dark-surface/50"><h3 className="font-bold text-stone-800 dark:text-stone-300">一般討論</h3></div>
                    {mainComments.map(com => <ContentCard key={com.id} planetId={planet.id} content={com} author={users[com.authorId]} currentUser={currentUser!} onEdit={onEditContent} onDelete={onDeleteContent} onReport={onReportContent} onRemoveRating={onRemoveRating} onOpenRatingMenu={handleOpenRatingMenu} onAnalyze={handleAnalyze} onNavigateToDetail={(pId, cId, cType) => handleNavigation('contentDetail', { planetId: pId, contentId: cId, contentType: cType })} onOpenProfilePreview={handleOpenProfilePreview} />)}
                    <Form onSubmit={handleAddComment} currentUser={currentUser!} placeholder="發表你的留言..." submitLabel="送出留言" />
                </div>
            </div>
        )
    };
    
    const renderContentDetail = () => {
         if (!viewPayload?.planetId || !viewPayload?.contentId) return <div>內容不存在</div>;
         const { planetId, contentId, contentType } = viewPayload;
         const planet = planets.find(p => p.id === planetId);
         if(!planet) return <div>內容不存在</div>;

         const contentList = contentType === 'argument' ? planet.arguments : planet.comments;
         const mainContent = contentList.find(c => c.id === contentId);
         if(!mainContent) return <div>內容不存在</div>;

         const author = users[mainContent.authorId];
         const replies = dataService.getRepliesForContent(planetId, contentId);
         
         const handleAddReply = (text: string) => {
             if(!currentUser) return;
             const updated = dataService.addComment(planetId, {authorId: currentUser.id, text, parentId: contentId});
             handleContentMutation(updated);
         }
         
         const Row = ({ index, style }: { index: number, style: React.CSSProperties }) => {
            const reply = replies[index];
            const replyAuthor = users[reply.authorId];
            if (!replyAuthor) return null;
            return (
                <div style={style}>
                    <ContentCard
                        planetId={planetId}
                        content={reply}
                        author={replyAuthor}
                        currentUser={currentUser!}
                        onEdit={onEditContent}
                        onDelete={onDeleteContent}
                        onReport={onReportContent}
                        onRemoveRating={onRemoveRating}
                        onOpenRatingMenu={handleOpenRatingMenu}
                        onAnalyze={handleAnalyze}
                        onNavigateToDetail={(pId, cId, cType) => handleNavigation('contentDetail', { planetId: pId, contentId: cId, contentType: cType })}
                        onOpenProfilePreview={handleOpenProfilePreview}
                    />
                </div>
            );
         };

         return (
             <div>
                 <div className="p-4 border-b border-stone-200 dark:border-dark-border sticky top-0 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-sm z-10">
                    <button onClick={() => handleNavigation('planet', { planetId })} className="text-sm text-sky-600 dark:text-dark-primary font-bold">← 返回 {planet.title}</button>
                </div>
                <div className="border-b border-stone-200 dark:border-dark-border bg-stone-50 dark:bg-dark-surface/30">
                    <ContentCard
                        planetId={planetId}
                        content={mainContent}
                        author={author}
                        currentUser={currentUser!}
                        onEdit={onEditContent}
                        onDelete={onDeleteContent}
                        onReport={onReportContent}
                        onRemoveRating={onRemoveRating}
                        onOpenRatingMenu={handleOpenRatingMenu}
                        onAnalyze={handleAnalyze}
                        onNavigateToDetail={() => {}}
                        onOpenProfilePreview={handleOpenProfilePreview}
                        isDetailView={true}
                    />
                </div>
                 <h3 className="p-4 font-bold text-lg border-b border-stone-200 dark:border-dark-border">回覆 ({replies.length})</h3>
                 <div className="pl-4 sm:pl-8">
                     <List
                        height={Math.min(5, replies.length) * 150} // Approximate height
                        itemCount={replies.length}
                        itemSize={150} // Estimate
                        width="100%"
                     >
                         {Row}
                     </List>
                 </div>
                 <Form onSubmit={handleAddReply} currentUser={currentUser!} placeholder="發表你的回覆..." submitLabel="回覆" />
             </div>
         )
    }

    const renderExplorePage = () => {
        const groupedPlanets = planets.reduce((acc, planet) => {
            (acc[planet.category] = acc[planet.category] || []).push(planet);
            return acc;
        }, {} as Record<string, Planet[]>);

        return (
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">探索所有星球</h1>
                {Object.entries(groupedPlanets).map(([category, catPlanets]) => (
                    <div key={category} className="mb-6">
                        <h2 className="text-xl font-semibold mb-3">{category}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {catPlanets.map(p => <PlanetCard key={p.id} planet={p} onSelect={id => handleNavigation('planet', { planetId: id })} />)}
                        </div>
                    </div>
                ))}
            </div>
        );
    }
    
    const renderNotifications = () => {
        if(!currentUser) return null;
        return <NotificationsPage user={currentUser} users={users} onNavigate={handleNavigation} onOpenProfilePreview={handleOpenProfilePreview} />
    }

    const renderMainContent = () => {
        switch (view) {
            case 'planet': return renderPlanetPage();
            case 'profile': return <ProfilePage user={currentUser!} onNavigate={handleNavigation} onUpdateUser={setCurrentUser} onOpenProfilePreview={handleOpenProfilePreview} />;
            case 'contentDetail': return renderContentDetail();
            case 'explore': return renderExplorePage();
            case 'search': return <SearchPage planets={planets} users={users} onNavigate={handleNavigation} onOpenProfilePreview={handleOpenProfilePreview} currentUser={currentUser!} />;
            case 'notifications': return renderNotifications();
            case 'home':
            default: return renderHomePage();
        }
    }

    if (appIsLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-background"><Loader text="應用程式載入中..." /></div>;
    }

    if (!currentUser) {
        return <Auth onLoginSuccess={handleLoginSuccess} />;
    }
    
    const interactionStatus = ratingMenuState.target ? currentUser.ratedContent[ratingMenuState.target.contentId] || false : false;

    return (
        <div className="min-h-screen bg-stone-100 dark:bg-dark-background pb-16 lg:pb-0">
            <div className="container mx-auto flex">
                <LeftSidebar user={currentUser} onNavigate={handleNavigation} onLogout={handleLogout} activeView={view} unreadCount={unreadNotificationsCount} />

                <main className="w-full lg:w-[600px] border-l border-r border-stone-200 dark:border-dark-border min-h-screen bg-white dark:bg-dark-surface">
                    {renderMainContent()}
                </main>

                <RightSidebar planets={planets} onSelectPlanet={(id) => handleNavigation('planet', { planetId: id })} onOpenProfilePreview={handleOpenProfilePreview} />
            </div>
            
            <BottomNavBar onNavigate={handleNavigation} activeView={view} unreadCount={unreadNotificationsCount} />

            <RatingMenu 
                isOpen={ratingMenuState.isOpen}
                isInteractionLocked={interactionStatus}
                position={ratingMenuState.position} 
                onClose={() => setRatingMenuState({ ...ratingMenuState, isOpen: false })} 
                onRate={onRateContent} 
            />
            <ReportModal
                isOpen={reportModalState.isOpen}
                onClose={() => setReportModalState({isOpen: false, target: null})}
                onSubmit={handleReportSubmit}
            />
            <AnalysisModal
                isOpen={analysisState.isOpen}
                isLoading={analysisState.isLoading}
                content={analysisState.content}
                onClose={() => setAnalysisState({isOpen: false, isLoading: false, content: ''})}
            />
            {profilePreview.isOpen && profilePreview.userId && (
                <ProfilePreviewModal 
                    userId={profilePreview.userId}
                    currentUser={currentUser}
                    onClose={() => setProfilePreview({isOpen: false, userId: null})}
                    onNavigate={handleNavigation}
                />
            )}
            {devPanelOpen && <DevPanel user={currentUser} onUpdate={setCurrentUser} />}
        </div>
    );
}

export default App;