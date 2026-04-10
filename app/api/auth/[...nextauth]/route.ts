import NextAuth from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';

const useSecureCookies = process.env.NEXTAUTH_URL?.startsWith('https://');
const cookieDomain = '.onlymatt.ca';

const handler = NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: '2.0',
    }),
  ],
  cookies: {
    sessionToken: {
      name: `${useSecureCookies ? '__Secure-' : ''}next-auth.session-token`,
      options: { httpOnly: true, sameSite: 'lax', path: '/', secure: useSecureCookies, domain: cookieDomain },
    },
    callbackUrl: {
      name: `${useSecureCookies ? '__Secure-' : ''}next-auth.callback-url`,
      options: { httpOnly: true, sameSite: 'lax', path: '/', secure: useSecureCookies, domain: cookieDomain },
    },
    csrfToken: {
      name: `${useSecureCookies ? '__Host-' : ''}next-auth.csrf-token`,
      options: { httpOnly: true, sameSite: 'lax', path: '/', secure: useSecureCookies },
    },
  },
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
