import NextAuth from "next-auth/next";
import { useRouter } from "next/navigation";
import axios from "axios";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: {
                    label: "email",
                    type: "username",
                    placeholder: "test@test.com",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const response = await axios.post(
                        `http://localhost:8080/api/auth/login`,
                        {
                            username: credentials?.email,
                            password: credentials?.password,
                        }
                    );

                    const user = response.data;

                    if (user.error) {
                        throw user;
                    }

                    return user;
                } catch (error) {
                    throw error.response.data;
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
    },
});

export { handler as GET, handler as POST };
