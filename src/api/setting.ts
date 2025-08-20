import type { GetOptions } from '../types';
import { Get, Post } from './axios';

export const SettingApi = {
  getList: (data: { type: string; _id: string }) => {
    return Get('/setting/list', data);
  },
  create: (data: { type: string; category: string; _id?: string; user: string }) => {
    return Post('/setting/create', data);
  },

  options: (data: { type: string; _id: string }) => {
    return Get('setting/levelOptions', data);
  },
  switch: (data: { _id: string; group: string }) => {
    return Post('setting/switch', data);
  },

  getCategory: (data: { user: string; type: string }) => {
    return Get<GetOptions>('/setting/category', data);
  },
};
