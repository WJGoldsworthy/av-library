import React from 'react';
import ClipText from 'components/ClipText';

const Gallery = () => {
    return (
        <>
          <div className="landing-open">
            <ClipText
              value="COMING"
              type="random"
              onClick={() => {}}
            />
            <ClipText
              value="SOON"
              type="random"
              onClick={() => {}}
            />
          </div>
        </>
      );
};

export default Gallery;