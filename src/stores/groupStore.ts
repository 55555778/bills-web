import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { GroupItem, GroupStore } from '../types';

interface GroupArr {
  curGroup: string | null;
  groupData: GroupStore[] | null;
  setGroupData: (value: GroupStore[]) => void;
  setCurGroup: (value: GroupStore | GroupItem) => void;
  clearGroupData: () => void;
}
export const useGroupStore = create<GroupArr>()(
  devtools(
    persist(
      (set) => ({
        curGroup: null,
        groupData: null,
        setGroupData: (value: GroupStore[]) => {
          set({ groupData: value });
        },
        setCurGroup: (value: GroupStore | GroupItem) => {
          console.log('👊 ~ value:', value);
          set({ curGroup: value._id });
        },
        clearGroupData: () => {
          set({ groupData: null });
        },
      }),
      { name: 'group-storage' },
    ),

    { name: 'GroupStore' },
  ),
);
