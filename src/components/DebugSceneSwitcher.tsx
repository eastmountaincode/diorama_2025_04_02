import { useState } from 'react';
import { useAtom } from 'jotai';
import { currentSceneAtom, inventoryStateAtom, SceneType, hudTransformAtom, isFigurineTouchingDropZoneAtom, isSceneTransitioningAtom, hydrantTaskCompletedAtom, mirrorTaskCompletedAtom, computerTaskCompletedAtom, cameraPermissionStatusAtom, isEndSceneAtom, ringsAnimationActiveAtom } from '../atoms/gameState';

// Define possible scenes for the SceneManager
const scenes: SceneType[] = ['OpeningScene', 'MainScene', 'HydrantScene', 'MirrorScene', 'ComputerScene', 'RadioScene', 'EndGameScene'];

// Define possible states for the Inventory (adjust as needed)
const inventoryStates: Array<'OpeningScene' | 'MainGame'> = ['OpeningScene', 'MainGame'];

export function DebugSceneSwitcher() {
  const [currentScene, setCurrentScene] = useAtom(currentSceneAtom);
  const [, setIsSceneTransitioning] = useAtom(isSceneTransitioningAtom);
  const [inventoryState, setInventoryState] = useAtom(inventoryStateAtom);
  const [hudTransform] = useAtom(hudTransformAtom);
  const [isFigurineTouchingDropZone] = useAtom(isFigurineTouchingDropZoneAtom);
  const [hydrantTaskCompleted, setHydrantTaskCompleted] = useAtom(hydrantTaskCompletedAtom);
  const [mirrorTaskCompleted, setMirrorTaskCompleted] = useAtom(mirrorTaskCompletedAtom);
  const [computerTaskCompleted, setComputerTaskCompleted] = useAtom(computerTaskCompletedAtom);
  const [isEndScene, setIsEndScene] = useAtom(isEndSceneAtom);
  const [cameraPermissionStatus] = useAtom(cameraPermissionStatusAtom);
  const [ringsAnimationActive, setRingsAnimationActive] = useAtom(ringsAnimationActiveAtom);
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
          <div className="flex flex-row gap-2">
            {/* Left Column */}
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
              
              {/* HUD transform information section */}
              <div className="flex flex-col items-start gap-1">
                <span className="text-[10px]">HUD Transform:</span>
                <div className="text-[10px]">
                  Zoom: {hudTransform.zoom.toFixed(2)} <br />
                  TranslateX: {hudTransform.translateX.toFixed(2)} <br />
                  TranslateY: {hudTransform.translateY.toFixed(2)}
                </div>
              </div>
            </div>
            
            {/* Right Column */}
            <div className="flex flex-col items-start gap-2">
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
              
              {/* Mirror Task Completed toggle */}
              <div className="flex flex-col items-start gap-1">
                <span className="text-[10px]">Mirror Task:</span>
                <button
                  onClick={() => setMirrorTaskCompleted(!mirrorTaskCompleted)}
                  className={`px-1.5 py-0.5 rounded text-[10px] w-full ${
                    mirrorTaskCompleted
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  {mirrorTaskCompleted ? 'Completed' : 'Not Completed'}
                </button>
              </div>
              
              {/* Computer Task Completed toggle */}
              <div className="flex flex-col items-start gap-1">
                <span className="text-[10px]">Computer Task:</span>
                <button
                  onClick={() => setComputerTaskCompleted(!computerTaskCompleted)}
                  className={`px-1.5 py-0.5 rounded text-[10px] w-full ${
                    computerTaskCompleted
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  {computerTaskCompleted ? 'Completed' : 'Not Completed'}
                </button>
              </div>
              
              {/* End Scene State toggle */}
              <div className="flex flex-col items-start gap-1">
                <span className="text-[10px]">End Scene State:</span>
                <button
                  onClick={() => setIsEndScene(!isEndScene)}
                  className={`px-1.5 py-0.5 rounded text-[10px] w-full ${
                    isEndScene
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  {isEndScene ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {/* Figurine drop zone collision state */}
              <div className="flex flex-col items-start gap-1">
                <span className="text-[10px]">Figurine Status:</span>
                <div className={`text-[10px] px-1.5 py-0.5 rounded w-full text-center ${isFigurineTouchingDropZone ? 'bg-green-500' : 'bg-red-500'}`}>
                  {isFigurineTouchingDropZone ? 'Touching Drop Zone' : 'Not Touching Drop Zone'}
                </div>
              </div>

              {/* Rings Animation toggle */}
              <div className="flex flex-col items-start gap-1">
                <span className="text-[10px]">Rings Animation:</span>
                <button
                  onClick={() => setRingsAnimationActive(!ringsAnimationActive)}
                  className={`px-1.5 py-0.5 rounded text-[10px] w-full ${
                    ringsAnimationActive
                      ? 'bg-purple-500 hover:bg-purple-600'
                      : 'bg-gray-500 hover:bg-gray-600'
                  }`}
                >
                  {ringsAnimationActive ? 'Active' : 'Trigger Animation'}
                </button>
              </div>
            </div>
          </div>

          {/* Hide button at the bottom */}
          <button
            onClick={() => setIsVisible(false)}
            className="px-1.5 py-0.5 rounded text-[10px] w-full bg-red-500 hover:bg-red-600 mt-2"
          >
            Hide
          </button>
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
