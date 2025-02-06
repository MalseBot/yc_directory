// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { AUTHOR_BY_GITHUB_ID} from "@/sanity/lib/queries";
import {client} from "@/sanity/lib/client";
import {writeClient} from "@/sanity/lib/write-client";
import GitHub from "@auth/core/providers/github";
import NextAuth from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [GitHub],
    callbacks: {
        async signIn({
                         user: { name, email, image },
                         profile: { id, login, bio },
                     }) {
            const existingUser = await client
                .withConfig({ useCdn: false })
                .fetch(AUTHOR_BY_GITHUB_ID, {
                    id,
                });

            if (!existingUser) {
                await writeClient.create({
                    _type: "author",
                    id,
                    name,
                    username: login,
                    email,
                    image,
                    bio: bio || "",
                });
            }

            return true;

        },
        async jwt({ token, account, profile }) {
            if (account && profile) {
                const user = await client
                    .withConfig({ useCdn: false })
                    .fetch(AUTHOR_BY_GITHUB_ID, {
                        id: profile?.id,
                    });

                token.id = user?._id;
            }

            return token;
        },
        async session({ session, token }) {
            Object.assign(session, { id: token.id });
            return session;
        },
    },
});