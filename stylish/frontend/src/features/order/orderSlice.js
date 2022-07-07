import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import orderService from './orderService'
const orders = JSON.parse(localStorage.getItem('cart'))
const initialState = {
    orders: orders ? orders : [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
}

export const getHistory = createAsyncThunk(
    'order/getHistory',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await orderService.getHistory(token)
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

export const updateRemain = createAsyncThunk(
    'order/updateRemain',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            const data =
                thunkAPI.getState().order.orders &&
                thunkAPI.getState().order.orders.length !== 0
                    ? thunkAPI.getState().order.orders
                    : JSON.parse(localStorage.getItem('cart'))
            if (!data || data.length === 0) {
                return Promise.resolve([])
            }
            return await orderService.getStocksById(data, token)
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
export const sendCart = createAsyncThunk(
    'product/sendCart',
    async (info, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            const cart = thunkAPI.getState().order.orders
            const data = { ...info, cart }
            return await orderService.sendCart(data, token)
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

export const sendPrimeAndPay = createAsyncThunk(
    'product/sendPrime',
    async (data, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await orderService.sendPrimeAndPay(data, token)
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

function removeOrderReducer(state, action) {
    const { id } = action.payload
    const data = state.orders
    if (!id || !data || data === []) {
        return state
    }
    state.orders = data.filter((e) => e.id !== id)

    localStorage.setItem('cart', JSON.stringify(state.orders))

    return state
}
function updateAmountReducer(state, action) {
    const { id, amount } = action.payload
    const data = state.orders
    if (!id || !data || data === [] || !amount) {
        return state
    }
    const updated = data.find((e) => e.id === id)
    updated.amount = amount
    state.orders = data.map((e) => (e.id === id ? updated : e))
    localStorage.setItem('cart', JSON.stringify(state.orders))
    return state
}

function getCartReducer(state) {
    let cart = JSON.parse(localStorage.getItem('cart'))
    state.orders = cart ? cart : []
}
function wipeCartReducer(state) {
    localStorage.removeItem('cart')
    state = initialState
}
export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        reset: (state) => (state = initialState),
        clearOrder: (state) => {
            localStorage.removeItem('cart')
            return initialState
        },
        removeOrder: removeOrderReducer,
        getCart: getCartReducer,
        wipeCart: wipeCartReducer,
        updateAmount: updateAmountReducer,
        changeOrderAmount: (state, action) => {
            const { id, amount } = action.payload
            const target = state.products.findIndex((e) => e.id === id)
            state.orders[target].amount = amount
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getHistory.pending, (state) => {
                state.isError = false
                state.isLoading = true
                state.isSuccess = false
            })
            .addCase(getHistory.rejected, (state, action) => {
                state.isError = true
                state.isLoading = false
                state.isSuccess = false
                state.message = action.payload
            })
            .addCase(getHistory.fulfilled, (state, action) => {
                state.isError = false
                state.isLoading = false
                state.isSuccess = true
                state.orders = action.payload
            })
            .addCase(updateRemain.pending, (state) => {
                state.isError = false
                state.isLoading = true
                state.isSuccess = false
            })
            .addCase(updateRemain.rejected, (state, action) => {
                state.isError = true
                state.isLoading = false
                state.isSuccess = false
                state.message = action.payload
            })
            .addCase(updateRemain.fulfilled, (state, action) => {
                state.isError = false
                state.isLoading = false
                state.isSuccess = true
                state.orders = action.payload
                localStorage.setItem('cart', JSON.stringify(action.payload))
            })
            .addCase(sendCart.pending, (state) => {
                state.isError = false
                state.isLoading = true
                state.isSuccess = false
            })
            .addCase(sendCart.rejected, (state, action) => {
                state.isError = true
                state.isLoading = false
                state.isSuccess = false
                state.message = action.payload
            })
            .addCase(sendCart.fulfilled, (state, action) => {
                state.isError = false
                state.isLoading = false
                state.isSuccess = true
                state.message = action.payload
            })
            .addCase(sendPrimeAndPay.pending, (state) => {
                state.isError = false
                state.isLoading = true
                state.isSuccess = false
            })
            .addCase(sendPrimeAndPay.rejected, (state, action) => {
                state.isError = true
                state.isLoading = false
                state.isSuccess = false
                state.message = action.payload
            })
            .addCase(sendPrimeAndPay.fulfilled, (state, action) => {
                state.isError = false
                state.isLoading = false
                state.isSuccess = true
                state.message = action.payload
            })
    },
})

export const {
    reset,
    removeOrder,
    updateAmount,
    getCart,
    wipeCart,
} = orderSlice.actions
export default orderSlice.reducer
