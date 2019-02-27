import { AxiosRequestConfig, AxiosPromise } from 'axios';

export interface MinimalAxios {
  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
  delete(url: string, config?: AxiosRequestConfig): AxiosPromise;
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>;
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>;
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>;
}
