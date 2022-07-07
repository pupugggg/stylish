import React from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { sendPrimeAndPay, reset,wipeCart } from '../../../features/order/orderSlice'
import { Button } from '@mui/material/'
import { Card } from '@mui/material/'
import { Box } from '@mui/system'
function Pay() {
    const dispatch = useDispatch()
    const { isError } = useSelector((s) => s.order)
    const { user } = useSelector((state) => state.auth)
    function getTPDirect() {
        return new Promise((resolve, reject) => {
            if (typeof window.TPDirect !== 'undefined') {
                return resolve(window.TPDirect)
            } else {
                const script = window.document.createElement('script')
                script.src = 'https://js.tappaysdk.com/tpdirect/v5.1.0'
                script.async = true
                script.onload = () => {
                    if (typeof window.TPDirect !== 'undefined') {
                        resolve(window.TPDirect)
                    } else {
                        reject(new Error('failed to load TapPay sdk'))
                    }
                }
                script.onerror = reject
                window.document.body.appendChild(script)
            }
        })
    }
    const navigate = useNavigate()
    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
        if (isError) {
            navigate('/')
        }
        getTPDirect().then((res) => {
            res.setupSDK(
                12348,
                'app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF',
                'sandbox'
            )
            res.card.setup({
                // Display ccv field
                fields: {
                    number: {
                        // css selector
                        element: document.getElementById('card-number'),
                        placeholder: '**** **** **** ****',
                    },
                    expirationDate: {
                        // DOM object
                        element: document.getElementById(
                            'card-expiration-date'
                        ),
                        placeholder: 'MM / YY',
                    },
                    ccv: {
                        element: document.getElementById('card-ccv'),
                        placeholder: 'ccv',
                    },
                }
            })
        })

        return () => dispatch(reset())
    }, [dispatch, user, isError])

    

    return (
        <>
            <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
                <Grid xs={12} md={8} lg={8}  item>
                    <Card
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: '100vh',
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Card Number:
                        </Typography>
                        <Box class="tpfield" id="card-number"></Box>
                        <Typography variant="h6" gutterBottom>
                            Expiration:
                        </Typography>
                        <Box id="card-expiration-date"></Box>
                        <Typography variant="h6" gutterBottom>
                            CCV:
                        </Typography>
                        <Box id="card-ccv"></Box>
                        <Button variant="contained"
                            onClick={(e) => {
                                getTPDirect().then((r) => {
                                    r.card.getPrime((result) => {
                                        if (result.status !== 0) {
                                            alert(
                                                'get prime error ' + result.msg
                                            )
                                            return
                                        }
                                        alert(
                                            'Card Verified'
                                        )
                                        
                                        dispatch(
                                            sendPrimeAndPay({
                                                prime: result.card.prime,
                                            })
                                        ).then((res)=>{
                                            dispatch(wipeCart())
                                           navigate('/user/history') 
                                        })
                                    })
                                })
                            }}
                        >
                            PAY
                        </Button>
                    </Card>
                </Grid>
            </Grid>
        </>
    )
}

export default Pay
