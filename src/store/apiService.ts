import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BaseQueryFn, FetchArgs, FetchBaseQueryError, FetchBaseQueryMeta } from '@reduxjs/toolkit/query';
import { globalHeaders } from '@/utils/apiFetch';

const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, object, FetchBaseQueryMeta> = async (
    args,
    api,
    extraOptions
) => {
    const result = await fetchBaseQuery({
        baseUrl: 'http://localhost:5275', // Backend API URL
        prepareHeaders: (headers) => {
            Object.entries(globalHeaders).forEach(([key, value]) => {
                headers.set(key, value);
            });
            console.log('API Request:', { url: typeof args === 'string' ? args : args.url, headers }); // Debug logging
            return headers;
        }
    })(args, api, extraOptions);

    // Example of handling specific error codes
    if (result.error && result.error.status === 401) {
        // Logic to handle 401 errors (e.g., refresh token)
    }

    return result;
};

export const apiService = createApi({
    baseQuery,
    endpoints: () => ({}),
    reducerPath: 'apiService'
});

export default apiService;