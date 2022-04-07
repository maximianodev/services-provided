import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      // authorization: {
      //   params: {
      //     prompt: "consent",
      //     access_type: "offline",
      //     response_type: "code"
      //   }
      // },
    })
  ],

  callbacks: {
    async signIn({ user }) {
      const { email } = user
      const AUTH_EMAIL = process.env.AUTH_EMAIL

      if (email !== AUTH_EMAIL) {
        return false
      } else {
        return true
      }
    }
  }
})