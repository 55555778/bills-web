export interface ListCreateParams {
  money: number;
  time: number;
  type: string;
  remark?: string;
  account: string;
  shop?: string;
  category?: string;
  user: string;
  _id?: string;
  group: string;
}

export interface ListResult {
  total: number;
  income: number;
  outcome: number;
  list: ListCreateParams[];
}

export interface ChartResult {
  totalExpense: number;
  totalIncome: number;
  income: {
    name: string;
    value: number;
  }[];
  expense: {
    name: string;
    value: number;
  }[];
  line: {
    dates: string[];
    spendList: number[];
    incomeList: number[];
  };
}

export interface DeleteData {
  ids: string[];
  user: string;
}

export interface Detail {
  _id: string;
  name: string;
}

export interface EditListItem {
  money: number;
  time: number | Date;
  type: string;
  remark: string;
  account: Detail | null;
  shop: Detail | null;
  category: Detail | null;
  user: string;
  _id: string;
}

export interface ListQueryParams {
  user: string;
  time?: number[] | null;
  type?: string;
  account?: string;
  shop?: string;
  category?: string;
  money?: number[];
  size?: number;
}
