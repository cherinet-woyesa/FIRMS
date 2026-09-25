import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'http://localhost:5238'; // Move to .env later

// 1. Create the base Axios instance
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    // CRITICAL: This tells Axios to include httpOnly cookies in cross-origin requests
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// A flag to prevent infinite loops if the refresh token is also expired
let isRefreshing = false;
// A queue to hold pending requests while the token is being refreshed
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: any) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// 2. Setup Response Interceptor
apiClient.interceptors.response.use(
    (response) => response, // If the request succeeds, just return the response
    async (error: AxiosError) => {
        const originalRequest = error.config;

        // Check if the error is 401 and we haven't already tried to refresh this specific request
        if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
            if (isRefreshing) {
                // If a refresh is already happening, queue this request to wait
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => {
                        return apiClient(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            (originalRequest as any)._retry = true;
            isRefreshing = true;

            try {
                // Call your backend refresh endpoint
                // Because withCredentials is true, the httpOnly refresh cookie is sent automatically
                await axios.post(
                    `${API_BASE_URL}/api/Auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                // If successful, process the queue of waiting requests
                processQueue(null);

                // Retry the original request that failed
                return apiClient(originalRequest);

            } catch (refreshError) {
                // If the refresh fails (e.g., refresh token expired), process queue with error
                processQueue(refreshError as Error, null);

                // OPTIONAL: Redirect to login or dispatch a Redux logout action here
                console.error('Session expired. Please log in again.');
                // window.location.href = '/login'; 

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Standardize error handling if your backend always returns { success: false, message: "..." }
        const backendError = error.response?.data as { message?: string } | undefined;
        if (backendError && backendError.message) {
            return Promise.reject(new Error(backendError.message));
        }

        return Promise.reject(error);
    }
);