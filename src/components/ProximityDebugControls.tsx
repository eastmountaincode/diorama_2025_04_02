import React from 'react';

interface ProximityDebugControlsProps {
    elementName: string;
    position: { x: number, y: number };
    threshold: number;
    onPositionChange: (newPosition: { x: number, y: number }) => void;
    onThresholdChange: (newThreshold: number) => void;
}

const ProximityDebugControls: React.FC<ProximityDebugControlsProps> = ({
    elementName,
    position,
    threshold,
    onPositionChange,
    onThresholdChange
}) => {
    const handleXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newX = parseFloat(e.target.value);
        onPositionChange({ x: newX, y: position.y });
    };

    const handleYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newY = parseFloat(e.target.value);
        onPositionChange({ x: position.x, y: newY });
    };

    const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newThreshold = parseFloat(e.target.value);
        onThresholdChange(newThreshold);
    };

    return (
        <div className="flex flex-col bg-black bg-opacity-70 p-2 rounded-md mb-2">
            <h3 className="text-white font-bold mb-1">{elementName}</h3>
            
            <div className="flex items-center mb-1">
                <label className="text-white mr-2 w-6">X:</label>
                <input 
                    type="number" 
                    value={position.x.toFixed(1)} 
                    onChange={handleXChange}
                    step={0.1}
                    className="w-20 p-1 bg-gray-800 text-white rounded"
                />
                <input
                    type="range"
                    min={0}
                    max={100}
                    step={0.1}
                    value={position.x}
                    onChange={handleXChange}
                    className="ml-2 flex-grow"
                />
            </div>
            
            <div className="flex items-center mb-1">
                <label className="text-white mr-2 w-6">Y:</label>
                <input 
                    type="number" 
                    value={position.y.toFixed(1)} 
                    onChange={handleYChange}
                    step={0.1}
                    className="w-20 p-1 bg-gray-800 text-white rounded"
                />
                <input
                    type="range"
                    min={0}
                    max={100}
                    step={0.1}
                    value={position.y}
                    onChange={handleYChange}
                    className="ml-2 flex-grow"
                />
            </div>
            
            <div className="flex items-center">
                <label className="text-white mr-2">Radius:</label>
                <input 
                    type="number" 
                    value={threshold.toFixed(1)} 
                    onChange={handleThresholdChange}
                    step={0.5}
                    className="w-20 p-1 bg-gray-800 text-white rounded"
                />
                <input
                    type="range"
                    min={1}
                    max={20}
                    step={0.5}
                    value={threshold}
                    onChange={handleThresholdChange}
                    className="ml-2 flex-grow"
                />
            </div>
        </div>
    );
};

export default ProximityDebugControls; 