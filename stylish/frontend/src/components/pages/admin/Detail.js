import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import { getProduct, reset } from '../../../features/product/productSlice'
import {
    addStock,
    removeStock,
    addDetail,
    removeDetail,
} from '../../../features/admin/adminSlice'
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Button,
    Box,
    Typography,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    DialogActions,
    TextField,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
function Detail() {
    const [thumbnail, setThumbnail] = useState(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    let { id } = useParams()
    id = parseInt(id)
    const { products, isLoading, isError, message } = useSelector(
        (state) => state.product
    )

    const [inputField, setInputField] = useState({
        colorName: 'white',
        colorCode: 'FFFFFF',
        remain: 0,
        price: 0,
    })
    const [detial, setDetail] = useState({
        text: '',
        order: 0,
    })
    const [size, setSize] = useState('M')
    const handleFormChange = (event) => {
        let data = inputField
        data[event.target.name] = event.target.value
        setInputField(data)
    }
    const handleDetailChange = (event) => {
        let data = detial
        data[event.target.name] = event.target.value
        setDetail(data)
    }
    const changeSize = (e) => {
        setSize(e.target.value)
    }
    const removeField = (sid, e) => {
        e.preventDefault()
        dispatch(removeStock(sid)).then((res) => dispatch(getProduct(id)))
    }
    const onRemoveDetail = (sid, e) => {
        e.preventDefault()
        dispatch(removeDetail(sid)).then((res) => dispatch(getProduct(id)))
    }
    const onAddStock = (e) => {
        e.preventDefault()
        const payload = { ...inputField, size, productId: id }
        dispatch(addStock(payload)).then((res) => {
            setStockOpen(false)
            dispatch(getProduct(id))
        })
    }
    const onAddDetail = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('text', detial.text)
        formData.append('order', detial.order)
        formData.append('img', thumbnail)
        formData.append('productId', id)
        dispatch(addDetail(formData)).then((res) => {
            setDetailOpen(false)
            setThumbnail(null)
            dispatch(getProduct(id))
        })
    }
    const { user } = useSelector((state) => state.auth)
    useEffect(() => {
        if (isError) {
            console.log(message)
        }
        if (!user) {
            navigate('/login')
        }
        dispatch(getProduct(id))

        return () => {
            dispatch(reset())
        }
    }, [dispatch, isError, message, user])

    const columns = [
        {
            field: 'order',
            headerName: 'order',
        },
        {
            field: 'img',
            headerName: 'img',
            renderCell: (params) => (
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Box
                        component="img"
                        sx={{ width: '300', height: '300px', flexGrow: 1 }}
                        src={'/' + params.value}
                    />
                </Box>
            ),
            flex: 1,
        },
        {
            flex: 1,
            field: 'text',
            headerName: 'text',
        },
        {
            field: 'action',
            headerName: '',
            sortable: false,
            renderCell: (params) => {
                return (
                    <>
                        <Button onClick={(e) => onRemoveDetail(params.id, e)}>
                            <DeleteIcon />
                        </Button>
                    </>
                )
            },
        },
    ]
    const stockColumns = [
        {
            field: 'id',
            headerName: 'id',
            flex: 1,
        },
        {
            flex: 1,
            field: 'size',
            headerName: 'size',
        },
        {
            flex: 1,
            field: 'colorName',
            headerName: 'colorName',
        },
        {
            flex: 1,
            field: 'colorCode',
            headerName: 'colorCode',
            renderCell: (params) => {
                return (
                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        <Box
                            sx={{
                                backgroundColor: '#' + params.row.colorCode,
                                width: '24px',
                                height: '24px',
                            }}
                        />
                        <Box>{params.row.colorCode}</Box>
                    </Box>
                )
            },
        },
        {
            flex: 1,
            field: 'price',
            headerName: 'price',
        },
        {
            flex: 1,
            field: 'remain',
            headerName: 'remain',
        },
        {
            field: 'action',
            headerName: '',
            sortable: false,
            renderCell: (params) => {
                return (
                    <>
                        <Button onClick={(e) => removeField(params.id, e)}>
                            <DeleteIcon />
                        </Button>
                    </>
                )
            },
        },
    ]
    const [stockOpen, setStockOpen] = useState(false)
    const [detailOpen, setDetailOpen] = useState(false)

    const handleClose = () => {
        setStockOpen(false)
        setDetailOpen(false)
    }
    if (isLoading) {
        return <div>loading</div>
    }
    return (
        <Box>
            <Dialog open={detailOpen} onClose={(e) => handleClose()}>
                <DialogTitle>Create Detail</DialogTitle>
                <DialogContent>
                    <DialogContentText></DialogContentText>
                    <TextField
                        type="file"
                        name="myImage"
                        onChange={(event) => {
                            console.log(event.target.files[0])
                            setThumbnail(event.target.files[0])
                        }}
                    />

                    <TextField
                        type="text"
                        name="text"
                        placeholder="description"
                        onChange={handleDetailChange}
                        required
                    />
                    <TextField
                        name="order"
                        placeholder="order"
                        type="number"
                        min={0}
                        onChange={handleDetailChange}
                        required
                    />
                    <DialogActions>
                        <Button onClick={handleClose}>Cancle</Button>
                        <Button onClick={(e) => onAddDetail(e)}>Create</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
            <Dialog open={stockOpen} onClose={(e) => handleClose()}>
                <DialogTitle>Create Stock</DialogTitle>
                <DialogContent>
                    <DialogContentText></DialogContentText>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                            SIZE
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={size}
                            label="SIZE"
                            onChange={(e) => changeSize(e)}
                            onBlur={(e) => changeSize(e)}
                        >
                            <MenuItem value="XXS">XXS</MenuItem>
                            <MenuItem value="XS">XS</MenuItem>
                            <MenuItem value="S">S</MenuItem>
                            <MenuItem value="M">M</MenuItem>
                            <MenuItem value="L">L</MenuItem>
                            <MenuItem value="XL">XL</MenuItem>
                            <MenuItem value="XXL">XXL</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        type="text"
                        name="colorName"
                        placeholder="colorName"
                        onChange={handleFormChange}
                        required
                    />
                    <TextField
                        type="text"
                        name="colorCode"
                        placeholder="colorCode"
                        onChange={handleFormChange}
                        required
                        pattern="[a-fA-F0-9]{6}"
                    />
                    <TextField
                        type="number"
                        name="price"
                        placeholder="price"
                        required
                        min={0}
                        onChange={handleFormChange}
                    />
                    <TextField
                        name="remain"
                        placeholder="remain"
                        type="number"
                        min={0}
                        onChange={handleFormChange}
                        required
                    />
                    <DialogActions>
                        <Button onClick={handleClose}>Cancle</Button>
                        <Button onClick={(e) => onAddStock(e)}>Create</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
            <Link to="/admin/dashboard">back</Link>
            {products && products[0] ? (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h3">{products[0].title}</Typography>
                    <Typography variant="h5">{products[0].catagory}</Typography>
                </Box>
            ) : (
                <div>error</div>
            )}
            <Button onClick={(e) => setDetailOpen(true)}>Add Detail</Button>
            {products &&
            products[0] &&
            products[0].productDetails &&
            products[0].productDetails[0] ? (
                <DataGrid
                    rows={products[0].productDetails}
                    columns={columns}
                    autoHeight
                    rowHeight={300}
                />
            ) : (
                <></>
            )}
            <Button onClick={(e) => setStockOpen(true)}>Add Stock</Button>
            {products &&
            products[0] &&
            products[0].stocks &&
            products[0].stocks[0] ? (
                <DataGrid
                    autoHeight
                    rows={products[0].stocks}
                    columns={stockColumns}
                />
            ) : (
                <></>
            )}
        </Box>
    )
}

export default Detail
