import type { Metadata } from 'next';
import Providers from '../../components/Providers';

export const metadata: Metadata = {
  icons: {
    icon: '/collabs-icon.png',
    apple: '/collabs-icon.png',
  },
};

export default function CreatorsLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
