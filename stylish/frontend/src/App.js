import React from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom'
import './App.css'

import Dashboard from './components/pages/admin/Dashboard'
import Detail from './components/pages/admin/Detail'

import Pay from './components/pages/user/Pay'
import History from './components/pages/user/History'
import Cart from './components/pages/user/Cart'

import Login from './components/pages/public/Login'
import Register from './components/pages/public/Register'
import Main from './components/pages/public/Main'
import Productdetail from './components/pages/public/Productdetail'
import Search from './components/pages/public/Search'

import 'material-react-toastify/dist/ReactToastify.css';
import Header from './components/Header'
import Footer from './components/Footer'
import { ToastContainer } from 'material-react-toastify';
import { ThemeProvider,createTheme } from '@material-ui/core'
function App() {
    const THEME = createTheme({
        typography: {
         "fontFamily": `"PingFangTC","NotoSansCJKtc","Roboto", "Helvetica", "Arial", sans-serif`,
         "fontSize": 14,
         "fontWeightLight": 300,
         "fontWeightRegular": 400,
         "fontWeightMedium": 500
        }
     })
    return (
        <>
            <Router>
                <ThemeProvider theme={THEME}>
                <Header />
                <ToastContainer />
                <Routes>
                    <Route path="/main/:catagory" element={<Main />} />
                    <Route path="/search/:keyword" element={<Search />} />
                    <Route path="/products/:id" element={<Productdetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/admin/dashboard" element={<Dashboard />} />
                    <Route path="/admin/detail/:id" element={<Detail />} />
                    <Route path="/user/cart" element={<Cart />} />
                    <Route path="/user/pay" element={<Pay />} />
                    <Route path="/user/history" element={<History />} />
                    <Route path="*" element={<Navigate to="/main/all" />} />
                </Routes>
                <Footer />
                </ThemeProvider>
            </Router>
        </>
    )
}
export default App
