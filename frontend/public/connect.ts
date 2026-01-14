import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": 'application/json'
    }
});

let isRefreshing = false;

axiosInstance.interceptors.request.use(
    function (config) {
        const access = localStorage.getItem('accessToken');
        if (access)
            config.headers['Authorization'] = `Bearer ${access}`
        return config
    }

)

axiosInstance.interceptors.response.use(
    function (res) {
        return res
    },
    async function (err) {
        const og_config = err.config;

        // Skip retry for refresh token endpoint to prevent infinite loops
        if (og_config.url?.includes('/token/refresh/')) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            return Promise.reject(err);
        }

        if (err.response?.status === 401 && !og_config._retry && !isRefreshing) {
            og_config._retry = true;
            isRefreshing = true;

            try {
                const refresh = localStorage.getItem('refreshToken');
                if (!refresh) {
                    throw new Error('No refresh token');
                }

                // Use plain axios to avoid interceptor loop
                const res = await axios.post(`${BASE_URL}token/refresh/`, { refresh });
                localStorage.setItem('accessToken', res.data.access);
                og_config.headers['Authorization'] = `Bearer ${res.data.access}`;
                return axiosInstance(og_config);
            } catch (error) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                return Promise.reject(error);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(err);
    }
)

export default axiosInstance;

