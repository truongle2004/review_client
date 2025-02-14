import { create } from 'zustand';

interface OpenProfileEdit {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const editProfileStore = create<OpenProfileEdit>((set) => ({
  open: false,
  setOpen(open) {
    set({ open });
  },
}));

export default editProfileStore;
