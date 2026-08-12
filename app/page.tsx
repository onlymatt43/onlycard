import React from 'react';
import LinkTree from './components/LinkTree';

export default function HomePage({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const layout = searchParams?.layout as string | undefined;
  const isSquareLayout = layout === 'square';
  const isEmbedMode = searchParams?.embed === 'true';

  return <LinkTree isSquareLayout={isSquareLayout} isEmbedMode={isEmbedMode} />;
}
