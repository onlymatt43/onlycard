import NextAuth from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';

const handler = NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: '2.0',
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Expose Twitter username and image in session
      if (token) {
        session.user = {
          ...session.user,
          // @ts-expect-error extending session
          username: token.username,
          image: token.picture,
          id: token.sub,
        };
      }
      return session;
    },
    async jwt({ token, profile }) {
      if (profile) {
        // Twitter v2 profile has data.username
        const p = profile as { data?: { username?: string; profile_image_url?: string } };
        token.username = p.data?.username || '';
        token.picture = p.data?.profile_image_url?.replace('_normal', '_400x400') || token.picture;
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };
