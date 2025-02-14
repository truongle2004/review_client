import { create } from 'zustand';

interface UserInfo {
  isAdmin: boolean;
}

interface AuthStore {
  userInfo: UserInfo;
}

const useAuthStore = create<AuthStore>(() => ({
  userInfo: {
    isAdmin: true,
  },
}));

export default useAuthStore;
