import { Get, Post } from './axios';

export const GroupApi = {
  lsit: ({ user }: { user: string }) => {
    return Get('/group/list', { user });
  },

  create: (body: { user: string; name: string }) => {
    return Post('/group/create', body);
  },

  delete: (_id: string) => {
    return Get('/group/delete/', { _id });
  },

  search: (data: { name: string }) => {
    return Get('/group/search', data);
  },
  join: (data: { group: string; user: string }) => {
    return Post('/group/join', data);
  },
};
