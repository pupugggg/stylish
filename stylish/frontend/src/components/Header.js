import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import { FormControl, Input, Menu, MenuItem } from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import logo from '../asset/logo.png'
import member from '../asset/member.png'
import search from '../asset/search.png'
import cart from '../asset/cart.png'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import { Alert, Dialog, AlertTitle } from '@mui/material'
import { useState } from 'react'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import { Typography } from '@mui/material'
const pages = ['男裝', '|', '女裝', '|', '飾品']

const ResponsiveAppBar = () => {
    const [toastMessage, setToastMessage] = useState({
        open: false,
        severity: 'success',
        message: 'Logout success',
    })
    const { user } = useSelector((s) => s.auth)
    const admin = useSelector((s) => s.admin)
    const product = useSelector((s) => s.product)
    const auth = useSelector((s) => s.auth)
    const order = useSelector((s) => s.order)
    const handleClose = (e) => {
        setToastMessage({
            open: false,
            severity: 'success',
            message: 'Logout success',
        })
    }
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [keyword, setKeyword] = useState('')
    const handleInputChange = (e) => {
        setKeyword(e.target.value)
        console.log(keyword)
    }
    const handleSearchClick = () => {
        if (keyword === '' || keyword == null) {
            return
        }
        navigate('/search/' + keyword)
    }
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const navigateToAuth = () => {
        if (user) {
            dispatch(logout()).then((res) => navigate('/'))
            setToastMessage({
                open: true,
                severity: 'success',
                message: 'Logout success',
            })
        } else {
            navigate('/login')
        }
        handleMenuClose()
    }
    const handleMenuClose = () => {
        setAnchorEl(null)
    }
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleCloseNavMenu = (e, idx) => {
        switch (pages[idx]) {
            case '男裝':
                navigate('/main/men')
                return
            case '女裝':
                navigate('/main/women')
                return
            case '飾品':
                navigate('/main/accessories')
                return
            default:
                return
        }
    }

    return (
        <AppBar
            position="sticky"
            sx={{ backgroundColor: '#fff', height: '5%' }}
        >
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
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Backdrop
                    sx={{
                        color: '#fff',
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                    }}
                    open={
                        admin.isLoading ||
                        auth.isLoading ||
                        product.isLoading ||
                        order.isLoading
                    }
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        flexDirection: 'row',
                        position: 'relative',
                    }}
                >
                    <Box
                        component="img"
                        sx={{
                            alignSelf: 'center',
                            width: '13%',
                            height: '48%',
                            mr: '5%',
                            ml: '1.3%',
                        }}
                        onClick={(e) => navigate('/')}
                        alt="logo"
                        src={logo}
                    />

                    {pages.map((page, idx) =>
                        idx % 2 === 0 ? (
                            <Button
                                key={idx}
                                onClick={(e) => handleCloseNavMenu(e, idx)}
                                sx={{
                                    color: 'black',
                                    display: 'block',
                                    fontFamily: 'PingFangTC',
                                    fontSize: '20px',
                                }}
                            >
                                <Typography sx={{ fontSize: '20px' }}>
                                    {' '}
                                    {page}
                                </Typography>
                            </Button>
                        ) : (
                            <Button
                                key={idx}
                                onClick={(e) => handleCloseNavMenu(e, idx)}
                                sx={{
                                    color: 'black',
                                    display: 'block',
                                    fontFamily: 'PingFangTC',
                                    fontSize: '20px',
                                    opacity: '100%',
                                }}
                                disabled
                            >
                                |
                            </Button>
                        )
                    )}
                    <FormControl
                        sx={{ ml: 'auto', alignSelf: 'center' }}
                        variant="standard"
                    >
                        <Input
                            sx={{ borderRadius: 50 }}
                            variant="outlined"
                            id="standard-adornment-amount"
                            onChange={(e) => handleInputChange(e)}
                            endAdornment={
                                <InputAdornment position="start">
                                    <Box>
                                        <Button onClick={handleSearchClick}>
                                            <Box
                                                component="img"
                                                sx={{
                                                    width: '75%',
                                                    height: '75%',
                                                }}
                                                src={search}
                                            />
                                        </Button>
                                    </Box>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    <Button onClick={(e) => navigate('/user/cart')}>
                        <Box
                            component="img"
                            src={cart}
                            sx={{ width: '100%', height: '100%' }}
                        />
                        <Typography
                            sx={{
                                position: 'absolute',
                                width: '16px',
                                height: '17px',
                                fontFamily: 'NotoSansCJKtc',
                                color: '#8b572a',
                                mb: '10px',
                            }}
                        >
                            {localStorage.getItem('cart') ? (
                                JSON.parse(localStorage.getItem('cart')).length===0?<></>:JSON.parse(localStorage.getItem('cart')).length
                            ) : (
                                <></>
                            )}
                        </Typography>
                    </Button>
                    <Button>
                        <Box
                            onClick={handleMenu}
                            component="img"
                            src={member}
                            sx={{ width: '75%', height: '75%' }}
                        />
                    </Button>
                    <Box>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={navigateToAuth}>
                                {user ? 'Logout' : 'Login/Register'}
                            </MenuItem>
                            {user ? (
                                <MenuItem
                                    onClick={(e) => {
                                        handleMenuClose()
                                        navigate('/user/history')
                                    }}
                                >
                                    <Typography> Transactions</Typography>
                                </MenuItem>
                            ) : (
                                <></>
                            )}
                            {user ? (
                                <MenuItem
                                    onClick={(e) => {
                                        handleMenuClose()
                                        navigate('/admin/dashboard')
                                    }}
                                >
                                    <Typography> Admin DashBoard</Typography>
                                </MenuItem>
                            ) : (
                                <></>
                            )}
                        </Menu>
                    </Box>
                </Box>
                <Box
                    sx={{
                        backgroundColor: '#313538',
                        width: '100%',
                        height: '3vh',
                    }}
                />
            </Box>
        </AppBar>
    )
}
export default ResponsiveAppBar
