import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BaseQueryFn, FetchArgs, FetchBaseQueryError, FetchBaseQueryMeta } from '@reduxjs/toolkit/query';

const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, object, FetchBaseQueryMeta> = async (
  args,
  api,
  extraOptions
) => {
  const result = await fetchBaseQuery({
    baseUrl: 'http://localhost:3000', // Mock server (json-server serving db.json)
    prepareHeaders: (headers) => {
      console.log('Mock API Request:', { url: typeof args === 'string' ? args : args.url, headers }); // Debug logging
      return headers;
    },
  })(args, api, extraOptions);

  return result;
};

export const mockApiService = createApi({
  baseQuery,
  endpoints: () => ({}),
  reducerPath: 'mockApiService',
});

export default mockApiService;