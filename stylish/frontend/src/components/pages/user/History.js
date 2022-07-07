import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Box } from '@mui/material'

import { getHistory, reset } from '../../../features/order/orderSlice'
function History() {
    const navigate = useNavigate()
    const { orders, message, isError, isLoading } = useSelector(
        (state) => state.order
    )
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
        dispatch(getHistory())
        return () => {
            dispatch(reset())
        }
    }, [dispatch, message, isError])
    const columns = [
        { field: 'id', headerName: 'ID', flex: 1 },
        { field: 'amount', headerName: 'Total', flex: 1 },
        {
            field: 'bank_transaction_id',
            headerName: 'bank_transaction_id',
            flex: 1,
        },
        { field: 'paymentStatus', headerName: 'paymentStatus', flex: 1 },

        { field: 'paymentMsg', headerName: 'paymentMsg', flex: 1 },
        { field: 'paid', headerName: 'paid', flex: 1 },
    ]
    if (isLoading) return <div>loading</div>
    return (
        <Box sx={{minHeight: '100vh'}}>
            {orders ? (
                <DataGrid autoHeight rows={orders} columns={columns} />
            ) : (
                <></>
            )}
        </Box>
    )
}

export default History
