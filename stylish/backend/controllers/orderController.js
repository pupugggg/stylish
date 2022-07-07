const db = require('../config/db')
const asyncHandler = require('express-async-handler')
const axios = require('axios')
const getHistory = asyncHandler(async (req, res) => {
    const userId = req.user.id
    const result = await db.sequelize.order.findAll({
        where: { userId: userId },
    })
    res.status(200).json(result)
})

const saveCart = asyncHandler(async (req, res) => {
    if (!req.body) throw new Error('request without cart')
    console.log(req.body)
    const newCart = req.body
    req.session.cart = newCart
    req.session.save()
    res.status(200).json(req.session.cart)
})

const checkout = asyncHandler(async (req, res) => {
    const { prime } = req.body
    console.log(prime)
    console.log(req.session.cart)
    if (!req.session.cart || req.session.cart == [] || !prime) {
        throw new Error('Request without order or prime.')
    }
    const t = await db.sequelize.transaction()
    try {
        const cart = req.session.cart.cart
        const deliveryFee = 30
        let totalPrice = deliveryFee
        for (let i = 0; i < cart.length; i++) {
            totalPrice = totalPrice + cart[i].price * cart[i].amount
            const stock = await db.sequelize.stock.findOne({
                where: { id: cart[i].id },
                transaction: t,
            })
            stock.remain = stock.remain - cart[i].amount
            await stock.save({ transaction: t })
        }
        const orderRecord = await db.sequelize.order.create(
            {
                amount: totalPrice,
                paid: false,
                userId: req.user.id,
                address: req.session.cart.address,
                phone: req.session.cart.phone,
                reciever: req.session.cart.name,
            },
            { transaction: t }
        )
        const result = await sendPayment({
            prime: prime,
            amount: totalPrice,
        })
        if (result.status == 0) {
            for (let i = 0; i < cart.length; i++) {
                const result = await db.sequelize.orderDetail.create(
                    {
                        stockId: cart[i].id,
                        number: cart[i].amount,
                        orderId: orderRecord.id,
                    },
                    { transaction: t }
                )
            }
        }
        orderRecord.bank_transaction_id = result.bank_transaction_id
            ? result.bank_transaction_id
            : null
        orderRecord.paymentStatus = result.status
        orderRecord.paid = result.status == 0 ? true : false
        orderRecord.paymentMsg = result.msg
        await orderRecord.save({ transaction: t })
        await t.commit()
        req.session.destroy()
        res.status(200).send(result)
    } catch (error) {
        console.log(error)
        await t.rollback()
        throw new Error(error.message)
    }
    // throw new Error('transaction failed')
})

const sendPayment = async (paymentInfo) => {
    const { prime, amount } = paymentInfo

    if (!prime || !amount) {
        throw new Error('Incomplete payment info.')
    }
    const setting = {
        headers: {
            'content-type': 'application/json',
            'x-api-key': process.env.partnerKey,
        },
    }
    const deliveryFee = 30
    const body = {
        partner_key: process.env.partnerKey,
        prime: `${prime}`,
        amount: `${amount + deliveryFee}`,
        merchant_id: 'AppWorksSchool_CTBC',
        details: 'Some item',
        cardholder: {
            phone_number: '+886923456789',
            name: '王小明',
            email: 'LittleMing@Wang.com',
            zip_code: '100',
            address: '台北市天龍區芝麻街1號1樓',
            national_id: 'A123456789',
        },
    }
    const promise = axios.post(
        'https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime',
        body,
        setting
    )
    const dataPromise = promise.then((response) => response.data)
    return dataPromise
}

const updateRemain = asyncHandler(async (req, res) => {
    const orders = req.body
    if (!orders) {
        res.status(400)
        throw new Error("No products in user's Cart")
    }
    const targets = orders.map((e) => e.id)
    const remains = await db.sequelize.stock.findAll({
        attributes: ['id', 'remain'],
        where: { id: targets },
    })
    const result = orders.map((e) => {
        e.remain = remains.find((element) => element.id === e.id).remain
        return e
    })
    res.status(200).json(result)
})

module.exports = { getHistory, saveCart, checkout, updateRemain }
