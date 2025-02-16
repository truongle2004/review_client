import { create } from 'zustand';

interface OpenProfileEdit {
  open: boolean;
  isUserProfile: boolean;
  setOpen: (open: boolean) => void;
  setIsUserProfile: (isUserProfile: boolean) => void;
}

const editProfileStore = create<OpenProfileEdit>((set) => ({
  open: false,
  isUserProfile: false,
  setIsUserProfile(isUserProfile) {
    set({ isUserProfile });
  },
  setOpen(open) {
    set({ open });
  },
}));

export default editProfileStore;
