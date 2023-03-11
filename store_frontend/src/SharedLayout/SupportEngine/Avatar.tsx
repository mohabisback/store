import React, { useState } from 'react';

import { styles } from './styles';
type Props = {
  style: object,
  onClick: Function
}
const Avatar = ({style, onClick}:Props) => {
  //Variables
  const [hovered, setHovered] = useState(false);

  return (
    <div style={style}>
      <div
        className='transition-3'
        style={{
          position:'absolute',
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
        onClick={() => onClick && onClick()}
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
