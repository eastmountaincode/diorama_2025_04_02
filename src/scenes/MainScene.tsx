import React from 'react';

const MainScene: React.FC = () => {
    return (
        <div
            className="w-full h-full flex items-center justify-center z-20"
            style={{
                backgroundImage: "url('assets/bg/Diorama_BG.png')",
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
        </div>

    );
};

export default MainScene; 