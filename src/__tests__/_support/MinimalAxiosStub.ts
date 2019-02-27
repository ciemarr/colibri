import { MinimalAxios } from '../../_support/MinimalAxios';
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from 'axios';

// Appease jest + react-scripts: "Your test suite must contain at least one test."
it('loads test helpers', () => { /* */ });

export class MinimalAxiosStub implements MinimalAxios {
  public get<T = any>(url: string, config?: AxiosRequestConfig | undefined): AxiosPromise<T> {
    throw new Error('stub axios method not implemented');
  }

  public delete(url: string, config?: AxiosRequestConfig | undefined): AxiosPromise<any> {
    throw new Error('stub axios method not implemented');
  }

  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig | undefined): AxiosPromise<T> {
    throw new Error('stub axios method not implemented');
  }

  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig | undefined): AxiosPromise<T> {
    throw new Error('stub axios method not implemented');
  }

  public patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig | undefined): AxiosPromise<T> {
    throw new Error('stub axios method not implemented');
  }
}