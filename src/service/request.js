import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
    // headers: {
    //     "P3P": "CP='CAO PSA OUR'",
    //     'cache-control': 'no-cache'
    // },
    withCredentials: true
});

const getData = axiosInstance.get('/query');

module.exports = { getData }