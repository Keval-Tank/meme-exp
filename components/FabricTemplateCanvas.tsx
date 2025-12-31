"use client"
import React from 'react'
import { useRef, useEffect, useState } from 'react'
import { FabricImage, Canvas, FabricText, IText as FabricIText } from 'fabric'
import { Button } from './ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const colorPresets = [
    '#ffffff',  // white
    '#000000',  // black
    '#ff0000',  // red
    '#00ff00',  // green
    '#0000ff',  // blue
    '#ffff00',  // yellow
    '#ff00ff',  // magenta
    '#00ffff',  // cyan
    '#ffa500',  // orange
    '#800080',  // purple
    '#ffc0cb',  // pink
    '#a52a2a',  // brown
]

const fontSizePresets = [
  12,
  16,
  20,
  24,
  28,
  32,
  36,
  40,
  48,
  56,
  64,
  72,
]

const fontFamilyPresets = [
  'Arial, sans-serif',
  'Helvetica, sans-serif',
  'Times New Roman, serif',
  'Courier New, monospace',
  'Georgia, serif',
  'Verdana, sans-serif',
  'Impact, sans-serif',           // popular for memes
  'Comic Sans MS, cursive',
  'Trebuchet MS, sans-serif',
  '"Palatino Linotype", serif',
  'Lucida Console, monospace',
  'Garamond, serif',
]


export const FabricTemplateCanvas = ({ template }: any) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const fabricRef = useRef<Canvas | null>(null)
    const [activeText, setActiveText] = useState<string | null>(null)
    const [fontColor, setFontColor] = useState<string>('#ffffff')
    const [fontSize, setFontSize] = useState<string>('28')
    const [fontStyle, setFontStyle] = useState<string>('Impact')
    const [fontBorderColor, setFontBorderColor] = useState<string>('black')

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = new Canvas(canvasRef.current, {
            width: 500,
            height: 500
        })
        fabricRef.current = canvas
        async function main() {
            const img = await FabricImage.fromURL(template.url)
            const scale = Math.max((canvas.getWidth() / template.width), (canvas.getHeight() / template.height))
            img.set({
                left: 0,
                top: 0,
                originX: 'left',
                originY: 'top',
                scaleX: scale,
                scaleY: scale,
                selectable: false
            })
            canvas.add(img)
            let start = 50
            template.meme_captions.forEach((caption: string) => {
                canvas.add(new FabricIText(caption, {
                    left: canvas.getWidth() / 2,
                    top: start,
                    fill: '#ffffff',
                    fontSize: 28,
                    fontFamily: 'Impact',
                    stroke: 'black',
                    strokeWidth: 2,
                    textAlign: 'center',
                    originX: 'center'
                }))
                start += 50
            })
            canvas.renderAll()
        }
        main()
        canvas.on("object:moving", (e) => {
            const obj = e.target
            const canvasHeight = canvas.getHeight()
            const canvasWidth = canvas.getWidth()
            obj.setCoords()
            const bounds = obj.getBoundingRect()
            if (bounds.left < 0) obj.left -= bounds.left
            if (bounds.top < 0) obj.top -= bounds.top
            if (bounds.left + bounds.width > canvasWidth) {
                obj.left -= (bounds.left + bounds.width - canvasWidth)
            }
            if (bounds.top + bounds.height > canvas.height) {
                obj.top -= (bounds.top + bounds.height - canvasHeight)
            }
        })
        // // start inline toolbar
        // canvas.on("text:editing:entered", (e) => {
        //     const obj = e.target
        //     setActiveText(obj.text);
        //     console.log("enter",fontColor)
        //     obj.set({
        //         fill : fontColor
        //     })
        //     canvas.renderAll()
        // })
        // canvas.on("text:editing:exited", (e) => {
        //     console.log("exit", fontColor)
        //     setActiveText(null)
        // })
        canvas.on("selection:created", () => {
            const obj = canvas.getActiveObject()
            if (obj && (obj?.type === 'i-text' || obj?.type === 'textbox')) {
                const textObj = obj as FabricIText
                setActiveText(textObj.text)
            }
        })
        canvas.on("selection:updated", () => {
            const obj = canvas.getActiveObject()
            if (obj && (obj?.type === 'i-text' || obj?.type === 'textbox')) {
                const textObj = obj as FabricIText
                setActiveText(textObj.text)
            }
        })
        canvas.on("selection:cleared", () => {
            canvas.renderAll()
            setActiveText(null)
        })
        return () => {
            canvas.dispose()
        }
    }, [template.url]);

    useEffect(() => {
        const canvas = fabricRef.current
        if(!canvas) return

        const obj = canvas.getActiveObject()
        if(obj && (obj.type === 'i-text' || obj.type === 'textbox')){
            obj.set({
                fill : fontColor,
                fontSize : parseInt(fontSize),
                fontFamily : fontStyle,
                stroke : fontBorderColor
            })
            canvas.renderAll()
        }
    }, [fontColor, fontSize, fontStyle, fontBorderColor])

    return <>
        <canvas ref={canvasRef} width={300} height={300} />
        {
            activeText && (<div>
                <Select onValueChange={(color) => setFontColor(color)}>
                    <SelectTrigger className="w-[180px] text-white">
                        <SelectValue placeholder="Color" />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            colorPresets.map((color: string, index) => {
                                return (
                                    <SelectItem key={index} value={color}>
                                        <div className="color-swatch" style={{ '--swatch-color': color } as React.CSSProperties} />
                                    </SelectItem>
                                )
                            })
                        }
                    </SelectContent>
                </Select>
                <Select onValueChange={(size) => setFontSize(size)}>
                    <SelectTrigger className="w-[180px] text-white">
                        <SelectValue placeholder="Font Size" />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            fontSizePresets.map((size: number, index) => {
                                return (
                                    <SelectItem key={index} value={size.toString()}>
                                        {
                                            size
                                        }
                                    </SelectItem>
                                )
                            })
                        }
                    </SelectContent>
                </Select>
                <Select onValueChange={(style) => setFontStyle(style)}>
                    <SelectTrigger className="w-[180px] text-white">
                        <SelectValue placeholder="Font Family" />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            fontFamilyPresets.map((style : string, index) => {
                                return (
                                    <SelectItem key={index} value={style}>
                                        {
                                            style
                                        }
                                    </SelectItem>
                                )
                            })
                        }
                    </SelectContent>
                </Select>
                <Select onValueChange={(color) => setFontBorderColor(color)}>
                    <SelectTrigger className="w-[180px] text-white">
                        <SelectValue placeholder="Border color" />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            colorPresets.map((color: string, index) => {
                                return (
                                     <SelectItem key={index} value={color}>
                                        <div className="color-swatch" style={{ '--swatch-color': color } as React.CSSProperties} />
                                    </SelectItem>
                                )
                            })
                        }
                    </SelectContent>
                </Select>
            </div>)
        }
    </>
}

export default FabricTemplateCanvas