import React from 'react'
import {STARTUPS_BY_AUTHOR} from "@/sanity/lib/queries";
import {client} from "@/sanity/lib/client";
import StartupCard, {StartupTypeCard} from "@/components/StartupCard";

const UserStartups = async ({id}:{id:string}) => {
    const startups= await client.fetch(STARTUPS_BY_AUTHOR, {id})



    return (
        <>{startups.length > 0 ? (
            startups.map((startup:StartupTypeCard)=>(
            <StartupCard post={startup} key={startup._id}/>
            ))) : (<p className={'no-result'}>No posts yet</p>)}</>
    )
}
export default UserStartups
