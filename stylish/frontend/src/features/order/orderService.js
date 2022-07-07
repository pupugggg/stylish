import axios from 'axios'
const API_URL = '/api/v1/order/'
const getHistory = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.get(API_URL, config)
    return response.data
}

const getStocksById = async (data, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.post(API_URL + '/update', data, config)
    return response.data
}

const sendCart = async (data, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.post(API_URL + 'cart/', data, config)
    return response.data
}
const sendPrimeAndPay = async (prime, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.post(API_URL + 'checkout/', prime, config)
    return response.data
}

const orderService = {
    getStocksById,
    getHistory,
    sendCart,
    sendPrimeAndPay,
}

export default orderService
