import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
interface CommonStore {
  isLoading: boolean;
  openSide: boolean;
  isDark: boolean;
  language: string;
  setOpenSide: () => void;
  setTheme: () => void;
}

export const useCommonStore = create<CommonStore>()(
  devtools(
    persist(
      immer((set) => ({
        isLoading: false,
        openSide: true,
        isDark: true,
        language: 'zh-CN',
        setTheme: () => {
          set((state: CommonStore) => {
            state.isDark = !state.isDark;
          });
        },
        setOpenSide: () => {
          set((state: CommonStore) => {
            state.openSide = !state.openSide;
          });
        },
        setLanguage: (language: string) => {
          set((state: CommonStore) => {
            state.language = language;
          });
        },
      })),
      {
        name: 'common-storage',
      },
    ),
    { name: 'CommonStore' }, // DevTools 显示的 store 名称
  ),
);
