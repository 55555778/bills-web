export interface GroupItem {
  _id: string;
  users: {
    _id: string;
    name: string;
  }[];
  name: string;
  default: boolean;
  owner: {
    _id: string;
    name: string;
  };
  main: boolean;
}

export interface GroupStore {
  _id: string;
  users: string[];
  name: string;
  default: boolean;
  owner: string;
  main: boolean;
}
