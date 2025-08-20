export interface User {
  _id: string;
  name: string;
  email: string;
  permissions: string;
}

export interface Group {
  _id: string;
  users: string[];
  name: string;
  remark: string;
  owner: string;
  default: boolean;
  main: boolean;
}

export interface Login {
  refreshToken: string;
  accessToken: string;
  user: User;
  group: Group[];
}

export interface UpdateUser {
  _id: string;
  name: string;
  email: string;
  isDark: boolean;
  language: string;
}
