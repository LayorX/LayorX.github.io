
import React, { useState, useMemo, useEffect } from 'react';
import { Planet, User, Argument, Comment } from '../types';
import { dataService } from '../services/dataService';
import ContentCard from './ContentCard';
import Loader from './Loader';
import { AppView } from '../App';

interface SearchPageProps {
  planets: Planet[];
  users: Record<string, User>;
  onNavigate: (view: AppView, payload?: any) => void;
  onOpenProfilePreview: (userId: string) => void;
  currentUser: User;
}

const SearchPage: React.FC<SearchPageProps> = ({ planets, users, onNavigate, onOpenProfilePreview, currentUser }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    planets: Planet[];
    users: User[];
    contents: Array<{ planet: Planet; content: Argument | Comment }>;
  } | null>(null);

  useEffect(() => {
    if (query.length > 1) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        const searchResults = dataService.searchAll(query);
        setResults(searchResults);
        setIsLoading(false);
      }, 500); // Debounce
      return () => clearTimeout(timer);
    } else {
      setResults(null);
    }
  }, [query]);

  return (
    <div>
      <div className="p-4 border-b border-dark-border sticky top-0 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-sm z-10">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜尋星球、用戶或內容..."
          className="w-full p-2 bg-stone-100 dark:bg-dark-background border border-dark-border rounded-full focus:ring-2 focus:ring-sky-500 focus:outline-none"
        />
      </div>

      <div className="p-4">
        {isLoading && <Loader text="搜尋中..." />}
        {!isLoading && results && (
          <div className="space-y-6">
            {results.planets.length > 0 && (
              <div>
                <h2 className="font-bold text-xl mb-2">星球</h2>
                {results.planets.map(p => (
                    <button key={p.id} onClick={() => onNavigate('planet', { planetId: p.id})} className="block w-full text-left p-3 rounded-lg hover:bg-stone-100 dark:hover:bg-dark-surface">
                        <span className="text-xl mr-2">{p.icon}</span>
                        <span className="font-semibold">{p.title}</span>
                    </button>
                ))}
              </div>
            )}
             {results.users.length > 0 && (
              <div>
                <h2 className="font-bold text-xl mb-2">用戶</h2>
                {results.users.map(u => (
                    <button key={u.id} onClick={() => onOpenProfilePreview(u.id)} className="flex items-center w-full text-left p-3 rounded-lg hover:bg-stone-100 dark:hover:bg-dark-surface">
                        <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full mr-3"/>
                        <div>
                            <p className="font-bold">{u.name}</p>
                            <p className="text-sm text-dark-secondary-text">{u.id}</p>
                        </div>
                    </button>
                ))}
              </div>
            )}
             {results.contents.length > 0 && (
              <div>
                <h2 className="font-bold text-xl mb-2">相關內容</h2>
                 {results.contents.map(({ planet, content }) => (
                     <ContentCard 
                        key={content.id}
                        planetId={planet.id}
                        content={content}
                        author={users[content.authorId]}
                        currentUser={currentUser}
                        onNavigateToDetail={(pId, cId, cType) => onNavigate('contentDetail', { planetId: pId, contentId: cId, contentType: cType })}
                        onOpenProfilePreview={onOpenProfilePreview}
                        onAnalyze={() => {}}
                        onDelete={() => {}}
                        onEdit={() => {}}
                        onOpenRatingMenu={() => {}}
                        onRemoveRating={() => {}}
                        onReport={() => {}}
                     />
                 ))}
              </div>
            )}
            {results.planets.length === 0 && results.users.length === 0 && results.contents.length === 0 && (
                <p className="text-center text-dark-secondary-text py-8">找不到與「{query}」相關的結果。</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;