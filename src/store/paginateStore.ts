import { AppConstant } from '@/utils/AppConstant';
import { create } from 'zustand';

interface OpenProfileEdit {
  page: number;
  setPage: (page: number) => void;
}

const paginateStore = create<OpenProfileEdit>((set) => ({
  page: AppConstant.FIRST_PAGE,
  setPage(page) {
    set({ page });
  },
}));

export default paginateStore;
