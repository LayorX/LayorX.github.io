
import { User, UserWithPassword, Metric } from '../types';
import { USERS } from '../constants';

const USERS_DB_KEY = 'rationalPlatformUsers';
const CURRENT_USER_KEY = 'rationalPlatformCurrentUser';

const getUsersFromDB = (): Record<string, UserWithPassword> => {
  const dbString = localStorage.getItem(USERS_DB_KEY);
  if (dbString) {
    return JSON.parse(dbString);
  } else {
    // Seed the database with initial users and a default password
    const initialUsersWithPasswords: Record<string, UserWithPassword> = {};
    Object.values(USERS).forEach(user => {
      initialUsersWithPasswords[user.id] = { 
          ...user,
          password: 'password',
          // Initialize new fields for existing users
          bio: user.bio || '',
          notifications: user.notifications || [],
          pinnedContentId: user.pinnedContentId,
          metricHistory: user.metricHistory || [],
          ratedContent: user.ratedContent || {},
        };
    });
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(initialUsersWithPasswords));
    return initialUsersWithPasswords;
  }
};

const saveUsersToDB = (users: Record<string, UserWithPassword>) => {
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
};

export const authService = {
  getUsers: (): Record<string, User> => {
    const usersWithPasswords = getUsersFromDB();
    const users: Record<string, User> = {};
    for (const id in usersWithPasswords) {
      const { password, ...user } = usersWithPasswords[id];
      users[id] = user;
    }
    return users;
  },
  
  updateUser: (user: User) => {
      const usersDB = getUsersFromDB();
      const userWithPassword = usersDB[user.id];
      if(userWithPassword) {
          usersDB[user.id] = {...user, password: userWithPassword.password};
          saveUsersToDB(usersDB);
      }
  },
  
  updateUsers: (usersToUpdate: User[]) => {
      const usersDB = getUsersFromDB();
      usersToUpdate.forEach(user => {
           const userWithPassword = usersDB[user.id];
            if(userWithPassword) {
                usersDB[user.id] = {...user, password: userWithPassword.password};
            }
      });
      saveUsersToDB(usersDB);
  },

  getCurrentUser: (): User | null => {
    const userId = localStorage.getItem(CURRENT_USER_KEY);
    if (!userId) return null;
    const users = authService.getUsers();
    return users[userId] || null;
  },
  
  login: (username: string, pass: string): User | null => {
    const usersDB = getUsersFromDB();
    const userRecord = Object.values(usersDB).find(u => u.name === username);

    if (userRecord && userRecord.password === pass) {
      localStorage.setItem(CURRENT_USER_KEY, userRecord.id);
      const { password, ...user } = userRecord;
      return user;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  register: (username: string, pass: string): User | null => {
    if (!username || !pass) throw new Error("用戶名和密碼不能為空");
    
    const usersDB = getUsersFromDB();
    const existingUser = Object.values(usersDB).find(u => u.name.toLowerCase() === username.toLowerCase());

    if (existingUser) {
      throw new Error("用戶名已存在");
    }

    const newId = `user-${Date.now()}`;
    const newUser: UserWithPassword = {
      id: newId,
      name: username,
      avatar: `https://picsum.photos/seed/${newId}/100/100`,
      bio: '',
      metrics: { 
          contribution: { value: 10, trend: 'stable' }, 
          trust: { value: 100, trend: 'stable' }, 
          depth: { value: 100, trend: 'stable' }
      },
      password: pass,
      metricHistory: [],
      ratedContent: {},
      notifications: [],
    };
    
    usersDB[newId] = newUser;
    saveUsersToDB(usersDB);
    
    // Automatically log in after registration
    localStorage.setItem(CURRENT_USER_KEY, newId);
    
    const { password, ...user } = newUser;
    return user;
  },
  
  updateUserProfile: (userId: string, profileData: { bio?: string, pinnedContentId?: string | null }) => {
      const usersDB = getUsersFromDB();
      if(usersDB[userId]) {
          if (profileData.bio !== undefined) {
            usersDB[userId].bio = profileData.bio;
          }
          if (profileData.pinnedContentId !== undefined) {
             usersDB[userId].pinnedContentId = profileData.pinnedContentId === null ? undefined : profileData.pinnedContentId;
          }
          saveUsersToDB(usersDB);
      }
      return usersDB[userId];
  },
  
  dev_updateUserMetrics: (userId: string, newMetrics: {trust: number, depth: number, contribution: number}): User | null => {
      const usersDB = getUsersFromDB();
      const user = usersDB[userId];
      if(user) {
          user.metrics.trust.value = newMetrics.trust;
          user.metrics.depth.value = newMetrics.depth;
          user.metrics.contribution.value = newMetrics.contribution;
          saveUsersToDB(usersDB);
          const { password, ...updatedUser} = user;
          return updatedUser;
      }
      return null;
  }
};