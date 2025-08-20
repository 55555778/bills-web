import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
// import {immer} from 'zustand/middleware/immer';

interface UserStore {
  name: string | null;
  _id: string | null;
  email: string | null;
  token: string | null;
  refreshToken: string | null;
  setUser: (user: {
    name: string;
    _id: string;
    token: string;
    refreshToken: string;
    email: string;
  }) => void;
  removeAllUser: () => void;
}

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set) => ({
        name: null,
        _id: null,
        token: null,
        email: null,
        refreshToken: null,
        setUser: (user: {
          name: string;
          _id: string;
          token: string;
          refreshToken: string;
          email: string;
        }) => {
          console.log(user);
          set(
            {
              name: user.name,
              email: user.email,
              _id: user._id,
              token: user.token,
              refreshToken: user.refreshToken,
            },
            false,
            'setUser',
          );
        },
        removeAllUser: () => {
          set({ name: null, _id: null, token: null, refreshToken: null }, false, 'removeAllUser');
        },
      }),

      {
        name: 'user-storage', // 本地存储的 key
      },
    ),

    { name: 'UserStore' },
  ),
);
