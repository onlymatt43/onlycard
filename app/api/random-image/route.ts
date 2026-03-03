import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface BunnyFile {
  ObjectName: string;
  IsDirectory: boolean;
  Length: number;
}

export async function GET() {
  try {
    const apiKey = process.env.BUNNY_STORAGE_API_KEY;
    const storageZone = process.env.BUNNY_STORAGE_ZONE || 'onlymatt-public';
    const folder = process.env.BUNNY_FOLDER || 'card';

    // Si pas de clé API, retourne l'image fallback
    if (!apiKey) {
      console.warn('Bunny Storage API key not configured, using fallback image');
      return NextResponse.json({
        url: 'https://onlymatt-public-zone.b-cdn.net/card/solo-pics14728a1b-b8ad-41b0-beac-e8f6b24202a8.JPEG',
        filename: 'fallback-image.jpg',
        totalImages: 1,
      });
    }

    // Liste les fichiers du folder Bunny Storage
    const response = await fetch(
      `https://ny.storage.bunnycdn.com/${storageZone}/${folder}/`,
      {
        headers: {
          AccessKey: apiKey,
        },
      }
    );

    if (!response.ok) {
      console.error('Bunny Storage API error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch images from Bunny Storage' },
        { status: response.status }
      );
    }

    const files: BunnyFile[] = await response.json();
    
    // Filtre uniquement les images (pas les dossiers)
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const imageFiles = files.filter(
      (file) =>
        !file.IsDirectory &&
        imageExtensions.some((ext) => file.ObjectName.toLowerCase().endsWith(ext))
    );

    if (imageFiles.length === 0) {
      return NextResponse.json(
        { error: 'No images found in the folder' },
        { status: 404 }
      );
    }

    // Sélectionne une image aléatoire
    const randomImage = imageFiles[Math.floor(Math.random() * imageFiles.length)];
    
    // Construit l'URL CDN avec cache buster (évite le cache Bunny)
    const cacheBuster = Date.now();
    const cdnUrl = `https://onlymatt-public-zone.b-cdn.net/${folder}/${randomImage.ObjectName}?v=${cacheBuster}`;

    return NextResponse.json({
      url: cdnUrl,
      filename: randomImage.ObjectName,
      totalImages: imageFiles.length,
    });
  } catch (error) {
    console.error('Random image API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
