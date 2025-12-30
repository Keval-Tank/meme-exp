"use client"
import React from 'react'
import { useRef, useEffect } from 'react'
import { FabricImage, Canvas, FabricText } from 'fabric'

export const FabricTemplateCanvas = ({ template }: any) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const fabricRef = useRef<Canvas | null>(null)
    useEffect(() => {
        async function main() {
            if (!canvasRef.current) return;

            const canvas = new Canvas(canvasRef.current, {
                width: 300,
                height: 300
            })
            fabricRef.current = canvas
            const img = await FabricImage.fromURL(template.url)
            canvas.add(img)
            let start = 50
            template.meme_captions.forEach((caption: string) => {
                canvas.add(new FabricText(caption, {
                    left: canvas.getWidth() / 2,
                    top: start,
                    fill: 'white',
                    fontSize: 28,
                    fontFamily: 'Impact, sans-serif',
                    stroke: 'black',
                    textAlign: 'center',
                    originX: 'center'
                }))
                start += 50
            })
            return () => {
                canvas.dispose()
            }
        }
        main()
    }, [template.url])
    return <canvas ref={canvasRef} width={300} height={300} />
}

export default FabricTemplateCanvas