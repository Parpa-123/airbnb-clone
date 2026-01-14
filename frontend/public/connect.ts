import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/',
    headers: {
        "Content-Type": 'application/json'
    }
});

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
        if (err.response?.status === 401 && !og_config.retry) {
            og_config.retry = true;
            try {
                const refresh = localStorage.getItem('refreshToken');
                const res = await axiosInstance.post('/token/refresh/', { refresh: refresh });
                localStorage.setItem('accessToken', res.data.access);
                og_config.headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
                return axiosInstance(og_config);
            } catch (error) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                return Promise.reject(error);
            }
        }
        return Promise.reject(err);
    }
)

export default axiosInstance;
