// src/components/GameSpace.tsx
import { HUDFrame } from './HUDFrame/HUDFrame'
import { DebugSceneSwitcher } from './DebugSceneSwitcher'; // Import the new component


export function GameSpace() {

    return (
        <div className="relative w-full h-full flex items-center justify-center bg-black">

            <HUDFrame />
            <DebugSceneSwitcher /> {/* Render the new component */}
        </div>
    )
}
