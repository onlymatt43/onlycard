import NextAuth from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';
import { NextRequest } from 'next/server';

const AUTH_HOST = 'me.onlymatt.ca';
const useSecureCookies = process.env.NEXTAUTH_URL?.startsWith('https://');
const cookieDomain = '.onlymatt.ca';

const authOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: '2.0' as const,
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
    async session({ session, token }: { session: Record<string, unknown>; token: Record<string, unknown> }) {
      if (token) {
        (session as Record<string, unknown>).user = {
          ...(session as Record<string, unknown>).user as object,
          username: token.username,
          image: token.picture,
          id: token.sub,
        };
      }
      return session;
    },
    async jwt({ token, profile }: { token: Record<string, unknown>; profile?: Record<string, unknown> }) {
      if (profile) {
        const p = profile as { data?: { username?: string; profile_image_url?: string } };
        token.username = p.data?.username || '';
        token.picture = p.data?.profile_image_url?.replace('_normal', '_400x400') || token.picture;
      }
      return token;
    },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handler = NextAuth(authOptions as any);

// Wrap handler to force host header to me.onlymatt.ca so OAuth redirect_uri is always correct
function forceHost(req: NextRequest) {
  const headers = new Headers(req.headers);
  headers.set('host', AUTH_HOST);
  headers.set('x-forwarded-host', AUTH_HOST);
  const fixedReq = new NextRequest(req.url.replace(/\/\/[^/]+/, `//${AUTH_HOST}`), {
    method: req.method,
    headers,
    body: req.body,
  });
  return handler(fixedReq as unknown as Parameters<typeof handler>[0]);
}

export { forceHost as GET, forceHost as POST };
