"use client"
import { indexData } from "./actions/index-data";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { fetchTemplates, Template } from "@/lib/features/memes-templates-store/memesThunk";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import Image from "next/image";
import { AppDispatch } from "@/lib/store";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import TemplateCanvas from "@/components/TemplateCanvas";
import FabricTemplateCanvas from "@/components/FabricTemplateCanvas";


 
const formSchema = z.object({
  prompt: z.string().min(2).max(500),
})



export default function Home() {
  const {loading, templates, error} : {loading : boolean, templates : Template[] | null, error : string | null} = useSelector((state : RootState) => state.fetchTemplates)
  const dispatch = useDispatch<AppDispatch>()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  })
  function onSubmit(values: z.infer<typeof formSchema>) {
    dispatch(fetchTemplates(values.prompt))
  }
  return (
    // <div>
    //   {/* <Button className="bg-white text-black" onClick={dispatch(fetchTemplates)}>Index Data</Button>
    //   {
    //     templates && templates.map((template : Template) => {
    //       return (<div key={template.name}>
    //         <Image src={template.url} alt={template.name}/>
    //       </div>)
    //     })
    //   } */}

    // </div>
    <div className="w-full">
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
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
    <div className="bg-black text-white w-full">
      {
        error && "Error occured"
      }
      {
        loading && "Data is loading..."
      }
      {
        templates && templates.map((template : Template) => {
          return (<div key={template.id} className="h-[500px] w-[500px] grid grid-cols-2">
            <div className="w-full">
              {/* <Image src={template.url!} alt={template.name!} width={template.width} height={template.height}/>
              <div className="w-[500px]">{template.meme_captions?.join(", ")}</div> */}
              {/* <TemplateCanvas template={template}/> */}
              <FabricTemplateCanvas template={template}/>
            </div>
          </div>)
        })
      }
    </div>
    </div>

  );
}
