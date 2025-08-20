import type { Login, UpdateUser } from '../types';
import { Get, Post } from './axios';
export const UserApi = {
  login: (data: { email: string; password: string; remember: boolean }) => {
    return Post<Login>('/user/login', data);
  },
  register: (data: { name: string; password: string; permissions: string; email: string }) => {
    return Post('/user/create', data);
  },

  getList: () => {
    return Get('/user/list');
  },

  update: (data: UpdateUser) => {
    return Post('/user/update', data);
  },
  detail: (data: { _id: string }) => {
    return Get<UpdateUser>('/user/detail', data);
  },
};
