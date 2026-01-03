"use client"
import React from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/lib/store'
import { fetchVisualThunk } from '@/lib/features/meme-generation-store/visualsThunk'
import Image from 'next/image'



const formSchema = z.object({
    prompt: z.string().min(2).max(500),
})


const VisualsInput = () => {
    const {loading, error, data} = useSelector((state : RootState) => state.generateMeme)
    const dispatch = useDispatch<AppDispatch>()
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        // console.log(values)
        dispatch(fetchVisualThunk(values.prompt))
    }
    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="prompt"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>prompt</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your prompt" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
            <div>
                {
                    loading && "data loading"
                }
                {
                    error && "Error occured"
                }
                {
                    !loading && data && <Image src={data} alt='text-to-visuals meme' height={300} width={300}/>
                }
            </div>
        </div>
    )
}

export default VisualsInput