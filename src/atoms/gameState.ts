import { atom } from 'jotai';

export type SceneType = 'OpeningScene' | 'MainScene';
export const currentSceneAtom = atom<SceneType>('OpeningScene');

export type InventoryState = 'OpeningScene' | 'MainGame';
export const inventoryStateAtom = atom<InventoryState>('OpeningScene');

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