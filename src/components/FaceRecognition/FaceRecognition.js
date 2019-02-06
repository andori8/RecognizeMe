import React from 'react';

const FaceRecognition = ({url}) => {
  return (
    <div className="center ma">
      <div className="absolute mt2">
        <img src={url} alt="" width="500px" height="auto"/>
      </div>
    </div>
  )
}

export default FaceRecognition;
