import axios, { type AxiosInstance } from "axios";

export const axiosBaseQuery = ({ axiosInstance }: { axiosInstance: AxiosInstance }) =>
    async ({ url, method, data, params }: { url: string; method: string; data?: any; params?: any }) => {
        try {
            const result = await axiosInstance({ url, method, data, params });
            return { data: result.data };
        } catch (error) {
            return { error };
        }
    }