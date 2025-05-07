import { atom } from 'jotai';

export type SceneType = 'OpeningScene' | 'MainScene' | 'HydrantScene' | 'RadioScene' | 'MirrorScene' | 'ComputerScene' | 'EndGameScene';
export const currentSceneAtom = atom<SceneType>('OpeningScene');

export type InventoryState = 'OpeningScene' | 'MainGame';
export const inventoryStateAtom = atom<InventoryState>('OpeningScene');

export type BreakpointType = 'mobile' | 'desktop';
export const breakpointAtom = atom<BreakpointType>('desktop');

export interface HudTransform {
    zoom: number;
    translateX: number;
    translateY: number;
}
export const hudTransformAtom = atom<HudTransform>({
    zoom: 1,
    translateX: 0,
    translateY: 0,
});

// Atom to store MainScene's transform state, persisted when navigating away
export const mainSceneTransformAtom = atom<HudTransform>({
    zoom: 1,
    translateX: 0,
    translateY: 0,
});

// Interface to track position and dimensions of the drop zone
export interface DropZoneShape {
    // Bounding box (for reference)
    x: number;
    y: number;
    width: number;
    height: number;
    // Ellipse specific properties
    cx: number;  // center x
    cy: number;  // center y
    rx: number;  // x-radius
    ry: number;  // y-radius
    active: boolean;
}

// Initial state with inactive drop zone
export const dropZoneRectAtom = atom<DropZoneShape>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    cx: 0,
    cy: 0,
    rx: 0,
    ry: 0,
    active: false
});

// Atom to track if the figurine is touching the drop zone
export const isFigurineTouchingDropZoneAtom = atom<boolean>(false);

// Atom to track if the figurine has been successfully placed in the drop zone
export const isFigurinePlacedAtom = atom<boolean>(false);

// Atom to control when scene transitions should be animated
export const isSceneTransitioningAtom = atom<boolean>(false);

// Atom to control OpeningScene visibility independently
export const showOpeningSceneAtom = atom<boolean>(true);

// Floor boundary definition for the MainScene
export interface Point {
  x: number;
  y: number;
}

export interface FloorBoundaryShape {
  topLeft: Point;
  topRight: Point;
  bottomRight: Point;
  bottomLeft: Point;
}

// Shared definition of floor boundary with exact coordinates
export const FLOOR_BOUNDARY = {
  mobile: {
    topLeft: { x: 19, y: 38.4 },
    topRight: { x: 52, y: 38.4 },
    bottomRight: { x: 74, y: 53 },
    bottomLeft: { x: 6, y: 53 }
  },
  desktop: {
    topLeft: { x: 24, y: 37.2 },
    topRight: { x: 49, y: 37.2 },
    bottomRight: { x: 66.3, y: 62 },
    bottomLeft: { x: 13, y: 62.5 }
  }
};
// Offset for the floor boundary
export const FLOOR_BOUNDARY_OFFSET = {
  x: 10,
  y: 10
};

// Atom to track the figurine's position in MainScene
export const figurinePositionAtom = atom<{x: number, y: number}>({
  x: 0,
  y: 0
});

// Atoms to track if figurine is near interactive elements
export const isNearMirrorAtom = atom<boolean>(false);
export const isNearHydrantAtom = atom<boolean>(false);
export const isNearPhoneAtom = atom<boolean>(false);
export const isNearComputerAtom = atom<boolean>(false);
export const isNearRadioAtom = atom<boolean>(false);


export const hydrantTaskCompletedAtom = atom<boolean>(false);
export const radioTaskCompletedAtom = atom<boolean>(false);
export const mirrorTaskCompletedAtom = atom<boolean>(false);
export const computerTaskCompletedAtom = atom<boolean>(false);

// Camera permission states: 'not-requested', 'granted', 'denied', 'dismissed'
export type CameraPermissionStatus = 'not-requested' | 'granted' | 'denied' | 'dismissed';
export const cameraPermissionStatusAtom = atom<CameraPermissionStatus>('not-requested');

// Control visibility of the camera permission modal
export const showCameraPermissionModalAtom = atom<boolean>(false);

// Track when the mirror transition is complete and ready to show the button
export const mirrorTransitionCompleteAtom = atom<boolean>(false);

// Track if a photo is currently being displayed in the MirrorScene
export const isPhotoDisplayedAtom = atom<boolean>(false);

// Track when we've reached the end game state
export const isEndSceneAtom = atom<boolean>(false);

// Atom to track if the audio should be playing
export const isAudioEnabledAtom = atom<boolean>(true);

// Atom to track if the figurine is currently being dragged
export const isDraggingFigurineAtom = atom<boolean>(false);