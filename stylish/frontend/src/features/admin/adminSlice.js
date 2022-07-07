import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import adminService from './adminService'
const initialState = {
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
}
export const addDetail = createAsyncThunk(
    'admin/addDetail',
    async (payload, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await adminService.addDetail(payload, token)
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
export const removeDetail = createAsyncThunk(
    'admin/removeDetail',
    async (did, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await adminService.removeDetail(did, token)
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
export const addStock = createAsyncThunk(
    'admin/addStock',
    async (payload, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await adminService.addStock(payload, token)
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
export const removeStock = createAsyncThunk(
    'admin/removeStock',
    async (sid, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await adminService.removeStock(sid, token)
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

export const createProduct = createAsyncThunk(
    'admin/create',
    async (adminData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await adminService.createProduct(adminData, token)
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

export const loadExample = createAsyncThunk(
    'admin/loadExample',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await adminService.loadExample(token)
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
export const removeProduct = createAsyncThunk(
    'admin/removeProduct',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await adminService.removeProduct(id, token)
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

export const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(createProduct.pending, (state) => {
                state.isError = false
                state.isLoading = true
                state.isSuccess = false
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.isError = true
                state.isLoading = false
                state.isSuccess = false
                state.message = action.payload
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.isError = false
                state.isLoading = false
                state.isSuccess = true
                state.message = action.payload
            })
            .addCase(addStock.pending, (state) => {
                state.isError = false
                state.isLoading = true
                state.isSuccess = false
            })
            .addCase(addStock.rejected, (state, action) => {
                state.isError = true
                state.isLoading = false
                state.isSuccess = false
                state.message = action.payload
            })
            .addCase(addStock.fulfilled, (state, action) => {
                state.isError = false
                state.isLoading = false
                state.isSuccess = true
                state.message = action.payload
            })
            .addCase(removeStock.pending, (state) => {
                state.isError = false
                state.isLoading = true
                state.isSuccess = false
            })
            .addCase(removeStock.rejected, (state, action) => {
                state.isError = true
                state.isLoading = false
                state.isSuccess = false
                state.message = action.payload
            })
            .addCase(removeStock.fulfilled, (state, action) => {
                state.isError = false
                state.isLoading = false
                state.isSuccess = true
                state.message = action.payload
            })
            .addCase(addDetail.pending, (state) => {
                state.isError = false
                state.isLoading = true
                state.isSuccess = false
            })
            .addCase(addDetail.rejected, (state, action) => {
                state.isError = true
                state.isLoading = false
                state.isSuccess = false
                state.message = action.payload
            })
            .addCase(addDetail.fulfilled, (state, action) => {
                state.isError = false
                state.isLoading = false
                state.isSuccess = true
                state.message = action.payload
            })
            .addCase(removeDetail.pending, (state) => {
                state.isError = false
                state.isLoading = true
                state.isSuccess = false
            })
            .addCase(removeDetail.rejected, (state, action) => {
                state.isError = true
                state.isLoading = false
                state.isSuccess = false
                state.message = action.payload
            })
            .addCase(removeDetail.fulfilled, (state, action) => {
                state.isError = false
                state.isLoading = false
                state.isSuccess = true
                state.message = action.payload
            })
            .addCase(loadExample.pending, (state) => {
                state.isError = false
                state.isLoading = true
                state.isSuccess = false
            })
            .addCase(loadExample.rejected, (state, action) => {
                state.isError = true
                state.isLoading = false
                state.isSuccess = false
                state.message = action.payload
            })
            .addCase(loadExample.fulfilled, (state, action) => {
                state.isError = false
                state.isLoading = false
                state.isSuccess = true
                state.message = action.payload
            })
            .addCase(removeProduct.pending, (state) => {
                state.isError = false
                state.isLoading = true
                state.isSuccess = false
            })
            .addCase(removeProduct.rejected, (state, action) => {
                state.isError = true
                state.isLoading = false
                state.isSuccess = false
                state.message = action.payload
            })
            .addCase(removeProduct.fulfilled, (state, action) => {
                state.isError = false
                state.isLoading = false
                state.isSuccess = true
                state.message = action.payload
            })
    },
})

export const { reset } = adminSlice.actions
export default adminSlice.reducer
