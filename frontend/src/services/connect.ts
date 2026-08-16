import axios, { type InternalAxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": 'application/json'
    }
});

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token!);
        }
    });
    failedQueue = [];
};

axiosInstance.interceptors.request.use(
    function (config: InternalAxiosRequestConfig) {
        const access = localStorage.getItem('accessToken');
        const isPublicEndpoint = config.url?.includes('/public/') || (config.method?.toLowerCase() === 'get' && /^\/listings\/[^\/]+\/?$/.test(config.url || ''));
        
        if (access && !isPublicEndpoint) {
            config.headers.set('Authorization', `Bearer ${access}`);
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    function (res) {
        return res;
    },
    async function (err) {
        const originalRequest = err.config;

        // Skip retry for refresh token endpoint or if request config missing
        if (!originalRequest || originalRequest.url?.includes('/token/refresh/')) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            return Promise.reject(err);
        }

        if (err.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Another request is already refreshing the token; queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers['Authorization'] = `Bearer ${token}`;
                        return axiosInstance(originalRequest);
                    })
                    .catch((queueErr) => {
                        return Promise.reject(queueErr);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refresh = localStorage.getItem('refreshToken');
            if (!refresh) {
                isRefreshing = false;
                processQueue(new Error('No refresh token available'), null);
                return Promise.reject(err);
            }

            try {
                // Use plain axios to avoid interceptor loop
                const res = await axios.post(`${BASE_URL}token/refresh/`, { refresh });
                const newAccessToken = res.data.access;

                localStorage.setItem('accessToken', newAccessToken);
                if (res.data.refresh) {
                    localStorage.setItem('refreshToken', res.data.refresh);
                }

                processQueue(null, newAccessToken);

                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);

                // If refresh fails, fully log out the user
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');

                // Dispatch logout action to Redux dynamically to avoid circular dependency
                import('../redux/store/store').then(({ store }) => {
                    import('../redux/slices/authSlice').then(({ logout }) => {
                        store.dispatch(logout());
                    });
                }).catch(console.error);

                // Retry original request without the token (for public endpoints fallback)
                delete originalRequest.headers['Authorization'];
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(err);
    }
);

export default axiosInstance;
