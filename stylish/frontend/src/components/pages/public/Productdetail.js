import React from 'react'
import { useParams } from 'react-router-dom'
import { Button, CardMedia, Grid, TextField } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { Box } from '@mui/system'
import { getProduct } from '../../../features/product/productSlice'
import { useEffect, useState } from 'react'
import { Alert, AlertTitle, Divider } from '@mui/material'
import {
    Dialog,
    Typography,
} from '@mui/material'
import { getCart } from '../../../features/order/orderSlice'
function Productdetail() {
    const dispatch = useDispatch()
    const { id } = useParams()
    const { products } = useSelector((s) => s.product)
    useEffect(() => {
        dispatch(getProduct(parseInt(id)))
    }, [dispatch])
    const [amount, setAmount] = useState(1)
    const handleAmountChange = (e) => {
        setAmount(e.target.value)
    }
    const [selectedColor, setSelectedColor] = useState('')
    const handleColorChange = (item) => {
        setSelectedColor(item)
        setSelectedSize('')
    }

    const [selectedSize, setSelectedSize] = useState('')

    const handleSizeChange = (size) => {
        setSelectedSize(size)
    }
    const [toastMessage, setToastMessage] = useState({
        open: false,
        severity: 'success',
        message: '',
    })
    const handleClose = (e) => {
        setToastMessage({ open: false, severity: 'success', message: '' })
    }
    const getRemain = () => {
        if (
            products === undefined ||
            products[0] === undefined ||
            products[0].stocks === undefined
        ) {
            return 0
        }
        if (selectedSize === '' || selectedColor === '') {
            return 0
        }
        const stocks = products[0].stocks
        let target = stocks.find(
            (e) =>
                e.size.toUpperCase() === selectedSize.toUpperCase() &&
                e.colorCode.toUpperCase() === selectedColor.toUpperCase()
        )
        return target.remain
    }
    const handleAddToCart = () => {
        if (!selectedColor) {
            setToastMessage({
                open: true,
                severity: 'error',
                message: '請選擇顏色',
            })
            return
        }
        if (!selectedSize) {
            setToastMessage({
                open: true,
                severity: 'error',
                message: '請選擇尺寸',
            })
            return
        }
        const purchaseAmount = parseInt(amount)
        if (!purchaseAmount || purchaseAmount === 0) {
            setToastMessage({
                open: true,
                severity: 'error',
                message: '數量不能為0',
            })
            return
        }
        const stocks = products[0].stocks
        let target = stocks.find(
            (e) =>
                e.size.toUpperCase() === selectedSize.toUpperCase() &&
                e.colorCode.toUpperCase() === selectedColor.toUpperCase()
        )
        if (!target) {
            setToastMessage({
                open: true,
                severity: 'error',
                message: '找不到存貨',
            })
            return
        }
        if (purchaseAmount > target.remain) {
            setToastMessage({
                open: true,
                severity: 'error',
                message: '存貨不足',
            })
            return
        }
        let cart = localStorage.getItem('cart')
        if (cart) {
            let data = JSON.parse(cart)
            let targetInCart = data.find((e) => e.id === target.id)
            if (targetInCart) {
                const inCartAmount = parseInt(targetInCart.amount)
                const stockAmount = parseInt(target.remain)
                if (inCartAmount + purchaseAmount > stockAmount) {
                    setToastMessage({
                        open: true,
                        severity: 'error',
                        message: '存貨不足',
                    })
                    return
                }

                let dataWithoutTarget = data.filter(
                    (e) => e.id !== targetInCart.id
                )

                data = [
                    ...dataWithoutTarget,
                    {
                        title: products[0].title,
                        totalPrice:
                            (purchaseAmount + inCartAmount) * target.price,
                        img: products[0].thumbnail,
                        amount: purchaseAmount + inCartAmount,
                        ...target,
                    },
                ]
                cart = JSON.stringify(data)
            } else {
                data = [
                    ...data,
                    {
                        title: products[0].title,
                        totalPrice: purchaseAmount * target.price,
                        img: products[0].thumbnail,
                        amount: purchaseAmount,
                        ...target,
                    },
                ]
                cart = JSON.stringify(data)
            }
        } else {
            cart = JSON.stringify([
                {
                    title: products[0].title,
                    totalPrice: purchaseAmount * target.price,
                    img: products[0].thumbnail,
                    amount: purchaseAmount,
                    ...target,
                },
            ])
        }
        localStorage.setItem('cart', cart)
        dispatch(getCart())
        setToastMessage({
            open: true,
            severity: 'success',
            message: '成功加入購物車!',
        })
    }
    return (
        <>
            {toastMessage.open ? (
                <Dialog open={toastMessage.open} onClose={handleClose}>
                    <Alert
                        severity={toastMessage.severity}
                        onClose={handleClose}
                    >
                        <AlertTitle>{toastMessage.severity}</AlertTitle>
                        <strong>{toastMessage.message}</strong>
                    </Alert>
                </Dialog>
            ) : (
                <></>
            )}
            <Grid
                container
                sx={{
                    justifyContent: 'center',
                    mt: '1%',
                    minHeight: '100vh',
                    mb: '1%',
                }}
            >
                <Grid
                    item
                    xs={6}
                    md={6}
                    lg={6}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            height: '100%',
                        }}
                    >
                        {products && products[0] ? (
                            <CardMedia
                                component="img"
                                sx={{ width: '60%', height: '20%' }}
                                image={'/' + products[0].thumbnail}
                            />
                        ) : (
                            <></>
                        )}
                        <Box
                            sx={{
                                backgroundColor: 'white',
                                width: '40%',
                                height: '30%',
                                display: 'flex',
                                flexDirection: 'column',
                                ml: '1%',
                            }}
                        >
                            {products && products[0] ? (
                                <Typography sx={{ fontSize: '32px' }}>
                                    {products[0].title}
                                </Typography>
                            ) : (
                                <></>
                            )}
                            {products && products[0]&&products[0].stocks&&products[0].stocks[0] ? (
                                <Typography sx={{ fontSize: '30px', mt: '5%' }}>
                                    TWD.{products[0].stocks[0].price}
                                </Typography>
                            ) : (
                                <></>
                            )}
                            <Divider
                                flexItem
                                sx={{
                                    backgroundColor: 'black',
                                    mt: '5%',
                                    mb: '5%',
                                }}
                                textAlign="left"
                                variant="middle"
                            />
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Typography sx={{ fontSize: '20px' }}>
                                    顏色 |
                                </Typography>
                                {products &&
                                products[0] &&
                                products[0].colors ? (
                                    products[0].colors.map((item, index) => {
                                        if (item === selectedColor)
                                            return (
                                                <Box
                                                    key={item + index}
                                                    value={item}
                                                    onClick={(e) =>
                                                        handleColorChange(item)
                                                    }
                                                    sx={{
                                                        backgroundColor:
                                                            '#' + item,
                                                        width: '24px',
                                                        height: '24px',
                                                        outline: '2px solid',
                                                        '&:hover': {
                                                            outline:
                                                                '2px solid #979797',
                                                        },
                                                    }}
                                                />
                                            )
                                        else
                                            return (
                                                <Box
                                                    key={item + index}
                                                    onClick={(e) =>
                                                        handleColorChange(item)
                                                    }
                                                    sx={{
                                                        backgroundColor:
                                                            '#' + item,
                                                        width: '24px',
                                                        height: '24px',
                                                        '&:hover': {
                                                            outline:
                                                                '2px solid #979797',
                                                        },
                                                    }}
                                                />
                                            )
                                    })
                                ) : (
                                    <></>
                                )}
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'row',mt:'5%',justifyContent: 'space-between', }}>
                                <Typography sx={{ flexGrow:'0.4', fontSize: '20px' }}>
                                    尺寸 |
                                </Typography>
                                {selectedColor &&
                                products &&
                                products[0] &&
                                products[0].stocks ? (
                                    <Box
                                        sx={{
                                            flexGrow:'1',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        {products[0].stocks
                                            .filter(
                                                (e) =>
                                                    e.colorCode ===
                                                    selectedColor
                                            )
                                            .map((item, index) =>
                                                selectedSize ===
                                                item.size.toUpperCase() ? (
                                                    <Box
                                                        flexItem
                                                        sx={{
                                                            borderRadius: '50%',
                                                            backgroundColor:
                                                                'black',
                                                            width: '34px',
                                                            height: '34px',
                                                            align: 'center',

                                                            '&:hover': {
                                                                outline:
                                                                    '2px solid #979797',
                                                            },
                                                        }}
                                                        key={index}
                                                        onClick={(e) =>
                                                            handleSizeChange(
                                                                item.size.toUpperCase()
                                                            )
                                                        }
                                                    >
                                                        <Typography
                                                            sx={{
                                                                color: 'white',
                                                                fontSize:
                                                                    '20px',
                                                                align: 'center',
                                                                textAlign:
                                                                    'center',
                                                            }}
                                                        >
                                                            {item.size.toUpperCase()}
                                                        </Typography>
                                                    </Box>
                                                ) : (
                                                    <Box
                                                        flexItem
                                                        sx={{
                                                            borderRadius: '50%',
                                                            backgroundColor:
                                                                '#ececec',
                                                            width: '34px',
                                                            height: '34px',
                                                            align: 'center',

                                                            '&:hover': {
                                                                outline:
                                                                    '2px solid #979797',
                                                            },
                                                           
                                                        }}
                                                        onClick={(e) =>
                                                            handleSizeChange(
                                                                item.size.toUpperCase()
                                                            )
                                                        }
                                                        key={index}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                fontSize:
                                                                    '20px',
                                                                align: 'center',
                                                                textAlign:
                                                                    'center',
                                                            }}
                                                        >
                                                            {item.size.toUpperCase()}
                                                        </Typography>
                                                    </Box>
                                                )
                                            )}
                                    </Box>
                                ) : (
                                    <></>
                                )}
                            </Box>
                            <TextField
                                onChange={handleAmountChange}
                                onBlur={handleAmountChange}
                                id="filled-number"
                                label="數量"
                                type="number"
                                sx={{mt:'5%'}}
                                defaultValue={1}
                                InputProps={{
                                    inputProps: {
                                        min: 1,
                                        max: getRemain(),
                                    },
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="filled"
                            />
                            <Button
                                sx={{
                                    mt:'3%',
                                    backgroundColor: 'black',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#696969',
                                        boxShadow: 'none',
                                    },
                                }}
                                onClick={handleAddToCart}
                            >
                                <Typography> 加入購物車</Typography>
                            </Button>
                            {products && products[0] ? (
                                <Typography
                                    sx={{
                                        flexGrow: '1',
                                        wordBreak: 'break-all',
                                        mt: '5%',
                                    }}
                                >
                                    {products[0].component}
                                </Typography>
                            ) : (
                                <></>
                            )}
                        </Box>
                    </Box>

                    <Divider
                        flexItem
                        sx={{ backgroundColor: 'black', mt: '5%' }}
                        variant="middle"
                        textAlign="left"
                    />

                    {products && products[0] && products[0].productDetails ? (
                        products[0].productDetails.map((item) => (
                            <Box sx={{ mt: '3%' }} key={item.id}>
                                <Typography sx={{ wordBreak: 'break-all' }}>
                                    {item.text}
                                </Typography>
                                <CardMedia
                                    sx={{ mt: '1%' }}
                                    component="img"
                                    image={'/' + item.img}
                                />
                            </Box>
                        ))
                    ) : (
                        <></>
                    )}
                </Grid>
            </Grid>
        </>
    )
}

export default Productdetail
