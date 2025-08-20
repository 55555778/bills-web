export interface SettingItem {
  _id: string;
  name: string;
  type: string;
  user: string;
  money: string;
  isdelete: boolean;
  children: SettingItem[];
}

export interface SettingForm {
  level: number;
  category: string;
  _id?: string;
}

export interface OptionsItem {
  value: string;
  title: string;
  children: OptionsItem[];
}

export interface GetOptions {
  accounts: OptionsItem[];
  shops: OptionsItem[];
  categorys: OptionsItem[];
}
