import React, { useState } from 'react';

import { styles } from './styles';

const Avatar = (props) => {
  //Variables
  const [hovered, setHovered] = useState(false);

  return (
    <div style={props.style}>
      <div
        className='transition-3'
        style={{
          ...styles.avatarHello,
          ...{ opacity: hovered ? '1' : '0' },
          transition: 'all 0.33s ease',
        }}
      >
        Assistance? 🤙
      </div>

      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => props.onClick && props.onClick()}
        className='transition-3'
        style={{
          ...styles.chatWithMeButton,
          ...{ border: hovered ? '1px solid #f9f0ff' : '4px solid #7a39e0' },

          transition: 'all 0.33s ease',
          backgroundImage: `url('/support.jpg')`,
        }}
      />
    </div>
  );
};
const a = 'Full Stack';
export default Avatar;
