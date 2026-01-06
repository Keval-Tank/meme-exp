import {createClient} from "redis"

export async function getRedisClient() {
    const client = await createClient()
    .on('error', (err) => console.log('Redis Client Error', err))
    .connect()

    return client;
}
