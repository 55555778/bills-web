import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { EditListItem } from '../types';

interface Flow {
  isOpen: boolean;
  editData: EditListItem | null;
  setOpenSide: (value: boolean) => void;
  setEditData: (value: EditListItem) => void;
}

export const useFlowStore = create<Flow>()(
  devtools(
    persist(
      immer((set) => ({
        isOpen: false,
        editData: {
          money: 0,
          time: 0,
          type: '',
          remark: '',
          account: null,
          shop: null,
          category: null,
          user: '',
          _id: '',
        },
        setOpenSide: (open: boolean) => {
          set((state: Flow) => {
            state.isOpen = open;
            if (!state.isOpen) {
              state.editData = null;
            }
            console.log('isOpen:', state.isOpen);
          });
        },
        setEditData: (value: EditListItem) => {
          set((state: Flow) => {
            state.editData = value;
          });
        },
      })),

      {
        name: 'FlowStore',
      },
    ),
  ),
);
