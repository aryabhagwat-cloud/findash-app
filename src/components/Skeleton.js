import React from 'react';

const Skeleton = ({ height, width, style }) => {
  return (
    <div 
      className="skeleton-loader"
      style={{ 
        height: height || '20px', 
        width: width || '100%', 
        ...style 
      }} 
    />
  );
};

export default Skeleton;