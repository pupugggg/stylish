import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import {
    filterAndGetProduct,
    reset,
} from '../../../features/product/productSlice'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Grid, CardMedia, IconButton } from '@mui/material'
import { Box } from '@mui/system'
import { Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useState } from 'react'
function Main() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    let { catagory } = useParams()
    const [page, setPage] = useState(0)
    useEffect(() => {
        dispatch(filterAndGetProduct({ catagory: catagory, page: 0 }))
        setPage(0)
        return () => {
            reset()
        }
    }, [dispatch, catagory])
    const {
        products: { products, nextPage },
    } = useSelector((s) => s.product)

    const handleCardClick = (e, id) => {
        navigate(`/products/${id}`)
    }

    const toPage = (page) => {
        setPage(page)
        dispatch(filterAndGetProduct({ catagory: catagory, page: page }))
    }
    return (
        <Box
            sx={{
                mt:'1%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: '100vh',
                mb:'1%'
            }}
        >
            <Grid container height="100%">
                <Grid xs={3} item></Grid>
                <Grid xs={6} item sx={{ height: '100%' }}>
                    <Grid container justifyContent="flex-start" spacing={3}>
                        {products ? (
                            products.map((item, index) => (
                                <Grid key={index} xs={12} md={4} item sx={{}}>
                                    <Card
                                        variant="outlined"
                                        onClick={(e) =>
                                            handleCardClick(e, item.id)
                                        }
                                        sx={{
                                            height: '100%',
                                            display: 'inline-flex',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            image={'/' + item.thumbnail}
                                            alt="productImage"
                                            sx={{}}
                                        />
                                        <Box
                                            sx={{
                                                justifyContent: 'flex-start',
                                                display: 'flex',
                                            }}
                                        >
                                            {item.colors &&
                                            item.colors !== [] &&
                                            item.colors[0] ? (
                                                item.colors.map((c, idx) => (
                                                    <Box
                                                        key={c + idx}
                                                        sx={{
                                                            backgroundColor:
                                                                '#' +
                                                                c.colorCode,
                                                            width: '24px',
                                                            height: '24px',
                                                            ml: '5px',
                                                            mt: '10px',
                                                        }}
                                                    />
                                                ))
                                            ) : (
                                                <></>
                                            )}
                                        </Box>

                                        <Typography
                                            variant='h6'
                                            sx={{
                                                fontWeight: 'normal',
                                                fontStretch: 'normal',
                                                fontStyle: 'normal',
                                                lineHeight: 'normal',
                                                color: '#3f3a3a',
                                            }}
                                        >
                                            {item.title}
                                        </Typography>

                                        {item.colors &&
                                        item.colors !== [] &&
                                        item.colors[0] ? (
                                            <Typography
                                                sx={{
                                                    color: '#3f3a3a',
                                                }}
                                            >
                                                TWD.{item.colors[0].price}
                                            </Typography>
                                        ) : (
                                            <></>
                                        )}
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <></>
                        )}
                    </Grid>
                </Grid>
                <Grid xs={3} item></Grid>

                <Box
                    xs={12}
                    md={12}
                    lg={12}
                    item
                    sx={{
                        mt:'1%',
                        mx: 'auto',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                    }}
                >
                    {page !== 0 ? (
                        <IconButton onClick={(e) => toPage(page - 1)}>
                            <ArrowBackIcon />
                        </IconButton>
                    ) : (
                        <></>
                    )}
                    {nextPage && nextPage !== null ? (
                        <IconButton onClick={(e) => toPage(nextPage)}>
                            <ArrowForwardIcon />
                        </IconButton>
                    ) : (
                        <></>
                    )}
                </Box>
            </Grid>
        </Box>
    )
}

export default Main
