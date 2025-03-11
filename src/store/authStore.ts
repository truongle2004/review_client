import { create } from 'zustand';

interface UserInfo {
  userId?: string;
  isLoggedIn?: boolean;
  isAdmin?: boolean;
}

interface AuthStore {
  userInfo: UserInfo;
  setLoginStatus: (isLoggedIn: boolean) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setUserId: (userId: string) => void;
}

const useAuthStore = create<AuthStore>((set, get) => ({
  userInfo: {
    userId: '',
    isLoggedIn: false,
    isAdmin: false,
  },

  setLoginStatus: (isLoggedIn: boolean) => {
    set((state) => ({
      userInfo: {
        ...state.userInfo, // Keep existing user info
        isLoggedIn,
      },
    }));
  },

  setIsAdmin: (isAdmin: boolean) => {
    set((state) => ({
      userInfo: {
        ...state.userInfo,
        isAdmin,
      },
    }));
  },

  setUserId: (userId: string) => {
    set((state) => ({
      userInfo: {
        ...state.userInfo,
        userId,
      },
    }));
  },
}));

export default useAuthStore;
