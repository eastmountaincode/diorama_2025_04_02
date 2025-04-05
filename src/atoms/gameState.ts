import { atom } from 'jotai';

export type SceneType = 'OpeningScene' | 'MainScene';
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