import {createClient} from 'redis'

export async function getRedisClient(){
    const client = await createClient()
  .on("error", (err) => {throw new Error("Failed to connect to redis client")})
  .connect();

  return client
}