import { useAtom } from 'jotai';
import { currentSceneAtom, SceneType } from '../atoms/gameState';

// Define possible scenes (you might want to centralize this later)
const scenes: SceneType[] = ['OpeningScene', 'MainScene'];

export function DebugSceneSwitcher() {
    const [currentScene, setCurrentScene] = useAtom(currentSceneAtom);

    return (
        <div className="absolute bottom-0 left-0 p-2 bg-gray-700 text-white text-xs rounded z-50">
            <div>Current Scene: {currentScene}</div>
            <div className="flex gap-2 mt-1">
                {scenes.map((scene) => (
                    <button
                        key={scene}
                        onClick={() => setCurrentScene(scene)}
                        className={`px-2 py-1 rounded ${
                            currentScene === scene
                                ? 'bg-blue-500'
                                : 'bg-gray-500 hover:bg-gray-600'
                        }`}
                    >
                        {scene}
                    </button>
                ))}
            </div>
        </div>
    );
} 