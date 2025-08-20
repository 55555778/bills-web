import { Get, Post } from './axios';

export const BudgetApi = {
  create: (data: { user: string; money: number; group: string; remark: string }) => {
    return Post('/budget/create', data);
  },

  get: (data: { group: string }) => {
    return Get('/budget/find', { ...data });
  },
};
