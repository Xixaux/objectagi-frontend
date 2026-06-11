// src/utils/apiFetch.ts (FIXED)

// Set the base URL to your ASP.NET Core API server running on port 5275.
// This is the CRITICAL FIX for the "Unexpected token '<'" error.
export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5275'; 

// Define the types for options and configuration
type FetchOptions = RequestInit;

export class FetchApiError extends Error {
    status: number;

    data: unknown;

    constructor(status: number, data: unknown) {
        super(`FetchApiError: ${status}`);
        this.status = status;
        this.data = data;
    }
}

// Global headers configuration
export const globalHeaders: Record<string, string> = {};

// Function to update global headers
export const setGlobalHeaders = (newHeaders: Record<string, string>) => {
    Object.assign(globalHeaders, newHeaders);
};

export const removeGlobalHeaders = (headerKeys: string[]) => {
    headerKeys.forEach((key) => {
        delete globalHeaders[key];
    });
};

// Main apiFetch function with interceptors and type safety
const apiFetch = async (endpoint: string, options: FetchOptions = {}) => {
    const { headers, ...restOptions } = options;
    const method = restOptions.method || 'GET';
    // Set default headers, including global headers
    const config: FetchOptions = {
        headers: {
            // Only set Content-Type for non-GET requests to be safe
            ...(method !== 'GET' && { 'Content-Type': 'application/json' }), 
            ...globalHeaders,
            ...headers
        },
        ...restOptions
    };

    try {
        // Correctly concatenate the backend URL with the endpoint
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        if (!response.ok) {
            let errorData;
            try {
                // Check if the response is JSON before trying to parse it
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    errorData = await response.json();
                } else {
                    // If it's not JSON (like HTML or plain text), read as text
                    errorData = await response.text(); 
                }
            } catch (error) {
                // Fallback if reading JSON fails completely
                errorData = await response.text();
            }
            
            throw new FetchApiError(response.status, errorData);
        }

        return response;
    } catch (error) {
        console.error('Error in apiFetch:', error);
        throw error;
    }
};

export default apiFetch;