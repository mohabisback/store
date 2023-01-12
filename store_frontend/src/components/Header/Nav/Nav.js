import React, { useState } from 'react'
import navItems from '../navItems.js';
import NavItem from './NavItem.js'

const Nav = () => {
  const [resetNav ,setResetNav] = useState({})

  return (
    <div className='nav-container'>
        <ul className='nav-items'>
          {navItems.map((item, index) => {
            let depthLevel = 0;
            return (
              <NavItem
                item={item}
                key={index}
                depthLevel={depthLevel} 
                resetNav={resetNav}
                setResetNav={setResetNav}
              />
            )
          })}
        </ul>
    </div>
  );
};

export default Nav