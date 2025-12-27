"use client"
import { indexData } from "./actions/index-data";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { fetchTemplates, Template } from "@/lib/features/memes-templates-store/memesThunk";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import Image from "next/image";
import { AppDispatch } from "@/lib/store";


export default function Home() {
  const {loading, templates, error} : {loading : boolean, templates : Template[] | null, error : string | null} = useSelector((state : RootState) => state.fetchTemplates)
  if(error){
    return (<div>Error occured</div>)
  }
  if(loading){
    return (<div>Loading..</div>)
  }
  const dispatch = useDispatch<AppDispatch>()
  return (
    <div>
      <Button className="bg-white text-black" onClick={dispatch(fetchTemplates)}>Index Data</Button>
      {
        templates && templates.map((template : Template) => {
          return (<div key={template.name}>
            <Image src={template.url} alt={template.name}/>
          </div>)
        })
      }
    </div>
  );
}
