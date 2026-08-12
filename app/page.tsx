import React from 'react';
import LinkTree from './components/LinkTree';

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const layout = sp?.layout as string | undefined;
  const isSquareLayout = layout === 'square';
  const isEmbedMode = sp?.embed === 'true';

  return <LinkTree isSquareLayout={isSquareLayout} isEmbedMode={isEmbedMode} />;
}
