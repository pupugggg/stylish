import { Box } from '@mui/system'
import { Card, CardMedia, Grid } from '@mui/material'
import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { searchProduct, reset } from '../../../features/product/productSlice'
function Search() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { keyword } = useParams()
    const { products } = useSelector((s) => s.product)
    useEffect(() => {
        dispatch(searchProduct(keyword)).then((res) => console.log(products))
        return () => {
            dispatch(reset())
        }
    }, [dispatch, navigate])
    const handleCardClick = (e, id) => {
        navigate(`/products/${id}`)
    }
    return (
        <Grid container sx={{justifyContent:'center', minHeight: '100vh' }}>
            <Grid item sx={12}>
                {products && products[0] && products.length !== 0 ? (
                    <Grid container>
                        {products.map((item, index) => (
                            <Grid
                                key={index}
                                xs={12}
                                md={12}
                                item
                                sx={{ height: '45vh' }}
                            >
                                <Card
                                    variant="outlined"
                                    onClick={(e) => handleCardClick(e, item.id)}
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={'/' + item.thumbnail}
                                        alt="productImage"
                                        sx={{ height: '80%' }}
                                    />
                                    <Box
                                        sx={{
                                            color: '#3f3a3a',
                                            fontFamily: 'NotoSansCJKtc',
                                        }}
                                    >
                                        {item.title}
                                    </Box>

                                    {item.colors &&
                                    item.colors !== [] &&
                                    item.colors[0] ? (
                                        <Box
                                            sx={{
                                                color: '#3f3a3a',
                                                fontFamily: 'NotoSansCJKtc',
                                            }}
                                        >
                                            TWD.{item.colors[0].price}
                                        </Box>
                                    ) : (
                                        <></>
                                    )}
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box>Product Not Found</Box>
                )}
            </Grid>
        </Grid>
    )
}

export default Search
