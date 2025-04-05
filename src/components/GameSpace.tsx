// src/components/GameSpace.tsx
import { HUDFrameWorking } from './HUDFrameWorking'
import { DebugSceneSwitcher } from './DebugSceneSwitcher'; // Import the new component


export function GameSpace() {

    return (
        <div className="relative w-full h-full flex items-center justify-center bg-black">

            <HUDFrameWorking />
            <DebugSceneSwitcher /> {/* Render the new component */}
        </div>
    )
}
