import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import productService from './productService'
const initialState = {
    products: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
}
export const getProduct = createAsyncThunk(
    'product/getOne',
    async (id, thunkAPI) => {
        try {
            
            return await productService.getProduct(id)
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)


export const filterAndGetProduct = createAsyncThunk(
    'product/filterAndGetProduct',
    async (data, thunkAPI) => {
        try {
            return await productService.filterAndGetProduct(
                data.catagory,
                data.page
            )
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const getProducts = createAsyncThunk(
    'product/get',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await productService.getProducts(token)
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const searchProduct = createAsyncThunk(
    'product/search',
    async (keyword, thunkAPI) => {
        try {
            return await productService.searchProduct(keyword)
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        reset: (state) => initialState,
        changeOrderAmount: (state, action) => {
            const { id, amount } = action.payload
            const target = state.products.findIndex((e) => e.id === id)
            state.products[target].amount = amount
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state) => {
                state.isError = false
                state.isLoading = true
                state.isSuccess = false
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.isError = true
                state.isLoading = false
                state.isSuccess = false
                state.message = action.payload
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.isError = false
                state.isLoading = false
                state.isSuccess = true
                state.products = action.payload
            })
            .addCase(getProduct.pending, (state) => {
                state.isError = false
                state.isLoading = true
                state.isSuccess = false
            })
            .addCase(getProduct.rejected, (state, action) => {
                state.isError = true
                state.isLoading = false
                state.isSuccess = false
                state.message = action.payload
            })
            .addCase(getProduct.fulfilled, (state, action) => {
                state.isError = false
                state.isLoading = false
                state.isSuccess = true
                state.products = action.payload
            })
            .addCase(filterAndGetProduct.pending, (state) => {
                state.isError = false
                state.isLoading = true
                state.isSuccess = false
            })
            .addCase(filterAndGetProduct.rejected, (state, action) => {
                state.isError = true
                state.isLoading = false
                state.isSuccess = false
                state.message = action.payload
            })
            .addCase(filterAndGetProduct.fulfilled, (state, action) => {
                state.isError = false
                state.isLoading = false
                state.isSuccess = true
                state.products = action.payload
            })
            .addCase(searchProduct.pending, (state) => {
                state.isError = false
                state.isLoading = true
                state.isSuccess = false
            })
            .addCase(searchProduct.rejected, (state, action) => {
                state.isError = true
                state.isLoading = false
                state.isSuccess = false
                state.message = action.payload
            })
            .addCase(searchProduct.fulfilled, (state, action) => {
                state.isError = false
                state.isLoading = false
                state.isSuccess = true
                state.products = action.payload
            })
    },
})

export const { reset, changeOrderAmount } = productSlice.actions
export default productSlice.reducer
