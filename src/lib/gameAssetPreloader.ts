import { GAME_ASSETS } from '../generated/gameAssets';

export interface GameAssetProgress {
  loaded: number;
  total: number;
  currentAsset: string | null;
}

type ProgressListener = (progress: GameAssetProgress) => void;

const IMAGE_EXTENSION = /\.(?:gif|ico|jpe?g|png|webp)$/i;
const MEDIA_EXTENSION = /\.(?:mp3|mp4|wav)$/i;
const MAX_CONCURRENT_LOADS = 6;

const loadedAssets = new Set<string>();
const retainedImages: HTMLImageElement[] = [];
const mediaObjectUrls = new Map<string, string>();
const progressListeners = new Set<ProgressListener>();

let preloadPromise: Promise<void> | null = null;
let latestProgress: GameAssetProgress = {
  loaded: 0,
  total: GAME_ASSETS.length,
  currentAsset: null,
};

const normalizeAssetPath = (src: string) => src.startsWith('/') ? src : `/${src}`;

const emitProgress = (currentAsset: string | null) => {
  latestProgress = {
    loaded: loadedAssets.size,
    total: GAME_ASSETS.length,
    currentAsset,
  };

  progressListeners.forEach((listener) => listener(latestProgress));
};

const preloadImage = (src: string) => new Promise<void>((resolve, reject) => {
  const image = new Image();
  image.decoding = 'async';

  image.addEventListener('load', () => {
    retainedImages.push(image);

    // `load` confirms that the full file is present. Decode when supported so
    // the first room reveal does not also have to pay the initial decode cost.
    if (typeof image.decode === 'function') {
      image.decode().catch(() => undefined).finally(resolve);
      return;
    }

    resolve();
  }, { once: true });

  image.addEventListener('error', () => {
    reject(new Error(`Could not load image: ${src}`));
  }, { once: true });

  image.src = src;
});

const preloadMedia = async (src: string) => {
  const response = await fetch(src, { cache: 'force-cache' });

  if (!response.ok) {
    throw new Error(`Could not load media (${response.status}): ${src}`);
  }

  const blob = await response.blob();
  mediaObjectUrls.set(src, URL.createObjectURL(blob));
};

const preloadAsset = async (src: string) => {
  if (IMAGE_EXTENSION.test(src)) {
    await preloadImage(src);
    return;
  }

  if (MEDIA_EXTENSION.test(src)) {
    await preloadMedia(src);
    return;
  }

  throw new Error(`Unsupported game asset type: ${src}`);
};

const runPreload = async () => {
  const pendingAssets = GAME_ASSETS.filter((src) => !loadedAssets.has(src));
  const failures: Error[] = [];
  let nextIndex = 0;

  emitProgress(null);

  const worker = async () => {
    while (nextIndex < pendingAssets.length) {
      const src = pendingAssets[nextIndex];
      nextIndex += 1;

      try {
        await preloadAsset(src);
        loadedAssets.add(src);
        emitProgress(src);
      } catch (error) {
        failures.push(error instanceof Error ? error : new Error(String(error)));
      }
    }
  };

  const workerCount = Math.min(MAX_CONCURRENT_LOADS, pendingAssets.length);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));

  if (failures.length > 0) {
    const failedAssets = failures.map((failure) => failure.message).join('\n');
    throw new Error(`${failures.length} game asset(s) failed to load:\n${failedAssets}`);
  }

  emitProgress(null);
};

export const preloadGameAssets = (onProgress: ProgressListener) => {
  progressListeners.add(onProgress);
  onProgress(latestProgress);

  if (!preloadPromise) {
    preloadPromise = runPreload().catch((error) => {
      preloadPromise = null;
      throw error;
    });
  }

  return preloadPromise.finally(() => {
    progressListeners.delete(onProgress);
  });
};

export const gameAssetUrl = (src: string) => {
  const normalizedSrc = normalizeAssetPath(src);
  return mediaObjectUrls.get(normalizedSrc) ?? src;
};
