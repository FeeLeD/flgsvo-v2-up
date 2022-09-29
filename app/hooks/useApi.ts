import { useEffect, useState } from "react";
import { api, Api } from "_api";

export function useApi<T, M>(
  getApiMethod: (api: Api) => (data: T) => Promise<M>
): [
  M | undefined,
  boolean,
  (data: T) => Promise<M | undefined>,
  unknown | undefined
] {
  const [data, setData] = useState<M | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown | undefined>();

  let unMounted = false;
  useEffect(() => {
    return () => {
      unMounted = true;
    };
  }, []);

  const callApi = async (data: T) => {
    if (!unMounted) setIsLoading(true);
    try {
      const res = await getApiMethod(api).call({}, data);
      if (!unMounted) setData(res);
      return res;
    } catch (err) {
      if (!unMounted) setError(err);
      throw err;
    } finally {
      if (!unMounted) setIsLoading(false);
    }
  };

  return [data, isLoading, callApi, error];
}
