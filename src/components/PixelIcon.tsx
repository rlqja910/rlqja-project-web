import React from 'react';

interface PixelIconProps {
  name: string;
  className?: string;
  title?: string;
}

export const PixelIcon: React.FC<PixelIconProps> = ({ name, className = '', title }) => {
  return (
    <div 
      className={`inline-block bg-current ${className}`}
      title={title}
      style={{
        WebkitMaskImage: `url(https://unpkg.com/pixelarticons@2.4.1/svg/${name}.svg)`,
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskImage: `url(https://unpkg.com/pixelarticons@2.4.1/svg/${name}.svg)`,
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        imageRendering: 'pixelated'
      }}
    />
  );
};
