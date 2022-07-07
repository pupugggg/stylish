import axios from 'axios'

const API_URL = `/api/v1/products/admin/`

const createProduct = async (payload, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.post(API_URL + 'product/', payload, config)
    return response.data
}

const addStock = async (payload, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.post(API_URL + 'stock/', payload, config)
    return response.data
}
const removeStock = async (sid, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.delete(
        API_URL + 'stock/' + sid.toString(),
        config
    )
    return response.data
}
const addDetail = async (payload, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.post(API_URL + 'detail/', payload, config)
    return response.data
}
const removeDetail = async (did, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.delete(
        API_URL + 'detail/' + did.toString(),
        config
    )
    return response.data
}

const removeProduct = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.delete(API_URL + id.toString(), config)
    return response.data
}

const loadExample = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.put(API_URL + 'load/', null, config)
    return response.data
}

const productService = {
    loadExample,
    removeDetail,
    addDetail,
    createProduct,
    addStock,
    removeStock,
    removeProduct,
}

export default productService
