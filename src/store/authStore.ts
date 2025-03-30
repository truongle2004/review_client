import tokenDecoder from '@/utils/tokenDecode';
import { create } from 'zustand';

interface UserInfo {
  userId?: string | null;
  isAdmin?: boolean;
}

interface AuthStore {
  userInfo: UserInfo;
  setIsAdmin: (isAdmin: boolean) => void;
  setUserId: (userId: string) => void;
  isLoggedIn?: () => boolean;
  logout: () => void;
}

const getAuthInfo = () => {
  return tokenDecoder(localStorage.getItem('token') as string);
};

const useAuthStore = create<AuthStore>((set, get) => ({
  userInfo: {
    userId: getAuthInfo()?.userId,
    isAdmin: getAuthInfo()?.roles === 'admin',
  },

  setIsAdmin: (isAdmin: boolean) => {
    set((state) => ({
      userInfo: {
        ...state.userInfo,
        isAdmin,
      },
    }));
  },

  isLoggedIn() {
    return !!localStorage.getItem('token');
  },

  setUserId: (userId: string) => {
    set((state) => ({
      userInfo: {
        ...state.userInfo,
        userId,
      },
    }));
  },

  logout: () => {
    set((state) => ({
      userInfo: {
        ...state.userInfo,
        userId: '',
        isAdmin: false,
        token: '',
      },
    }));
  },
}));

export default useAuthStore;
