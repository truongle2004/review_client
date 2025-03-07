import { create } from 'zustand';

interface UserInfo {
  isLoggedIn: boolean;
  isAdmin: boolean;
}

interface AuthStore {
  userInfo: UserInfo;
}

const useAuthStore = create<AuthStore>(() => ({
  userInfo: {
    isLoggedIn: localStorage.getItem('token') ? true : false,
    isAdmin: false,
  },
}));

export default useAuthStore;
