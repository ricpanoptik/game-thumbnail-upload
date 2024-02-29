const axios = require('axios');

const axiosInstance = axios.create({
    baseURL: process.env.BASE_API,
    headers: {
        'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
    }
});

module.exports = axiosInstance;