import React, { useState } from 'react'
import { Grid, Box, Button, Card, FormLabel, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import cartRemove from '../../../asset/cart-remove.png'
import TextField from '@mui/material/TextField'
import {
    updateAmount,
    removeOrder,
    updateRemain,
    sendCart,
    reset,
} from '../../../features/order/orderSlice'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Divider from '@mui/material/Divider'
const MatEdit = ({ params }) => {
    const dispatch = useDispatch()
    const handleChange = (e) => {
        dispatch(updateAmount({ id: params.row.id, amount: e.target.value }))
    }
    return (
        <TextField
            defaultValue={params.row.amount}
            InputProps={{ inputProps: { min: 1, max: params.row.remain } }}
            onChange={handleChange}
            type="number"
        />
    )
}

function Usercart() {
    const dispatch = useDispatch()
    const { orders } = useSelector((s) => s.order)
    const { user } = useSelector((s) => s.auth)
    const [inputs, setInputs] = useState({
        delivery: 'TW',
        payment: 'card',
        name: '',
        phone: '',
        address: '',
    })
    const handleChange = (e) => {
        let data = inputs
        data[e.target.name] = e.target.value
        setInputs(data)
    }
    const navigate = useNavigate()
    const handleSubmit = (e) => {
        e.preventDefault()
        if (Object.values(inputs).findIndex((e) => !e || e === '') !== -1) {
            alert('Please fill all the fields in the form.')
            return
        }
        dispatch(sendCart(inputs)).then((res) => navigate('/user/pay'))
    }
    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
        dispatch(updateRemain())
        return () => dispatch(reset())
    }, [dispatch])

    const columns = [
        {
            field: 'img',
            headerName: '購物車',
            flex: 1,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Box
                        component="img"
                        sx={{ width: '114px', height: '151px', flexGrow: 1 }}
                        src={'/' + params.value}
                    />
                </Box>
            ),
        },
        {
            field: 'title',
            headerName: '',
            flex: 1,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box>{params.row.title}</Box>
                    <Box>{params.row.id}</Box>
                    <Box>顏色| {params.row.colorName.toUpperCase()}</Box>
                    <Box>尺寸| {params.row.size.toUpperCase()}</Box>
                </Box>
            ),
        },
        {
            flex: 1,
            field: 'actions',
            headerName: '數量',
            sortable: false,
            disableClickEventBubbling: true,
            renderCell: (params) => {
                return (
                    <div>
                        <MatEdit params={params} />
                    </div>
                )
            },
        },
        {
            flex: 1,
            field: 'price',
            headerName: '單價',

            renderCell: (params) => {
                return <Box>NT.{params.value}</Box>
            },
        },
        {
            flex: 1,
            field: 'totalPrice',
            headerName: '小計',

            renderCell: (params) => {
                return <Box>NT.{params.row.amount * params.row.price}</Box>
            },
        },
        {
            flex: 1,
            field: 'action',
            headerName: '',
            sortable: false,

            renderCell: (params) => {
                const onClick = (e) => {
                    dispatch(removeOrder({ id: params.row.id }))
                }

                return (
                    <Button onClick={onClick}>
                        <Box component="img" src={cartRemove} />
                    </Button>
                )
            },
        },
    ]
    return (
        <Grid container sx={{justifyContent: 'center', minHeight: '100vh' }}>
            <Grid
                item
                xs={8}
                md={6}
                lg={6}
                sx={{ display: 'flex', flexDirection: 'column' }}
            >
                {orders ? (
                    <DataGrid
                    sx={{ mt:'3%',}}
                        rowHeight={150}
                        experimentalFeatures={{ newEditingApi: true }}
                        autoHeight
                        columns={columns}
                        rows={orders}
                    />
                ) : (
                    <></>
                )}
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Card>
                        <Box
                            sx={{
                                backgroundColor: '#e8e8e8',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'row-start',
                                mt: '2%',
                                alighSelf: 'center',
                            }}
                        >
                            <FormLabel sx={{ alignSelf: 'center', ml: '3%' }}>
                                <Typography>送達國家</Typography>
                            </FormLabel>
                            <Select
                                sx={{ ml: '3%' }}
                                name="delivery"
                                defaultValue={'TW'}
                                onChange={(e) => handleChange(e)}
                            >
                                <MenuItem value={'TW'}>
                                    <Typography>台灣及離島</Typography>
                                </MenuItem>
                                <MenuItem value={'others'}>
                                    <Typography>其他</Typography>
                                </MenuItem>
                            </Select>
                            <FormLabel sx={{ ml: '15%', alignSelf: 'center' }}>
                                付款方式
                            </FormLabel>
                            <Select
                                sx={{ ml: '3%' }}
                                name="payment"
                                onChange={(e) => handleChange(e)}
                                defaultValue="card"
                            >
                                <MenuItem value={'card'}>
                                    <Typography>信用卡</Typography>
                                </MenuItem>
                            </Select>
                        </Box>
                    </Card>
                    <Typography sx={{ mt: '1%', mb: '1%' }}>
                        ※ 提醒您： ●
                        選擇宅配-請填寫正確收件人資訊，避免包裹配送不達 ●
                        選擇超商-請填寫正確收件人姓名(與證件相符)，避免無法領取
                    </Typography>
                    <Typography sx={{fontWeight:'bold'}}>訂購資料</Typography>
                    <Divider
                                flexItem
                                sx={{ backgroundColor: 'black' ,mb:'1%',mt:'1%'}}
                                
                            />
                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        <FormLabel sx={{ width: '100px' }}>
                            收件人姓名
                        </FormLabel>
                        <TextField
                            name="name"
                            onChange={(e) => handleChange(e)}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        <FormLabel sx={{ width: '100px' }}>手機</FormLabel>
                        <TextField
                            name="phone"
                            onChange={(e) => handleChange(e)}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        <FormLabel sx={{ width: '100px' }}>地址</FormLabel>
                        <TextField
                            name="address"
                            onChange={(e) => handleChange(e)}
                        />
                    </Box>

                    {orders && orders !== [] ? (
                        <Box
                            sx={{
                                width: '30%',
                                ml: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                mb: '5%',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '16px',
                                    }}
                                >
                                    總金額
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '16px',
                                        ml: 'auto',
                                    }}
                                >
                                    NT.
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '30px',
                                        ml: '5%',
                                        textAlign: 'right',
                                    }}
                                >
                                    {orders.reduce((a, b) => {
                                        return a + b.amount * b.price
                                    }, 0)}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '16px',
                                    }}
                                >
                                    運費
                                </Typography>
                                <Typography
                                    sx={{
                                        ml: 'auto',
                                        fontSize: '16px',
                                    }}
                                >
                                    NT.
                                </Typography>
                                <Typography
                                    sx={{
                                        ml: '5%',
                                        fontSize: '30px',
                                    }}
                                >
                                    30
                                </Typography>
                            </Box>
                            <Divider
                                flexItem
                                sx={{ backgroundColor: 'black' }}
                                variant="middle"
                            />
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    mb: '5%',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '16px',
                                    }}
                                >
                                    應付金額
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '16px',
                                        ml: 'auto',
                                    }}
                                >
                                    NT.
                                </Typography>
                                <Typography
                                    sx={{
                                        ml: '5%',
                                        fontSize: '30px',
                                    }}
                                >
                                    {orders.reduce((a, b) => {
                                        return a + b.amount * b.price
                                    }, 30)}
                                </Typography>
                            </Box>
                            <Button
                                sx={{
                                    backgroundColor: 'black',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#696969',
                                        boxShadow: 'none',
                                    },
                                }}
                                onClick={handleSubmit}
                            >
                                <Typography>確認付款</Typography>
                            </Button>
                        </Box>
                    ) : (
                        <></>
                    )}
                </Box>
            </Grid>
        </Grid>
    )
}

export default Usercart
