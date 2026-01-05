"use client"
import React from 'react'
import MemeTemplateEditor from '@/components/AdminCanvas'
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
import { v4 as uuidV4 } from 'uuid'
import { urlToBlob } from '../actions/index-data'
import { supabase } from '@/lib/supabase/supabaseClient'
import { Label } from "@/components/ui/label"



const formSchema = z.object({
    name: z.string().min(2),
    width : Number(z.coerce.number().min(1)),
    height : Number(z.coerce.number().min(1)),
    tags : z.string().min(2),
    description : z.string().min(2),
    keywords : z.string().min(2),
    tone : z.string().min(2),
    topics : z.string().min(2)

})

const page = () => {
    const [url, setUrl] = React.useState<string>('')
    const [templateId] = React.useState(uuidV4())
    const [phase, setPhase] = React.useState<number>(0)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            width : 0 as number,
            height : 0 as number,
            tags : "",
            description : "",
            keywords : "",
            tone : "",
            topics : ""
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        // console.log(values)
        const databaseValues = {
            id : templateId,
            name : values.name,
            width: values.width,
            height : values.height,
            box_count : 0,
            tags : values.tags.split(',').map((tag) => tag.trim()),
            url : ' ',
            description : values.description,
            keywords : values.keywords.split(",").map((keyword) => keyword.trim()),
            tone : values.tone,
            topics : values.topics.split(",").map((topic) => topic.trim()),
            caption_areas : [{}]
        }
        const {data, error} = await supabase.from("templates").insert([databaseValues])
        // console.log("database data -> ", data)
        // console.log("form data -> ", databaseValues)
        // console.log("templateId -> ", templateId)
        if(error){
            console.log("Failed to store template data -> ", error)
            return
        }
        if(data){
            console.log("Stored Data successfully")
        }
        setPhase(2)
    }

    return (
        <div>
            {/* <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="fileUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meme template Url</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form> */}
            <div className="grid w-full max-w-sm items-center gap-3">
                <Label htmlFor="picture">Picture</Label>
                <Input id="picture" type="file" onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const arrayBuffer = await file.arrayBuffer()
                    const { data, error } = await supabase.storage.from("meme-templates").upload(templateId, arrayBuffer, {
                        contentType: file.type
                    });
                    // console.log("data -> ", data)
                    // console.log("error -> ", error)
                    if (error) {
                        console.log("error in uploading file", error)
                    }
                    if (data) {
                        console.log("uploaded successfully")
                    }
                    const { data: urlData } = await supabase.storage.from("meme-templates").getPublicUrl(templateId);
                    setUrl(urlData.publicUrl)
                    setPhase(1)
                }} />
            </div>
            <div>
                {
                    phase === 1 && <div>
                        <h1>Enter details of meme template</h1>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="width"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>width</FormLabel>
                                            <FormControl>
                                                <Input placeholder="name" {...field} type="number"/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="height"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>height</FormLabel>
                                            <FormControl>
                                                <Input placeholder="name" {...field} type="number"/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="tags"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>tags</FormLabel>
                                            <FormControl>
                                                <Input placeholder="name" {...field}/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>description</FormLabel>
                                            <FormControl>
                                                <Input placeholder="name" {...field}/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="keywords"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>keywords</FormLabel>
                                            <FormControl>
                                                <Input placeholder="name" {...field}/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="tone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>tone</FormLabel>
                                            <FormControl>
                                                <Input placeholder="name" {...field}/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="topics"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>topics</FormLabel>
                                            <FormControl>
                                                <Input placeholder="name" {...field}/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">Submit</Button>
                            </form>
                        </Form>
                    </div>
                }
            </div>
            <div>
                {
                    phase === 2 && url && <MemeTemplateEditor imageUrl={url} id={templateId}/>
                }
            </div>

        </div>
    )
}

export default page