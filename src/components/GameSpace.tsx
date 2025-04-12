// src/components/GameSpace.tsx
import { HUDFrame } from './HUDFrame/HUDFrame'
import { DebugSceneSwitcher } from './DebugSceneSwitcher'
import { CameraPermissionModal, CameraPermissionBanner } from './CameraPermission'


export function GameSpace() {

    return (
        <div className="relative w-full h-full flex items-center justify-center bg-black">
            <CameraPermissionModal />
            <CameraPermissionBanner />
            <HUDFrame />
            <DebugSceneSwitcher />
        </div>
    )
}
