
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { User, Argument, Comment, Rating } from '../types';
import { EditIcon, DeleteIcon, MoreIcon, CheckIcon, AiSparkleIcon, ReportIcon, CommentIcon, ShareIcon } from './icons';
import useLongPress from '../hooks/useLongPress';
import MetricDisplay from './MetricDisplay';
import { dataService } from '../services/dataService';

interface ContentCardProps {
    planetId: string;
    content: Argument | Comment;
    author: User;
    currentUser: User;
    onAnalyze: (text: string) => void;
    onOpenRatingMenu: (event: React.MouseEvent | React.TouchEvent, target: { planetId: string, contentId: string, contentType: 'argument' | 'comment' }) => void;
    onDelete: (planetId: string, contentId: string, contentType: 'argument' | 'comment') => void;
    onEdit: (planetId: string, contentId: string, newText: string, contentType: 'argument' | 'comment') => void;
    onReport: (planetId: string, contentId: string, contentType: 'argument' | 'comment') => void;
    onRemoveRating: (planetId: string, contentId: string) => void;
    onNavigateToDetail: (planetId: string, contentId: string, contentType: 'argument' | 'comment') => void;
    onOpenProfilePreview: (userId: string) => void;
    isDetailView?: boolean;
}

const formatTimestamp = (timestamp: number) => {
    const now = new Date();
    const editedDate = new Date(timestamp);
    const diffSeconds = Math.floor((now.getTime() - editedDate.getTime()) / 1000);

    if (diffSeconds < 60) return "剛剛";
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes} 分鐘前`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} 小時前`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} 天前`;
}

const ContentBody: React.FC<{ text: string, isDetailView?: boolean }> = ({ text, isDetailView }) => {
    const [isExpanded, setIsExpanded] = useState(isDetailView || false);
    const textRef = useRef<HTMLParagraphElement>(null);
    const [isClamped, setIsClamped] = useState(false);

    useEffect(() => {
        if (textRef.current) {
            // Check if the text is overflowing its container
            setIsClamped(textRef.current.scrollHeight > textRef.current.clientHeight);
        }
    }, [text]);

    if (isExpanded) {
        return <p className="text-base text-stone-800 dark:text-dark-primary-text my-2 whitespace-pre-wrap">{text}</p>;
    }

    return (
        <div className="relative">
            <p ref={textRef} className="text-base text-stone-800 dark:text-dark-primary-text my-2 whitespace-pre-wrap max-h-48 overflow-hidden">
                {text}
            </p>
            {isClamped && (
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-dark-surface to-transparent flex items-end">
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}
                        className="text-sky-600 dark:text-dark-primary font-semibold text-sm hover:underline"
                    >
                        ...顯示更多
                    </button>
                </div>
            )}
        </div>
    );
};

const ContentFooter: React.FC<{
    planetId: string;
    content: Argument | Comment;
    onNavigateToDetail: () => void;
    onAnalyze: (text: string) => void;
}> = ({ planetId, content, onNavigateToDetail, onAnalyze }) => {
    const replyCount = dataService.getRepliesForContent(planetId, content.id).length;
    
    return (
        <div className="flex justify-between items-center text-dark-secondary-text mt-3 pt-3 border-t border-stone-200 dark:border-dark-border -mx-4 px-4">
            <button onClick={(e) => {e.stopPropagation(); onNavigateToDetail()}} className="flex items-center space-x-2 hover:text-dark-primary">
                <CommentIcon className="w-5 h-5" />
                <span className="text-xs font-semibold">{replyCount > 0 ? replyCount : ''}</span>
            </button>
             <button onClick={(e) => {e.stopPropagation(); alert('分享功能開發中')}} className="flex items-center space-x-2 hover:text-dark-primary">
                <ShareIcon className="w-5 h-5" />
            </button>
            {'type' in content && (
                 <button onClick={(e) => {e.stopPropagation(); onAnalyze(content.text)}} className="flex items-center space-x-2 hover:text-dark-primary">
                    <AiSparkleIcon className="w-5 h-5" />
                </button>
            )}
        </div>
    );
};


const ContentCard: React.FC<ContentCardProps> = ({ planetId, content, author, currentUser, onAnalyze, onOpenRatingMenu, onDelete, onEdit, onReport, onRemoveRating, onNavigateToDetail, onOpenProfilePreview, isDetailView=false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(content.text);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const contentType = 'type' in content ? 'argument' : 'comment';
    const isAuthor = author.id === currentUser.id;
    const interactionStatus = currentUser.ratedContent[content.id];

    const ratingStats = useMemo(() => {
        return content.ratings.reduce((acc, rating) => {
            acc[rating.stance] = (acc[rating.stance] || 0) + 1;
            return acc;
        }, {} as Record<Rating['stance'], number>);
    }, [content.ratings]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    useEffect(() => {
        if(isEditing) {
            setEditText(content.text);
        }
    }, [isEditing, content.text]);

    const handleSaveEdit = () => {
        if (editText.trim() && editText.trim() !== content.text) {
            onEdit(planetId, content.id, editText, contentType);
        }
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (window.confirm('確定要刪除這則內容嗎？此操作無法復原。')) {
            onDelete(planetId, content.id, contentType);
        }
    }
    
    const handleRemoveRating = () => {
        if (window.confirm('確定要移除你的評價嗎？移除後將無法再次評價。')) {
            onRemoveRating(planetId, content.id);
        }
    }
    
    const longPressEvents = useLongPress(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpenRatingMenu(e, { planetId, contentId: content.id, contentType })
        },
        () => {} // No action on short click of the card itself
    );

    const cardBaseStyle = 'bg-white dark:bg-dark-surface p-4 transition-colors duration-200';
    const cardBorderStyle = 'border-b border-stone-200 dark:border-dark-border';
    const argumentBorderStyle = 'type' in content
        ? `border-l-4 ${content.type === 'pro' ? 'border-green-500' : 'border-red-500'}`
        : '';
        
    const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();
    
    const canInteractWithRating = !interactionStatus;

    return (
        <article {...longPressEvents} className={`${cardBaseStyle} ${cardBorderStyle} ${argumentBorderStyle}`}>
             <div className="flex items-start space-x-3" >
                <button onClick={() => onOpenProfilePreview(author.id)} className="flex-shrink-0">
                    <img src={author.avatar} alt={author.name} className="w-10 h-10 rounded-full" />
                </button>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <button className="text-left" onClick={() => onOpenProfilePreview(author.id)}>
                            <span className="font-bold text-sm text-stone-800 dark:text-dark-primary-text">{author.name}</span>
                            <div className="flex space-x-2 mt-0.5">
                                <MetricDisplay metric={author.metrics.trust} name="信" mode="public"/>
                                <MetricDisplay metric={author.metrics.depth} name="深" mode="public"/>
                                <MetricDisplay metric={author.metrics.contribution} name="貢" mode="public"/>
                            </div>
                        </button>
                         <div className="relative" onClick={stopPropagation} ref={menuRef}>
                           <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-dark-secondary-text hover:text-dark-primary p-1 rounded-full">
                               {interactionStatus === 'rated' ? <CheckIcon className="w-5 h-5 text-green-500"/> : <MoreIcon className="w-5 h-5"/>}
                           </button>
                           {isMenuOpen && (
                               <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-dark-surface rounded-md shadow-lg border border-stone-200 dark:border-dark-border z-20">
                                   <div className="p-3 border-b border-stone-200 dark:border-dark-border">
                                       <div className="flex justify-around text-xs">
                                          <button 
                                              disabled={!canInteractWithRating}
                                              onClick={(e) => canInteractWithRating && onOpenRatingMenu(e, { planetId, contentId: content.id, contentType })}
                                              className={`flex-1 text-center p-1 rounded ${canInteractWithRating ? 'hover:bg-stone-100 dark:hover:bg-stone-700' : 'cursor-not-allowed opacity-50'}`}
                                            >
                                                😊 {ratingStats.agree || 0}
                                            </button>
                                            <button 
                                              disabled={!canInteractWithRating}
                                              onClick={(e) => canInteractWithRating && onOpenRatingMenu(e, { planetId, contentId: content.id, contentType })}
                                              className={`flex-1 text-center p-1 rounded ${canInteractWithRating ? 'hover:bg-stone-100 dark:hover:bg-stone-700' : 'cursor-not-allowed opacity-50'}`}
                                            >
                                                😐 {ratingStats.doubt || 0}
                                            </button>
                                            <button 
                                              disabled={!canInteractWithRating}
                                              onClick={(e) => canInteractWithRating && onOpenRatingMenu(e, { planetId, contentId: content.id, contentType })}
                                              className={`flex-1 text-center p-1 rounded ${canInteractWithRating ? 'hover:bg-stone-100 dark:hover:bg-stone-700' : 'cursor-not-allowed opacity-50'}`}
                                            >
                                                😠 {ratingStats.disagree || 0}
                                            </button>
                                       </div>
                                   </div>
                                    <button onClick={() => { onReport(planetId, content.id, contentType); setIsMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-stone-700 dark:text-dark-primary-text hover:bg-stone-100 dark:hover:bg-stone-700 flex items-center"><ReportIcon className="w-4 h-4 mr-2"/>舉報內容</button>
                                   {interactionStatus === 'rated' && (
                                     <button onClick={() => { handleRemoveRating(); setIsMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50 flex items-center"><DeleteIcon className="w-4 h-4 mr-2"/>移除我的評價</button>
                                   )}
                                   {isAuthor && (
                                       <>
                                        <div className="border-t border-stone-200 dark:border-dark-border my-1"></div>
                                        <button onClick={() => { setIsEditing(true); setIsMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-stone-700 dark:text-dark-primary-text hover:bg-stone-100 dark:hover:bg-stone-700 flex items-center"><EditIcon className="w-4 h-4 mr-2"/>編輯</button>
                                        <button onClick={() => { handleDelete(); setIsMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50 flex items-center"><DeleteIcon className="w-4 h-4 mr-2"/>刪除</button>
                                       </>
                                   )}
                               </div>
                           )}
                       </div>
                    </div>
                     <div className="flex items-start space-x-4">
                        <div className="flex-1">
                            {isEditing ? (
                                <div className="mt-2" onClick={stopPropagation}>
                                    <textarea value={editText} onChange={(e) => setEditText(e.target.value)} className="w-full p-2 border border-stone-300 dark:border-dark-border bg-white dark:bg-dark-background rounded-md text-sm focus:ring-sky-500 focus:border-sky-500" rows={4}></textarea>
                                    <div className="flex items-center space-x-2 mt-2">
                                        <button onClick={handleSaveEdit} className="bg-sky-600 text-white text-xs py-1 px-3 rounded-md hover:bg-sky-700">儲存</button>
                                        <button onClick={() => setIsEditing(false)} className="bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs py-1 px-3 rounded-md hover:bg-stone-300 dark:hover:bg-stone-600">取消</button>
                                    </div>
                                </div>
                            ) : (
                                <ContentBody text={content.text} isDetailView={isDetailView} />
                            )}
                        </div>
                        {isDetailView && 'evidence' in content && content.evidence && (
                             <div className="w-24 h-24 bg-stone-200 dark:bg-dark-border rounded-lg flex-shrink-0">
                                {/* Image Placeholder */}
                            </div>
                        )}
                    </div>
                    
                    <div className="text-xs text-dark-secondary-text pt-1 flex justify-between items-center">
                         <div>
                            {content.editedAt && (
                                <span className="italic" title={new Date(content.editedAt).toLocaleString()}>
                                    (已編輯於 {formatTimestamp(content.editedAt)})
                                </span>
                            )}
                        </div>
                    </div>

                    <div onClick={stopPropagation}>
                        {!isDetailView && <ContentFooter planetId={planetId} content={content} onNavigateToDetail={() => onNavigateToDetail(planetId, content.id, contentType)} onAnalyze={onAnalyze}/>}
                    </div>
                </div>
            </div>
        </article>
    );
};

export default ContentCard;