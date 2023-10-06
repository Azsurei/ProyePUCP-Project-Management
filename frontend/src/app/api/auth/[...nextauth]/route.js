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
                    placeholder: "user@pucp.edu.pe",
                },
                password: { label: "Contraseña", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const response = await axios.post(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
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
    callbacks: {
        async jwt({ token, user }) {
            return { ...token, ...user };
        },
        async session({ session, token }) {
            session.user = token;
            return session;
        },
        async signIn({ user, account, profile, email, credentials }) {
            if (account.provider === "google") {
                const loginUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`;
                const registerUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`;
                let authenticationFailed = false;

                try {
                    const loginResponse = await axios.post(loginUrl, {
                        username: user.email,
                        password: user.id,
                    });

                    if (
                        loginResponse.data &&
                        loginResponse.data.id &&
                        loginResponse.data.token
                    ) {
                        user.id = loginResponse.data.id;
                        user.token = loginResponse.data.token;
                        return { success: true, user };
                    }
                } catch (error) {
                    if (error.response && error.response.status === 401) {
                        try {
                            const registerResponse = await axios.post(
                                registerUrl,
                                {
                                    nombres: profile.given_name,
                                    apellidos: profile.family_name,
                                    correoElectronico: user.email,
                                    password: user.id,
                                }
                            );

                            if (
                                !registerResponse.data ||
                                !registerResponse.data.error
                            ) {
                                // Attempt login again after successful registration
                                const loginResponseAfterRegister =
                                    await axios.post(loginUrl, {
                                        username: user.email,
                                        password: user.id,
                                    });

                                if (
                                    loginResponseAfterRegister.data &&
                                    loginResponseAfterRegister.data.id &&
                                    loginResponseAfterRegister.data.token
                                ) {
                                    user.id =
                                        loginResponseAfterRegister.data.id;
                                    user.token =
                                        loginResponseAfterRegister.data.token;
                                    return { success: true, user };
                                }
                            } else {
                                console.error(
                                    "Error en el registro de usuario de Google: ",
                                    registerResponse.data.error
                                );
                            }
                        } catch (registrationError) {
                            console.error(
                                "Error en la conexión o respuesta para el registro de usuario de Google: ",
                                registrationError
                            );
                        }
                    } else {
                        // Handle other errors here
                        console.error("Error en autenticación de usuario de Google: ", error);
                        authenticationFailed = true;
                    }
                }
                return false;
            }
            return true;
        },
    },
});

export { handler as GET, handler as POST };
