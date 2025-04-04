import { useState } from 'react';
import { useAtom } from 'jotai';
import { currentSceneAtom, inventoryStateAtom, SceneType } from '../atoms/gameState';

// Define possible scenes for the SceneManager
const scenes: SceneType[] = ['OpeningScene', 'MainScene'];

// Define possible states for the Inventory (adjust as needed)
const inventoryStates: Array<'OpeningScene' | 'MainGame'> = ['OpeningScene', 'MainGame'];

export function DebugSceneSwitcher() {
  const [currentScene, setCurrentScene] = useAtom(currentSceneAtom);
  const [inventoryState, setInventoryState] = useAtom(inventoryStateAtom);
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="absolute top-4 right-4 z-50">
      {isVisible ? (
        <div className="p-1 bg-gray-700 text-white text-[10px] rounded">
          <div className="flex flex-col items-start gap-2">
            {/* Scene switching section */}
            <div className="flex flex-col items-start gap-1">
              <span className="text-[10px]">Current Scene:</span>
              <div className="flex flex-col gap-1 w-full">
                {scenes.map((scene) => (
                  <button
                    key={scene}
                    onClick={() => setCurrentScene(scene)}
                    className={`px-1.5 py-0.5 rounded text-[10px] w-full ${
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

            {/* Inventory state switching section */}
            <div className="flex flex-col items-start gap-1">
              <span className="text-[10px]">Inventory State:</span>
              <div className="flex flex-col gap-1 w-full">
                {inventoryStates.map((state) => (
                  <button
                    key={state}
                    onClick={() => setInventoryState(state)}
                    className={`px-1.5 py-0.5 rounded text-[10px] w-full ${
                      inventoryState === state
                        ? 'bg-blue-500'
                        : 'bg-gray-500 hover:bg-gray-600'
                    }`}
                  >
                    {state}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Hide button */}
            <button
              onClick={() => setIsVisible(false)}
              className="px-1.5 py-0.5 rounded text-[10px] w-full bg-red-500 hover:bg-red-600 mt-1"
            >
              Hide
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsVisible(true)}
          className="px-1.5 py-0.5 rounded text-[10px] bg-gray-700 text-white hover:bg-gray-600"
        >
          Show Debug
        </button>
      )}
    </div>
  );
}
