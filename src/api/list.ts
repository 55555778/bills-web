import type {
  ChartResult,
  DeleteData,
  ListCreateParams,
  ListQueryParams,
  ListResult,
} from '../types';
import { showMessage } from '../utils/message';
import { Post, PostBlob } from './axios';

export const ListApi = {
  create: (data: ListCreateParams) => {
    return Post('/list/create', data);
  },
  list: (data: ListQueryParams) => {
    return Post<ListResult>('/list/list', data);
  },

  chart: (data: { user: string }) => {
    return Post<ChartResult>('/list/chart', data);
  },

  delete: (data: DeleteData) => {
    return Post('/list/delete', data);
  },

  edit: (data: ListCreateParams) => {
    return Post('/list/edit', data);
  },

  upload: (data: FormData) => {
    return Post('/list/upload', data, {
      headers: {
        'Content-Type': 'multipart/form-data', // 可省略，axios 自动处理
      },
    });
  },
  // export: (data: { user: string; ids: string[] }) => {
  //   return Post('/list/export', data, {
  //     responseType: 'blob',
  //   });
  // },
  export: (data: { user: string; ids: string[] }) => {
    return PostBlob('/list/export', data, { responseType: 'blob' })
      .then((res) => {
        const blob = new Blob([res as Blob], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        // 下载文件名可根据需要自定义
        a.download = `账单导出_${new Date().toISOString().slice(0, 10)}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        showMessage.success('导出成功');
      })
      .catch((err) => {
        showMessage.error('导出失败');
        console.error('导出失败:', err);
      });
  },
};
