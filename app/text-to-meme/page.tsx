"use client"
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
import { useState, useEffect } from "react"
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
import MemeChat from "@/components/MemeChat";
import { customizeCaptions } from "../actions/customize-captions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"



const formSchema = z.object({
  prompt: z.string().min(2).max(500),
})




export default function Home() {
  const { loading, templates: reduxTemplates, error }: { loading: boolean, templates: Template[] | null, error: string | null } = useSelector((state: RootState) => state.fetchTemplates)
  const dispatch = useDispatch<AppDispatch>()
  const [localTemplates, setLocalTemplates] = useState<Template[] | null>(null)
  const [customizingTemplateId, setCustomizingTemplateId] = useState<string | null>(null)
  const [openCustomizeId, setOpenCustomizeId] = useState<string | null>(null)
  
  // Sync Redux templates to local state
  useEffect(() => {
    if (reduxTemplates) {
      setLocalTemplates(reduxTemplates)
    }
  }, [reduxTemplates])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  })
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    dispatch(fetchTemplates(values.prompt))
    setOpenCustomizeId(null) // Reset open customize sections when new search
  }

  const toggleCustomize = (templateId: string) => {
    setOpenCustomizeId(prev => prev === templateId ? null : templateId)
  }

  const handleCustomize = (templateId: string) => async (
    message: string, 
    conversationHistory: Array<{ role: "user" | "assistant", content: string, timestamp: Date }>
  ): Promise<string | void> => {
    if (!localTemplates) {
      return "No templates available to customize. Please search for templates first."
    }

    const template = localTemplates.find(t => t.id === templateId)
    if (!template) {
      return "Template not found."
    }

    setCustomizingTemplateId(templateId)
    try {
      const result = await customizeCaptions(template, message, conversationHistory)
      
      if (result) {
        // Update the specific template with new captions
        setLocalTemplates(prev => 
          prev?.map(t => t.id === templateId ? result.template : t) || null
        )
        
        // Return the assistant response to be added to chat
        return result.response
      } else {
        return "Sorry, I couldn't customize the captions. Please try again."
      }
    } catch (error) {
      console.error("Error customizing captions:", error)
      return "Sorry, I encountered an error. Please try again."
    } finally {
      setCustomizingTemplateId(null)
    }
  }

  // Use local templates if available, otherwise use Redux templates
  const templates = localTemplates || reduxTemplates
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
                <FormLabel>Search Prompt</FormLabel>
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
      <div className="w-full mt-8">
        {
          error && <div className="p-4 text-red-500">Error occurred</div>
        }
        {
          loading && <div className="p-4">Data is loading...</div>
        }
        {
          templates && templates.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
              {templates.map((template: Template) => {
                const isOpen = openCustomizeId === template.id
                return (
                  <div key={template.id} className="flex flex-col gap-3 border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="w-full flex justify-center">
                      <FabricTemplateCanvas template={template} />
                    </div>
                    <Button 
                      onClick={() => toggleCustomize(template.id!)}
                      variant={isOpen ? "secondary" : "default"}
                      className="w-full"
                    >
                      {isOpen ? "Close Customize" : "Customize"}
                    </Button>
                    {isOpen && (
                      <div className="border-t pt-3">
                        <MemeChat 
                          onCustomize={handleCustomize(template.id!)} 
                          isLoading={customizingTemplateId === template.id}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )
        }
      </div>
    </div>

  );
}
