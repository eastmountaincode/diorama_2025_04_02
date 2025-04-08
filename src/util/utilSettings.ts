import { SceneType } from "../atoms/gameState";

// Default HUD transform values for each scene.
export const defaultHudTransforms: Record<SceneType, { zoom: number; translateX: number; translateY: number }> = {
    OpeningScene: { zoom: 2.5, translateX: 0, translateY: -30 }, // Higher zoom for opening scene.
    MainScene: { zoom: 1, translateX: 0, translateY: 0 },
};

export const MAX_ZOOM = 3.5;
export const MIN_ZOOM = 0.5;
