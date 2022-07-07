const redis = require('redis')

const client = redis.createClient({ url: process.env.REDIS_URL })

const tryConnect = async () => {
    await client.connect()
    client.on('error', (err) => {
        console.error('Redis Client Error', err)
    })
    await client.set('status', 'redis-ok')
    const value = await client.get('status')
    console.log(value + '\n')
}
tryConnect()
const readThrough = async (key, missCallback, callbackArguments) => {
    const cached = await client.get(key)
    if (!cached) {
        console.log("miss")
        const result = await missCallback(...callbackArguments)
        await client.set(key, JSON.stringify(result), { EX: process.env.EX })
        return result
    }
    console.log("hit")
    return JSON.parse(cached)
}
const cacheEviction=async(key)=>{
    console.log("delete "+key)
    return client.del(key)
}
module.exports = { client, readThrough,cacheEviction }
