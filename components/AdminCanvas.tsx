"use client"
import { useRef, useEffect, useState } from 'react'
import { Canvas, FabricImage, Rect, TPointerEvent } from 'fabric'
import { supabase } from '@/lib/supabase/supabaseClient'

interface CaptionArea {
    id: number
    x: number
    y: number
    width: number
    height: number
    position: string
    description: string
}

export default function MemeTemplateEditor({ imageUrl, id }: { imageUrl: string, id: string }) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const fabricRef = useRef<Canvas | null>(null)
    const [captionAreas, setCaptionAreas] = useState<CaptionArea[]>([])
    const [isDrawing, setIsDrawing] = useState(false)
    const [currentRect, setCurrentRect] = useState<Rect | null>(null)
    const [startPoint, setStartPoint] = useState({ x: 0, y: 0 })
    const [imageScale, setImageScale] = useState(1)
    const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 })

    // Setup canvas once
    useEffect(() => {
        if (!canvasRef.current) return

        const canvas = new Canvas(canvasRef.current, {
            width: 500,
            height: 500,
            selection: false
        })
        fabricRef.current = canvas

        return () => {
            canvas.dispose()
        }
    }, [])

    // Load image
    useEffect(() => {
        const canvas = fabricRef.current
        if (!canvas) return

        async function loadImage() {
            canvas.clear()

            const img = await FabricImage.fromURL(imageUrl)
            const scale = Math.min(
                canvas.getWidth() / img.width!,
                canvas.getHeight() / img.height!
            )
            const scaledWidth = img.width! * scale
            const scaledHeight = img.height! * scale
            const offsetX = (canvas.getWidth() - scaledWidth) / 2
            const offsetY = (canvas.getHeight() - scaledHeight) / 2

            setImageScale(scale)
            setImageOffset({ x: offsetX, y: offsetY })

            img.set({
                left: offsetX,
                top: offsetY,
                originX: 'left',
                originY: 'top',
                scaleX: scale,
                scaleY: scale,
                selectable: false,
                evented: false
            })
            canvas.add(img)
            // img.sendObjectToBack(0) // NEW: Replace sendToBack with moveTo(0)
            canvas.renderAll()
        }

        loadImage()
    }, [imageUrl])

    // Setup event handlers
    useEffect(() => {
        const canvas = fabricRef.current
        if (!canvas) return

        const handleMouseDown = (options: TPointerEvent) => {
            const pointer = canvas.getScenePoint(options.e) // NEW: Replace getPointer with getScenePoint
            setIsDrawing(true)
            setStartPoint({ x: pointer.x, y: pointer.y })

            const rect = new Rect({
                left: pointer.x,
                top: pointer.y,
                width: 0,
                height: 0,
                fill: 'rgba(255, 0, 0, 0.3)',
                stroke: 'red',
                strokeWidth: 2,
                selectable: true,
                evented: false
            })
            setCurrentRect(rect)
            canvas.add(rect)
        }

        const handleMouseMove = (options: TPointerEvent) => {
            if (!isDrawing || !currentRect) return
            const pointer = canvas.getScenePoint(options.e) // NEW: Replace getPointer with getScenePoint

            const width = pointer.x - startPoint.x
            const height = pointer.y - startPoint.y

            if (width < 0) {
                currentRect.set({ left: pointer.x })
            }
            if (height < 0) {
                currentRect.set({ top: pointer.y })
            }

            currentRect.set({
                width: Math.abs(width),
                height: Math.abs(height)
            })
            canvas.renderAll()
        }

        const handleMouseUp = () => {
            if (!isDrawing || !currentRect) return
            setIsDrawing(false)

            const canvasX = currentRect.left!
            const canvasY = currentRect.top!
            const canvasWidth = currentRect.width!
            const canvasHeight = currentRect.height!

            const originalX = Math.round((canvasX - imageOffset.x) / imageScale)
            const originalY = Math.round((canvasY - imageOffset.y) / imageScale)
            const originalWidth = Math.round(canvasWidth / imageScale)
            const originalHeight = Math.round(canvasHeight / imageScale)

            const newArea: CaptionArea = {
                id: captionAreas.length + 1,
                x: originalX,
                y: originalY,
                width: originalWidth,
                height: originalHeight,
                position: 'center_center',
                description: `Caption area ${captionAreas.length + 1}`
            }

            setCaptionAreas([...captionAreas, newArea])
            setCurrentRect(null)
        }

        canvas.on('mouse:down', handleMouseDown)
        canvas.on('mouse:move', handleMouseMove)
        canvas.on('mouse:up', handleMouseUp)

        return () => {
            canvas.off('mouse:down', handleMouseDown)
            canvas.off('mouse:move', handleMouseMove)
            canvas.off('mouse:up', handleMouseUp)
        }
    }, [isDrawing, currentRect, startPoint, captionAreas, imageScale, imageOffset])

    const removeLastArea = () => {
        if (captionAreas.length === 0) return
        setCaptionAreas(captionAreas.slice(0, -1))

        const canvas = fabricRef.current
        if (canvas) {
            const objects = canvas.getObjects()
            if (objects.length > 1) {
                canvas.remove(objects[objects.length - 1])
                canvas.renderAll()
            }
        }
    }

    const clearAll = () => {
        setCaptionAreas([])
        const canvas = fabricRef.current
        if (canvas) {
            const objects = canvas.getObjects()
            // Keep only the image (first object)
            objects.slice(1).forEach(obj => canvas.remove(obj))
            canvas.renderAll()
        }
    }

    // update database
    const exportJSON = async () => {
        // console.log(captionAreas)
        // console.log("id -> ", id)
        try{
            const {data:dbData, error : dbError} = await supabase.from('templates').select().eq("id", id)
            if(dbError){
                throw dbError
            }else{
                console.log(dbData)
            }
            const {error} = await supabase.from("templates").update({
                caption_areas : captionAreas,
                box_count : captionAreas.length,
                url : imageUrl
            }).eq("id", id)
            if(error){
                throw error
            }
        }catch(error){
            console.log("error -> ", error)
            return
        }
        // console.log(JSON.stringify(captionAreas, null, 2))
        // navigator.clipboard.writeText(JSON.stringify(captionAreas, null, 2))
        // if (captionAreas.length > 0) {
        //     const { data, error } = await supabase.from("templates").update({ url: imageUrl, box_count: captionAreas.length, caption_areas: captionAreas }).eq("id", id)
        //     if (error) {
        //         console.log("Failed to update database -> ", error)
        //         return;
        //     }
        //     if (data) {
        //         console.log("updated successfully !")
        //         alert('Data updated!')
        //     }
            
        // } else {
        //     const { data, error } = await supabase.from("templates").update({
        //         url: imageUrl, box_count: 1, caption_areas: [{
        //             x: 0,
        //             y: 10,
        //             width: 500,
        //             height: 80,
        //             position: "center_top",
        //             description: "Top caption"
        //         },
        //         {
        //             x: 0,
        //             y: 410, 
        //             width: 500,
        //             height: 80,
        //             position: "center_bottom",
        //             description: "Bottom caption"
        //         }]
        //     }).eq("id", id)
        //     if(error){
        //         console.log("Failed to update default data -> ", error)
        //         return 
        //     }
        //     console.log("Data uploaded succussfully!")
        //     alert("data has been updated")
        // }
    }

    return (
        <div className="flex flex-col gap-4 p-4">
            <h2 className="text-2xl font-bold">Meme Template Editor</h2>
            <p className="text-gray-600">Click and drag to define caption areas</p>

            <canvas ref={canvasRef} className="border border-gray-300" />

            <div className="flex gap-2">
                <button
                    onClick={removeLastArea}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                    Remove Last Area
                </button>
                <button
                    onClick={clearAll}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Clear All
                </button>
                <button
                    onClick={() => exportJSON()}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Save Data
                </button>
            </div>

            <div className="mt-4">
                <h3 className="text-xl font-semibold mb-2">Caption Areas ({captionAreas.length})</h3>
                <div className="bg-gray-100 p-4 rounded max-h-60 overflow-y-auto">
                    <pre className="text-sm">
                        {JSON.stringify(captionAreas, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    )
}