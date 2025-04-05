import { atom } from 'jotai';

export type SceneType = 'OpeningScene' | 'MainScene';

export const currentSceneAtom = atom<SceneType>('OpeningScene');