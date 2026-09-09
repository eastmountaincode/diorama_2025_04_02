import { useEffect, useState } from 'react';
import {
  preloadGameAssets,
  type GameAssetProgress,
} from '../lib/gameAssetPreloader';

interface GameAssetLoadingScreenProps {
  onReady: () => void;
}

const INITIAL_PROGRESS: GameAssetProgress = {
  loaded: 0,
  total: 0,
  currentAsset: null,
};

export function GameAssetLoadingScreen({ onReady }: GameAssetLoadingScreenProps) {
  const [progress, setProgress] = useState(INITIAL_PROGRESS);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let isMounted = true;
    setErrorMessage(null);

    preloadGameAssets((nextProgress) => {
      if (isMounted) {
        setProgress(nextProgress);
      }
    })
      .then(() => {
        if (isMounted) {
          onReady();
        }
      })
      .catch((error) => {
        console.error('Game asset preload failed:', error);
        if (isMounted) {
          setErrorMessage('Some of the game could not be loaded.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [attempt, onReady]);

  const percent = progress.total === 0
    ? 0
    : Math.round((progress.loaded / progress.total) * 100);

  return (
    <main className="asset-loading-screen" aria-busy={errorMessage === null}>
      <div className="asset-loading-content">
        <p className="asset-loading-title">LOADING</p>
        <progress
          className="asset-loading-progress"
          max={Math.max(progress.total, 1)}
          value={progress.loaded}
          aria-label="Loading game assets"
        />
        <p className="asset-loading-status" aria-live="polite">
          {errorMessage ?? `${percent}%`}
        </p>
        {errorMessage ? (
          <button
            className="asset-loading-retry"
            type="button"
            onClick={() => setAttempt((currentAttempt) => currentAttempt + 1)}
          >
            TRY AGAIN
          </button>
        ) : null}
      </div>
    </main>
  );
}
