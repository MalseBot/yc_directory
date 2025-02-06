'use server'

import {auth} from "@/auth";
import slugify from "slugify";
import {writeClient} from "@/sanity/lib/write-client";

export const createPitch = async (stats:any, form:FormData,pitch:string ) => {
    const session =await auth()


       if(!session)return JSON.parse(JSON.stringify({error: 'not signed', status: 'ERROR'}));
       const {title,description,category,link} = Object.fromEntries(
           Array.from(form).filter(([key])=>key != 'pitch'));

const slug = slugify(title as string,{lower:true , strict:true});

       try{
           const startup ={
               title,
               description,
               category,
               image:link,
               slug:{
                   _type:slug,
                   current:slug,
               },
               author:{
                   _type:'reference',
                   _ref:session?.id
               },
               pitch
           }

           const result = await writeClient.create({_type:'startup', ...startup});
           return JSON.parse(JSON.stringify({...result, error: '', status: "SUCCESS"}));

       }catch (error){
           console.log(error);
           return JSON.parse(JSON.stringify({ error: JSON.stringify(error), status: "ERROR"}));

       }

}