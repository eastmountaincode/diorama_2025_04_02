import { atom } from 'jotai';

export type SceneType = 'OpeningScene' | 'MainScene';
export const currentSceneAtom = atom<SceneType>('OpeningScene');

export type InventoryState = 'OpeningScene' | 'MainGame';
export const inventoryStateAtom = atom<InventoryState>('OpeningScene');
