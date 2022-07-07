import axios from 'axios'

const API_URL = '/api/v1/products/'

const getProducts = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.get(API_URL+'admin/', config)

    return response.data
}

const getProduct = async (id) => {
    const response = await axios.get(API_URL+'/detail/' + id.toString())
    return response.data
}
const filterAndGetProduct = async (catagory, page) => {
    const config = {
        params: { page: page },
    }
    const response = await axios.get(API_URL+catagory, config)
    return response.data
}

const searchProduct = async (keyword)=>{
    const config = {
        params:{keyword:keyword}
    }
    const response = await axios.get(API_URL+'search',config)
    return response.data
}

const productService = {
    filterAndGetProduct,
    getProduct,
    getProducts,
    searchProduct,
}

export default productService
