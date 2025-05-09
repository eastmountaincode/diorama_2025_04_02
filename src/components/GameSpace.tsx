// src/components/GameSpace.tsx
import { HUDFrame } from './HUDFrame/HUDFrame'
// import { DebugSceneSwitcher } from './DebugSceneSwitcher'
import { CameraPermissionBanner } from './CameraPermission'


export function GameSpace() {
    return (
        <div className="relative w-full h-full flex items-center justify-center bg-black">
            <CameraPermissionBanner />
            <HUDFrame />
            {/* <DebugSceneSwitcher /> */}
        </div>
    )
}
