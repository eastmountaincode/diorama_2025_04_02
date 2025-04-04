// src/components/GameSpace.tsx
import { HUDFrameWorking } from './HUDFrameWorking'

export function GameSpace() {
    return (
        <div className="w-full h-full flex items-center justify-center bg-black">
            <HUDFrameWorking />
        </div>
    )
}
