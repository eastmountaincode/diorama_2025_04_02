import { useState } from 'react';
import { useAtom } from 'jotai';
import { currentSceneAtom, inventoryStateAtom, SceneType, hudTransformAtom, isFigurineTouchingDropZoneAtom, isSceneTransitioningAtom, hydrantTaskCompletedAtom, cameraPermissionStatusAtom } from '../atoms/gameState';

// Define possible scenes for the SceneManager
const scenes: SceneType[] = ['OpeningScene', 'MainScene', 'HydrantScene', 'MirrorScene'];

// Define possible states for the Inventory (adjust as needed)
const inventoryStates: Array<'OpeningScene' | 'MainGame'> = ['OpeningScene', 'MainGame'];

export function DebugSceneSwitcher() {
  const [currentScene, setCurrentScene] = useAtom(currentSceneAtom);
  const [, setIsSceneTransitioning] = useAtom(isSceneTransitioningAtom);
  const [inventoryState, setInventoryState] = useAtom(inventoryStateAtom);
  const [hudTransform] = useAtom(hudTransformAtom);
  const [isFigurineTouchingDropZone] = useAtom(isFigurineTouchingDropZoneAtom);
  const [hydrantTaskCompleted, setHydrantTaskCompleted] = useAtom(hydrantTaskCompletedAtom);
  const [cameraPermissionStatus] = useAtom(cameraPermissionStatusAtom);
  const [isVisible, setIsVisible] = useState(false);
  
  const handleSceneChange = (scene: SceneType) => {
    // Only use transition for OpeningScene to MainScene
    if (currentScene === 'OpeningScene' && scene === 'MainScene') {
      setIsSceneTransitioning(true);
      setTimeout(() => {
        setCurrentScene(scene);
      }, 500);
    } else {
      // Direct scene change without transition
      setCurrentScene(scene);
    }
  };

  // Get display color based on permission status
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'granted': return 'bg-green-500';
      case 'denied': return 'bg-red-500';
      case 'dismissed': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

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
                    onClick={() => handleSceneChange(scene)}
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
            
            {/* Camera Permission Status section (read-only) */}
            <div className="flex flex-col items-start gap-1">
              <span className="text-[10px]">Camera Permission:</span>
              <div className={`text-[10px] px-1.5 py-0.5 rounded w-full text-center ${getStatusColor(cameraPermissionStatus)}`}>
                {cameraPermissionStatus}
              </div>
            </div>
            
            {/* Hydrant Task Completed toggle */}
            <div className="flex flex-col items-start gap-1">
              <span className="text-[10px]">Hydrant Task:</span>
              <button
                onClick={() => setHydrantTaskCompleted(!hydrantTaskCompleted)}
                className={`px-1.5 py-0.5 rounded text-[10px] w-full ${
                  hydrantTaskCompleted
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {hydrantTaskCompleted ? 'Completed' : 'Not Completed'}
              </button>
            </div>
            
            {/* HUD transform information section */}
            <div className="flex flex-col items-start gap-1">
              <span className="text-[10px]">HUD Transform:</span>
              <div className="text-[10px]">
                Zoom: {hudTransform.zoom.toFixed(2)} <br />
                TranslateX: {hudTransform.translateX.toFixed(2)} <br />
                TranslateY: {hudTransform.translateY.toFixed(2)}
              </div>
            </div>

            {/* Figurine drop zone collision state */}
            <div className="flex flex-col items-start gap-1">
              <span className="text-[10px]">Figurine Status:</span>
              <div className={`text-[10px] px-1.5 py-0.5 rounded ${isFigurineTouchingDropZone ? 'bg-green-500' : 'bg-red-500'}`}>
                {isFigurineTouchingDropZone ? 'Touching Drop Zone' : 'Not Touching Drop Zone'}
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
