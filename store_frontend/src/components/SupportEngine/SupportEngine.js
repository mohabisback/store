import React, { useRef, useEffect, useState } from 'react';

//sub components
import SupportWindow from './SupportWindow/SupportWindow';
import Avatar from './Avatar';

//Component
const SupportEngine = () => {
  //Variables
  const [supportWindowOn, setSupportWindowOn] = useState(false);

  //References to the components
  const engineRef = useRef(null);

  useEffect(() => {
    //Close the window when clicked outside
    function handleClickOutside(event) {
      if (engineRef.current && !engineRef.current.contains(event.target)) {
        setSupportWindowOn(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [engineRef]);

  return (
    <div ref={engineRef}>
      {supportWindowOn && <SupportWindow />}

      <Avatar
        onClick={() => setSupportWindowOn((visible) => !visible)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
        }}
      />
    </div>
  );
};

export default SupportEngine;
