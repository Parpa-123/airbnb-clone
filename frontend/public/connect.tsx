import React from 'react';
import axios, { Axios } from 'axios';

const axiosInstance = axios.create({
    baseURL : 'http://127.0.0.1:8000/api/'
});

export default axiosInstance;