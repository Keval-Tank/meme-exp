import Replicate from "replicate"
import { NextResponse } from "next/server"

// const replicate = new Replicate({
//     auth: process.env.REPLICATE_API_TOKEN!,
//     useFileOutput: false
// })

//  const output = await replicate.run("black-forest-labs/flux-dev", {
//             input : {
//                 prompt : image_generation_prompt
//             }
//         })

export async function POST(req: Request) {
    try {
        console.log("Request from -> ",req.url)
        const {image_generation_prompt} = await req.json()
        const replicate = new Replicate({
            auth: process.env.REPLICATE_API_TOKEN!,
            useFileOutput: false
        })
        const output = await replicate.run("black-forest-labs/flux-dev", {
            input: {
                prompt: image_generation_prompt
            }
        })
        if(Object.keys(output).length === 0){
            throw new Error("Error in generating meme image")
        }
        return NextResponse.json({
            success : true,
            imageUrl : output
        })
    } catch (error:any) {
        return NextResponse.json({
            success: false,
            error : error.message
        })
    }
}
