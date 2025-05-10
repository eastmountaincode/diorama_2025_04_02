import { SceneType, BreakpointType } from "../atoms/gameState";

// Default HUD transform values for each scene, separated by breakpoint
export const defaultHudTransforms: Record<BreakpointType, Record<SceneType, { zoom: number; translateX: number; translateY: number }>> = {
  desktop: {
    OpeningScene: { zoom: 2.5, translateX: 0, translateY: -40 },
    MainScene: { zoom: 1.0, translateX: 0, translateY: 0 },
    HydrantScene: { zoom: 1.4, translateX: 0, translateY: 0 },
    RadioScene: { zoom: 1.2, translateX: 0, translateY: 0 },
    MirrorScene: { zoom: 1.2, translateX: 0, translateY: 0 },
    ComputerScene: { zoom: 3.5, translateX: 0, translateY: 0 },
    EndGameScene: { zoom: 1.0, translateX: 0, translateY: 0 },
  },
  mobile: {
    OpeningScene: { zoom: 2.5, translateX: 0, translateY: -30 },
    MainScene: { zoom: 1, translateX: 0, translateY: 0 },
    HydrantScene: { zoom: 2.3, translateX: 0, translateY: 0 },
    RadioScene: { zoom: 2.3, translateX: 0, translateY: 0 },
    MirrorScene: { zoom: 2.3, translateX: -60, translateY: 0 },
    ComputerScene: { zoom: 6, translateX: 0, translateY: 0 },
    EndGameScene: { zoom: 1.0, translateX: 0, translateY: 0 },
  }
};

// export const MAX_ZOOM = 3.5;
export const MAX_ZOOM = 999999;
export const MIN_ZOOM = 0.5;
