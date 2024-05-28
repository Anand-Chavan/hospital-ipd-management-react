import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token') as string,
    },
});

export default axiosInstance;
