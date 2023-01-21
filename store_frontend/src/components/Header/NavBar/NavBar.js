import React, { useState } from 'react';
import navItems from './navItems.js';
import NavItem from './NavItem.js';

const NavBar = () => {
  const [resetDropdowns, setResetDropdowns] = useState({});

  return (
    <div className='nav-container'>
      <ul className='nav-items'>
        {navItems.map((i, n) => {
          let depthLevel = 0;
          return (
            <NavItem
              key={n}
              item={i}
              depthLevel={depthLevel}
              resetDropdowns={resetDropdowns}
              setResetDropdowns={setResetDropdowns}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default NavBar;
