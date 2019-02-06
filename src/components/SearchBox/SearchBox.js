import React from 'react';
import './SearchBox.css';

const SearchBox = () => {
  return (
    <div>
      <p className="f3">
        Paste your link here to detect face of your image.
      </p>
      <div className="center">
        <div className="form center pa4 br3 shadow-5">
          <input className="f4 pa2 w-70 center" type="text" />
          <button className="w-30 grow f4 link ph3 pv2 dib white bg-light-purple">Detect</button>
        </div>
      </div>
    </div>
  )
}

export default SearchBox;
