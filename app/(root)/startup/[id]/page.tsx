
import React, {Suspense} from 'react'
import {STARTUP_BY_ID_QUERY} from "@/sanity/lib/queries";
import {client} from "@/sanity/lib/client";
import {formatDate} from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import markdownIt from "markdown-it";
import View from "@/components/View";
import {Skeleton} from "@/components/ui/skeleton";

const md = markdownIt()

export const experimental_ppr=true


const Page =async ({params}:{params:Promise<{id:string}>}) => {
    const id = (await params).id
    const post = await client.fetch(STARTUP_BY_ID_QUERY, {id})
    const parsedContent = md.render(post?.pitch || '')
    return (
        <>
            <section className={'pink_container !min-h-[230px]'}>
                <p className={'tag'}>{formatDate(post?._createdAt)}</p>
                <h1 className={'heading'}>{post.title}</h1>
                <p className={'sub-heading !max-w-5xl'}>{post.description}</p>
            </section>
            <section className={'section_container'}>
                <img src={post.image} className={'w-full h-auto rounded-xl'} alt={post.title} />
                <div className={'space-y-5 mt-10 max-w-4xl mx-auto'}>
                    <div className={'flex-between gap-5'}>
                        <Link href={`/user/${post.author?._id}`} className={'flex gap-2 items-center mb-3'}>
                            <Image width={60} height={60} src={post.author.image} alt={post.author?.username} className={'rounded-full drop-shadow-lg'}/>
                            <div>
                                <p className={'text-20-medium'}>{post.author.name}</p>
                                <p className={'text-16-medium !text-black-300'}>{post.author.username}</p>
                            </div>
                        </Link>
                        <p className={'category-tag'}>{post.category}</p>
                    </div>
                    <h3 className={'text-30-bold'}>Startup Details</h3>
                    <article className={'prose max-w-4xl font-work-sans break-all'} dangerouslySetInnerHTML={{ __html: parsedContent }}/>
                    <hr className={'divider'}/>
                </div>
                <Suspense fallback={<Skeleton className={'view_skeleton'} />}>
                    <View id={id} />
                </Suspense>
            </section>
        </>
    )
}
export default Page
