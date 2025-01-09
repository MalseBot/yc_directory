import React from 'react'
import Link from "next/link";
import Image from "next/image";
import {auth, signIn, signOut} from "@/auth";


const Navbar =async () => {
    const session = await auth();
    return (
        <header className="px-5 py-3 font-work-sans shadow-sm text-black bg-white">
            <nav className={'flex justify-between items-center'}>
                <Link href={'/'}><Image src={'/logo.png'} alt={'logo'} width={144} height={30}/></Link>
                <div className={'flex items-center gap-5'}>
                    {session && session?.user ?(
                        <>
                            <Link href={'/startup/create'}><span>Create</span></Link>
                            <form action={async () => {
                                "use server"
                                await signOut({redirectTo:"/"})
                            }}>
                                <button type={'submit'} className={''}>Logout</button>
                            </form>
                            <Link href={`/user.${session?.user?.id}`}><span>{session?.user?.name}</span></Link>
                        </>
                    ) : (<form
                        action={async () => {
                            "use server"
                            await signIn("google")
                        }}
                    >
                        <button type="submit">Signin with Google</button>
                    </form>)

                    }
                </div>
            </nav>
        </header>
    )
}
export default Navbar
