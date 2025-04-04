import { atom } from 'jotai';

export type SceneType = 'main' | 'scene1' | 'scene2' | 'scene3';

export const currentSceneAtom = atom<SceneType>('main'); 