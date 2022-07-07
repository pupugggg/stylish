import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { reset, getProducts } from '../../../features/product/productSlice'
import {
    removeProduct,
    loadExample,
    createProduct,
} from '../../../features/admin/adminSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'material-react-toastify'
import { Box, Button, DialogActions } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import {
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    DialogContent,
    DialogContentText,
} from '@mui/material'
function Dashboard() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {
        products: { products },
        isLoading,
        isError,
        message,
    } = useSelector((state) => state.product)
    const { user } = useSelector((state) => state.auth)
    useEffect(() => {
        if (isError) {
            console.log(message)
        }
        if (!user) {
            toast.error('You have not login')
            navigate('/login')
        }
        dispatch(getProducts())
        return () => {
            dispatch(reset())
        }
    }, [dispatch, navigate, user, message, isError])
    const onClickLoadExample = (e) => {
        e.preventDefault()
        dispatch(loadExample()).then((res) => dispatch(getProducts()))
    }

    const onClickEdit = (e, id) => {
        e.preventDefault()
        navigate(`/admin/detail/${id}`)
    }
    const onRemoveProduct = (e, id) => {
        e.preventDefault()
        dispatch(removeProduct(id)).then((res) => dispatch(getProducts()))
    }

    const columns = [
        {
            field: 'id',
            headerName: 'id',
            flex: 1,
        },
        {
            field: 'thumbnail',
            headerName: 'thumbnail',
            renderCell: (params) => (
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Box
                        component="img"
                        sx={{ width: '114px', height: '151px', flexGrow: 1 }}
                        src={'/' + params.value}
                    />
                </Box>
            ),
            flex: 1,
        },
        {
            field: 'title',
            headerName: 'title',
        },
        {
            flex: 1,
            field: 'catagory',
            headerName: 'catagory',
        },
        {
            flex: 1,
            field: 'action',
            headerName: '',
            sortable: false,
            renderCell: (params) => {
                return (
                    <>
                        <Button onClick={(e) => onClickEdit(e, params.id)}>
                            <EditIcon />
                        </Button>
                        <Button onClick={(e) => onRemoveProduct(e, params.id)}>
                            <DeleteIcon />
                        </Button>
                    </>
                )
            },
        },
    ]
    const [thumbnail, setThumbnail] = useState(null)
    const [inputField, setInputField] = useState({
        title: '',
        component: '',
        file: null,
    })
    const [open, setOpen] = React.useState(false)
    const [catagory, setCatagory] = useState('men')
    const changeCata = (e) => {
        setCatagory(e.target.value)
    }
    const handleFormChange = (event) => {
        let data = inputField
        data[event.target.name] = event.target.value
        setInputField(data)
    }
    const onAddProduct = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('title', inputField.title)
        formData.append('thumbnail', thumbnail)
        formData.append('component', inputField.component)
        formData.append('catagory', catagory)
        dispatch(createProduct(formData)).then((res) => {
            handleClose()
            dispatch(getProducts())
        })
    }

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }
    if (isLoading) {
        return <div>Loading</div>
    }
    return (
        <Box sx={{ minHeight: '100vh' }}>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create Product</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        If you want to modify stock, please go to detail page by
                        clicking editing Icon.
                    </DialogContentText>
                    <TextField
                        type="file"
                        name="pic"
                        onChange={(e) => setThumbnail(e.target.files[0])}
                        required
                    />
                    <TextField
                        type="text"
                        name="title"
                        placeholder="title"
                        required
                        onChange={handleFormChange}
                    />
                    <TextField
                        type="text"
                        name="component"
                        placeholder="component(optional)"
                        onChange={handleFormChange}
                    />

                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                            Catagory
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={catagory}
                            label="Catagory"
                            onChange={(e) => changeCata(e)}
                            onBlur={(e) => changeCata(e)}
                        >
                            <MenuItem value="men">men</MenuItem>
                            <MenuItem value="women">women</MenuItem>
                            <MenuItem value="accessories">accessories</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancle</Button>
                    <Button onClick={(e) => onAddProduct(e)}>ADD</Button>
                </DialogActions>
            </Dialog>
            <button onClick={(e) => handleClickOpen()}>Create Product</button>
            <button onClick={(e) => onClickLoadExample(e)}>RESET DEMO</button>
            {products ? (
                <DataGrid autoHeight columns={columns} rows={products} />
            ) : (
                <></>
            )}
        </Box>
    )
}

Dashboard.propTypes = {}

export default Dashboard
