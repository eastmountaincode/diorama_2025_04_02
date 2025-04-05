import React from 'react';

const OpeningScene: React.FC = () => {
  return (
    <div className="w-full h-full relative z-20">
      <img 
        src="assets/bg/Grass_alone_demo.png" 
        alt="Grass"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'center',
          filter: "drop-shadow(0 0 10px yellow)"
        }}
        className="absolute top-0 left-0"
      />
    </div>
  );
};

export default OpeningScene;
