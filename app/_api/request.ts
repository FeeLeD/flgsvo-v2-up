import axios, { AxiosRequestConfig } from "axios";

export const request = {
  post: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig<unknown>
  ): Promise<T> => {
    try {
      const res = await axios.post(url, data, config);
      return res.data as T;
    } catch (err) {
      throw err;
    }
  },
  get: async <T>(
    url: string,
    config?: AxiosRequestConfig<unknown>
  ): Promise<T> => {
    try {
      const res = await axios.get(url, config);
      return res.data as T;
    } catch (err) {
      throw err;
    }
  },
  put: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig<unknown>
  ): Promise<T> => {
    try {
      const res = await axios.put(url, data, config);
      return res.data as T;
    } catch (err) {
      throw err;
    }
  },
  delete: async <T>(
    url: string,
    config?: AxiosRequestConfig<unknown>
  ): Promise<T> => {
    try {
      const res = await axios.delete(url, config);
      return res.data as T;
    } catch (err) {
      throw err;
    }
  },
};
