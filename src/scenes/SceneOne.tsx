import React from 'react';

const SceneOne: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-green-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Scene One</h1>
        <p className="text-xl">This is the first scene of the game.</p>
      </div>
    </div>
  );
};

export default SceneOne; 