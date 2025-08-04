
import { Planet, Argument, Comment, Rating, User, Notification } from '../types';
import { PLANETS } from '../constants';
import { authService } from './authService';
import { metricService } from './metricService';

const DB_KEY = 'rationalPlatformPlanets';

const getPlanetsFromDB = (): Planet[] => {
  const dbString = localStorage.getItem(DB_KEY);
  if (dbString) {
    try {
      return JSON.parse(dbString);
    } catch (e) {
      console.error("Failed to parse planets from localStorage", e);
      // Fallback to default
    }
  }
  // Seed the database with initial data
  localStorage.setItem(DB_KEY, JSON.stringify(PLANETS));
  return JSON.parse(JSON.stringify(PLANETS)); // Return a deep copy
};

const savePlanetsToDB = (planets: Planet[]) => {
  localStorage.setItem(DB_KEY, JSON.stringify(planets));
};

const findContent = (planets: Planet[], planetId: string, contentId: string): { content: Argument | Comment; contentType: 'argument' | 'comment' } | null => {
    const planet = planets.find(p => p.id === planetId);
    if (!planet) return null;

    const argument = planet.arguments.find(a => a.id === contentId);
    if (argument) return { content: argument, contentType: 'argument' };

    const comment = planet.comments.find(c => c.id === contentId);
    if (comment) return { content: comment, contentType: 'comment' };
    
    return null;
};

const createNotification = (
  forUserId: string, 
  fromUserId: string,
  type: Notification['type'],
  planetId: string,
  contentId: string,
  contentType: 'argument' | 'comment'
) => {
    if(forUserId === fromUserId) return; // Don't notify self

    const users = authService.getUsers();
    const targetUser = users[forUserId];
    if(targetUser) {
        const newNotification: Notification = {
            id: `notif-${Date.now()}`,
            type,
            fromUserId,
            planetId,
            contentId,
            contentType,
            timestamp: Date.now(),
            read: false,
        };
        targetUser.notifications.unshift(newNotification);
        authService.updateUser(targetUser);
    }
}


export const dataService = {
  getPlanets: (): Planet[] => {
    return getPlanetsFromDB();
  },

  getPlanetById: (planetId: string): Planet | undefined => {
      return getPlanetsFromDB().find(p => p.id === planetId);
  },

  addArgument: (planetId: string, argument: Omit<Argument, 'id' | 'ratings'>): Planet[] => {
    const planets = getPlanetsFromDB();
    const planetIndex = planets.findIndex(p => p.id === planetId);
    if (planetIndex > -1) {
      const newArgument: Argument = {
        ...argument,
        id: `arg-${Date.now()}`,
        ratings: [],
      };
      planets[planetIndex].arguments.push(newArgument);
      savePlanetsToDB(planets);
    }
    return planets;
  },

  addComment: (planetId: string, commentData: Omit<Comment, 'id' | 'ratings'>): Planet[] => {
    const planets = getPlanetsFromDB();
    const planet = planets.find(p => p.id === planetId);
    if (planet) {
        let finalCommentData = { ...commentData };
        let notifyUserId: string | null = null;
        let originalContentId = commentData.parentId;
        let originalContentType: 'argument' | 'comment' = 'comment';
        
        // Handle @mention for nested replies
        if (commentData.parentId) {
            const parentComment = planet.comments.find(c => c.id === commentData.parentId);
            if(parentComment) {
                 originalContentId = parentComment.id;
                 originalContentType = 'comment';
                 // If parent is already a reply, make this a top-level reply with a mention
                 if(parentComment.parentId) {
                     const users = authService.getUsers();
                     const parentAuthor = users[parentComment.authorId];
                     finalCommentData.text = `@${parentAuthor.name} ${commentData.text}`;
                     finalCommentData.parentId = parentComment.parentId; // Attach to the same parent as the replied-to comment
                     notifyUserId = parentComment.authorId;
                 } else {
                     // It's a first-level reply
                     notifyUserId = parentComment.authorId;
                 }
            } else {
                 // The parent is an argument
                 const parentArg = planet.arguments.find(a => a.id === commentData.parentId);
                 if(parentArg) {
                    originalContentId = parentArg.id;
                    originalContentType = 'argument';
                    notifyUserId = parentArg.authorId;
                 }
            }
        }

        const newComment: Comment = {
            ...finalCommentData,
            id: `com-${Date.now()}`,
            ratings: [],
        };

        planet.comments.push(newComment);
        
        if (notifyUserId && originalContentId) {
            createNotification(notifyUserId, newComment.authorId, 'reply', planetId, originalContentId, originalContentType);
        }

        savePlanetsToDB(planets);
    }
    return planets;
  },

  editArgument: (planetId: string, argumentId: string, newText: string): Planet[] => {
      const planets = getPlanetsFromDB();
      const planet = planets.find(p => p.id === planetId);
      if(planet){
        const argument = planet.arguments.find(a => a.id === argumentId);
        if (argument) {
            argument.text = newText;
            argument.editedAt = Date.now();
            savePlanetsToDB(planets);
        }
      }
      return planets;
  },

  deleteArgument: (planetId: string, argumentId: string): Planet[] => {
      const planets = getPlanetsFromDB();
      const planet = planets.find(p => p.id === planetId);
      if (planet) {
          planet.arguments = planet.arguments.filter(a => a.id !== argumentId);
          savePlanetsToDB(planets);
      }
      return planets;
  },

  editComment: (planetId: string, commentId: string, newText: string): Planet[] => {
      const planets = getPlanetsFromDB();
       const planet = planets.find(p => p.id === planetId);
       if(planet){
        const comment = planet.comments.find(c => c.id === commentId);
        if (comment) {
            comment.text = newText;
            comment.editedAt = Date.now();
            savePlanetsToDB(planets);
        }
      }
      return planets;
  },

  deleteComment: (planetId: string, commentId: string): Planet[] => {
      const planets = getPlanetsFromDB();
      const planet = planets.find(p => p.id === planetId);
      if (planet) {
          planet.comments = planet.comments.filter(c => c.id !== commentId && c.parentId !== commentId); // Also remove replies
          savePlanetsToDB(planets);
      }
      return planets;
  },

  rateContent: (planetId: string, contentId: string, ratingData: Omit<Rating, 'byUserId'>, raterId: string): Planet[] => {
      const planets = getPlanetsFromDB();
      const contentResult = findContent(planets, planetId, contentId);
      const allUsers = authService.getUsers();
      const rater = allUsers[raterId];
      const author = contentResult ? allUsers[contentResult.content.authorId] : null;

      if (contentResult && rater && author && rater.ratedContent[contentId] !== 'rated' && rater.ratedContent[contentId] !== 'removed') {
          const newRating: Rating = { ...ratingData, byUserId: raterId };
          
          const existingRatingIndex = contentResult.content.ratings.findIndex(r => r.byUserId === raterId);
          if (existingRatingIndex > -1) {
              contentResult.content.ratings[existingRatingIndex] = newRating;
          } else {
              contentResult.content.ratings.push(newRating);
          }
          
          rater.ratedContent[contentId] = 'rated';
          metricService.calculateMetricChanges(rater, author, newRating);
          createNotification(author.id, rater.id, 'rating', planetId, contentId, contentResult.contentType);
          authService.updateUsers([rater, author]);
          savePlanetsToDB(planets);
      }
      return planets;
  },

  removeRating: (planetId: string, contentId: string, raterId: string): Planet[] => {
    const planets = getPlanetsFromDB();
    const contentResult = findContent(planets, planetId, contentId);
    const allUsers = authService.getUsers();
    const rater = allUsers[raterId];

    if (contentResult && rater && rater.ratedContent[contentId] === 'rated') {
        contentResult.content.ratings = contentResult.content.ratings.filter(r => r.byUserId !== raterId);
        rater.ratedContent[contentId] = 'removed';
        
        const reason = `移除了對內容 ${contentId} 的評價`;
        const change = -2;
        rater.metrics.contribution.value += change;
        metricService.updateTrend(rater.metrics.contribution, change);
        rater.metricHistory.push({
            timestamp: Date.now(),
            metric: 'contribution',
            change,
            newValue: rater.metrics.contribution.value,
            reason
        });

        authService.updateUser(rater);
        savePlanetsToDB(planets);
    }
    return planets;
  },

  reportContent: (planetId: string, contentId: string, reportReason: string, reportNotes: string, reporterId: string): boolean => {
      console.log("--- CONTENT REPORTED ---");
      console.log("Reporter ID:", reporterId);
      console.log("Planet ID:", planetId);
      console.log("Content ID:", contentId);
      console.log("Reason:", reportReason);
      console.log("Notes:", reportNotes);
      console.log("------------------------");
      
      const rater = authService.getUsers()[reporterId];
      if (rater) {
          const change = 2;
          rater.metrics.contribution.value += change;
          metricService.updateTrend(rater.metrics.contribution, change);
          rater.metricHistory.push({
              timestamp: Date.now(),
              metric: 'contribution',
              change, 
              newValue: rater.metrics.contribution.value,
              reason: `舉報了內容 ${contentId}`
          });
          
          authService.updateUser(rater);
      }
      return true;
  },

  getContentByAuthorId: (authorId: string): Array<{ planetId: string; content: Argument | Comment }> => {
    const planets = getPlanetsFromDB();
    const allContent: Array<{ planetId: string; content: Argument | Comment }> = [];

    for (const planet of planets) {
        for (const argument of planet.arguments) {
            if (argument.authorId === authorId) {
                allContent.push({ planetId: planet.id, content: argument });
            }
        }
        for (const comment of planet.comments) {
            if (comment.authorId === authorId) {
                allContent.push({ planetId: planet.id, content: comment });
            }
        }
    }
    
    return allContent.sort((a, b) => {
        const idA = a.content.id.split('-')[1];
        const idB = b.content.id.split('-')[1];
        return parseInt(idB) - parseInt(idA);
    });
  },

  getRepliesForContent: (planetId: string, contentId: string): Comment[] => {
      const planet = dataService.getPlanetById(planetId);
      if (!planet) return [];
      
      return planet.comments
        .filter(c => c.parentId === contentId)
        .sort((a, b) => {
            const idA = a.id.split('-')[1];
            const idB = b.id.split('-')[1];
            return parseInt(idA) - parseInt(idB); // Show oldest replies first
        });
  },
  
  markNotificationsAsRead: (userId: string): User | null => {
      const users = authService.getUsers();
      const user = users[userId];
      if (user) {
          user.notifications.forEach(n => n.read = true);
          authService.updateUser(user);
          return user;
      }
      return null;
  },

  searchAll: (query: string): {planets: Planet[], users: User[], contents: Array<{planet: Planet, content: Argument | Comment}>} => {
    const planets = getPlanetsFromDB();
    const users = Object.values(authService.getUsers());
    const lowerCaseQuery = query.toLowerCase();

    if (!lowerCaseQuery) return { planets: [], users: [], contents: [] };

    const foundPlanets = planets.filter(p => p.title.toLowerCase().includes(lowerCaseQuery) || p.category.toLowerCase().includes(lowerCaseQuery));
    const foundUsers = users.filter(u => u.name.toLowerCase().includes(lowerCaseQuery));
    const foundContents: Array<{planet: Planet, content: Argument | Comment}> = [];

    planets.forEach(planet => {
        planet.arguments.forEach(arg => {
            if (arg.text.toLowerCase().includes(lowerCaseQuery)) {
                foundContents.push({ planet, content: arg });
            }
        });
        planet.comments.forEach(com => {
            if (com.text.toLowerCase().includes(lowerCaseQuery)) {
                foundContents.push({ planet, content: com });
            }
        });
    });

    return { planets: foundPlanets, users: foundUsers, contents: foundContents };
  }
};