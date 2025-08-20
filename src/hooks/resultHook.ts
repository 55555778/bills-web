import type { ApiResponse } from '../api/axios';
import { showMessage } from '../utils/message';

export const resutlHook = (res: ApiResponse, msg?: string) => {
  if (res.status == 0) {
    if (msg) {
      showMessage.success(`${msg}完成！`);
    }
    console.log('👊 ~ resutlHook ~ res:', res);

    return res.result;
  } else {
    showMessage.warning(msg ? `${msg}失败！` : res.msg);
    return null;
  }
};
