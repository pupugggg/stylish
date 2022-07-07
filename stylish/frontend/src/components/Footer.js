import * as React from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { useNavigate } from 'react-router-dom'
import twitterLogo from '../asset/twitter.png'
import lineLogo from '../asset/line.png'
import fbLogo from '../asset/facebook.png'
const pages = [
    '關於 Stylish',
    '|',
    '服務條款',
    '|',
    '隱私政策',
    '|',
    '聯絡我們',
    '|',
    'FAQ',
]

const ResponsiveAppBar = () => {
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
            case 'Create Product':
                console.log(1)
                return
            case 'Cart':
                console.log(1)
                return
            case 'Payment Histroy':
                console.log(1)
                return
            case 'Reset':
                console.log(1)
                return
            case 'Logout':
                console.log(1)
                return
            default:
                return
        }
    }

    return (
        <footer
            style={{
               
                mt:'auto',
                flex:'0 0 50px 0',
                backgroundColor: ' #313538',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'row',
                }}
            >
                {pages.map((page, idx) =>
                    idx % 2 === 0 ? (
                        <Button
                            key={idx}
                            onClick={(e) => handleCloseNavMenu(e, idx)}
                            sx={{
                                color: '#f5f5f5',
                                display: 'block',
                                fontFamily: 'PingFangTC',
                                fontSize: '20px',
                                borderRightColor: '#f5f5f5',
                            }}
                        >
                            {page}
                        </Button>
                    ) : (
                        <Button
                            key={idx}
                            disabled
                            sx={{
                                color: '#f5f5f5',
                                display: 'block',
                                fontFamily: 'PingFangTC',
                                fontSize: '20px',
                                borderRightColor: '#f5f5f5',
                            }}
                        >
                            {page}
                        </Button>
                    )
                )}

                <Button sx={{ ml: '10%' }}>
                    <Box component="img" src={lineLogo} />
                </Button>
                <Button sx={{ ml: '5vw' }}>
                    <Box component="img" src={twitterLogo} />
                </Button>
                <Button sx={{ ml: '5vw' }}>
                    <Box component="img" src={fbLogo} />
                </Button>
                <Box sx={{ color: '#828282', fontFamily: 'PingFangTC',textAlign: 'left' }}>
                    © 2018. All rights reserved.
                </Box>
            </Box>
        </footer>
    )
}
export default ResponsiveAppBar
