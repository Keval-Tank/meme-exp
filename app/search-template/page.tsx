"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { generateQueryThunk } from "@/lib/features/query-store/queryThunk"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { AppDispatch, RootState } from "@/lib/store"
import Image from "next/image"

const formSchema = z.object({
  search: z.string(),
})

export default function SearchTemplate() {
  const {error, loading, data} = useSelector((state : any) => state.generateQuery)
  const dispatch = useDispatch<AppDispatch>()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    dispatch(generateQueryThunk(values.search))
  }

  return (
    <div>
      <h1>Search Template</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Search</FormLabel>
                <FormControl>
                  <Input placeholder="Enter search term" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <div>{loading && "loading.."}</div>
      <div>{error && "Error occured"}</div>
      <div>{!loading && data && data.data.map((obj:{url:string}) => {
         return <Image key={obj.url} src={obj.url} alt="template" height={300} width={300} className="h-auto w-auto"/>
      })}</div>
    </div>
  )
}

