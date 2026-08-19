import React from 'react';
import LinkTree from './components/LinkTree';
import BackgroundVideo from './components/BackgroundVideo';
import config from '../data/config.json';

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const layout = sp?.layout as string | undefined;
  const isSquareLayout = layout === 'square';
  const isEmbedMode = sp?.embed === 'true';

  // Site-level background video (home only; embeds stay lightweight)
  const backgroundVideo = (config as { backgroundVideo?: string }).backgroundVideo;
  const showVideo = Boolean(backgroundVideo) && !isEmbedMode;

  return (
    <>
      {showVideo && <BackgroundVideo src={backgroundVideo!} overlayClassName="bg-black/60" />}
      <LinkTree
        isSquareLayout={isSquareLayout}
        isEmbedMode={isEmbedMode}
        transparentBackground={showVideo}
      />
    </>
  );
}
