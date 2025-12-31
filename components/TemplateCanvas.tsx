"use client"
import { Template } from '@/lib/features/memes-templates-store/memesThunk'
import React from 'react'
import { useRef, useState, useEffect } from 'react'

interface MemeCaption {
    caption_text : string,
    x : number,
    y : number
}

const getTextPosition = (clickX:number, clickY:number, captions : MemeCaption[], ctx:CanvasRenderingContext2D) => {
    if(!captions || captions.length == 0) return null;

    ctx.font = 'bold 28px Impact'
    ctx.textAlign = 'center'

    for(let i=0; i<captions.length; i++){
        const {caption_text, x, y} = captions[i];

        const width = ctx.measureText(caption_text).width;
        const height = 30;

        const left = x-width/2
        const right = x+width/2
        const top = y-height/2
        const bottom = y+height/2

        if(clickX >= left && clickX <= right && clickY <= top && clickY >= bottom){
            return i;
        }
    }

    return null;
}



export const TemplateCanvas = ({ template }: any) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (!template.url) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')
        if (!ctx) return;

        const template_image = new Image()

        template_image.onload = () => {
            canvas.width = 300
            canvas.height = 300
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(template_image, 0, 0, canvas.width, canvas.height)
            const topY = 50
            const bottomY = 250
            ctx.fillStyle = 'white'
            ctx.strokeStyle = 'black'
            ctx.font = 'bold 28px Impact'
            ctx.textAlign = 'center'
        
            if (template.meme_captions.length == 2) {
                ctx.strokeText(template.meme_captions[0], 150, topY)
                ctx.fillText(template.meme_captions[0], 150, topY)
                ctx.strokeText(template.meme_captions[1], 150, bottomY)
                ctx.fillText(template.meme_captions[1], 150, bottomY)
            } else {
                let start = 50
                template.meme_captions.forEach((caption: string) => {
                    ctx.strokeText(caption, 150, start)
                    ctx.fillText(caption, 150, start)
                    start += 50
                })
            }
        }

        template_image.src = template.url;

    }, [template])
    return <canvas ref={canvasRef} onMouseDown={(event) => {
        console.log(event);
    }}/>
}

export default TemplateCanvas