import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from "next-auth/providers/credentials"

// const JAVA_URL = "http://localhost:8080"
const JAVA_URL = process.env.NEXT_PUBLIC_JAVA_BACKEND_URL || "http://localhost:8080";

const handler = NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
    },
    providers: [
        GithubProvider({
            clientId: process.env.Github_ID,
            clientSecret: process.env.Github_SECRET
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                }
            }
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const res = await fetch(`${JAVA_URL}/api/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: credentials.email, password: credentials.password })
                    })
                    const data = await res.json()
                    if (!res.ok) throw new Error(data.message || "Invalid email or password")
                    return {
                        id: data.user?._id || data.user?.email,
                        email: data.user?.email,
                        name: data.user?.username,
                        javaToken: data.token
                    }
                } catch (error) {
                    throw new Error(error.message || "Invalid email or password")
                }
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account.provider === "github" || account.provider === "google") {
                try {
                    const res = await fetch(`${JAVA_URL}/api/auth/oauth`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: user.email, name: user.name || user.email.split("@")[0] })
                    })
                    const data = await res.json()
                    if (data.token) {
                        user.javaToken = data.token
                    }
                } catch (e) {
                    console.error("OAuth Java sync failed:", e)
                }
            }
            return true
        },
        async jwt({ token, user }) {
            if (user) {
                token.javaToken = user.javaToken
                token.email = user.email
                token.name = user.name
            }
            return token
        },
        async session({ session, token }) {
            session.user.email = token.email
            session.user.name = token.name
            session.javaToken = token.javaToken
            return session
        }
    }
})

export { handler as GET, handler as POST }
