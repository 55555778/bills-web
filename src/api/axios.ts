/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { type AxiosRequestConfig } from 'axios';
import { showMessage } from '../utils/message';

export interface ApiResponse<T = any> {
  status: number;
  result: T;
  msg: string;
}

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API || '/api', // 根据你的配置环境设置
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // 可在此统一添加 token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

let isRefreshing = false;
let requestQueue: (() => void)[] = [];

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response;
    // console.log('👊 ~ 响应拦截器', res);

    return res;
  },
  async (error) => {
    console.error('网络异常:', error);
    const originalRequest = error.config;
    console.log('👊 ~ originalRequest:', originalRequest);
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (isRefreshing) {
        return new Promise((resolve) => {
          requestQueue.push(() => {
            resolve(service(originalRequest));
          });
        });
      }
      isRefreshing = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        console.log('👊 ~ refreshToken:', refreshToken);
        const res = await axios.post(import.meta.env.VITE_BASE_API + '/auth/refresh', {
          refreshToken,
        });
        const newToken = res.data.result;
        console.log('👊 ~ newToken:', newToken);
        localStorage.setItem('accessToken', newToken);

        // 重试之前的请求
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        requestQueue.forEach((cb) => cb());
        requestQueue = [];

        return service(originalRequest);
      } catch (err) {
        showMessage.error('登录超时，请重新登录');

        window.location.href = '/login';
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export const Get = async <T = any>(
  url: string,
  params?: any,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> => {
  const res = await service.get<ApiResponse<T>>(url, { params, ...config });
  return res.data; // ✅ 这里明确告诉 TS 是 ApiResponse<T>
};

export const Post = async <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> => {
  const res = await service.post<ApiResponse<T>>(url, data, config);

  return res.data;
};

export const PostBlob = async (
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<Blob> => {
  const res = await service.post(url, data, {
    ...config,
    responseType: 'blob',
  });
  return res.data as Blob;
};
export default service;
