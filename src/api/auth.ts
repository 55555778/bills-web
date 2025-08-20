import { Post } from './axios';

export const AuthApi = {
  refresh: (token: string) => {
    return Post('/auth/refresh', { token });
  },
};
