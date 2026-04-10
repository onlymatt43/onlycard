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
      options: { httpOnly: true, sameSite: 'lax' as const, path: '/', secure: useSecureCookies, domain: cookieDomain },
    },
    callbackUrl: {
      name: `${useSecureCookies ? '__Secure-' : ''}next-auth.callback-url`,
      options: { httpOnly: true, sameSite: 'lax' as const, path: '/', secure: useSecureCookies, domain: cookieDomain },
    },
    csrfToken: {
      name: `${useSecureCookies ? '__Host-' : ''}next-auth.csrf-token`,
      options: { httpOnly: true, sameSite: 'lax' as const, path: '/', secure: useSecureCookies },
    },
  },
  callbacks: {
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Allow redirects to any *.onlymatt.ca subdomain
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      try {
        const u = new URL(url);
        if (u.hostname.endsWith('.onlymatt.ca') || u.hostname === 'onlymatt.ca') return url;
      } catch {}
      return baseUrl;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user = {
          ...session.user,
          username: token.username,
          image: token.picture,
          id: token.sub,
        };
      }
      return session;
    },
    async jwt({ token, profile }) {
      if (profile) {
        const p = profile as { data?: { username?: string; profile_image_url?: string } };
        token.username = p.data?.username || '';
        token.picture = p.data?.profile_image_url?.replace('_normal', '_400x400') || token.picture;
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };
