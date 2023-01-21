import React, { useState, useEffect, useRef } from 'react';
import BurgerItem from './BurgerItem';
import navItems from '../NavBar/navItems';
import LoginItem from '../UserBar/LoginItem';

const Burger = () => {
  const [burgerChecked, setBurgerChecked] = useState(false);
  const [resetBurger, setResetBurger] = useState({});

  //Reset burgerChecked when a link is pressed
  useEffect(() => {
    setBurgerChecked(false);
  }, [resetBurger]);

  //close opened dropdown when click outside it
  let burgerContainerRef = useRef();
  useEffect(() => {
    const handler = (event) => {
      if (burgerChecked && burgerContainerRef.current && !burgerContainerRef.current.contains(event.target)) {
        //remove dropdown from this menu item
        setBurgerChecked(false);
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [burgerChecked]);

  return (
    <>
      <div
        className={`burger-icon${burgerChecked ? ' checked' : ''}`}
        onClick={(e) => {
          setBurgerChecked((state) => !state);
        }}
      >
        <div className={`burger-icon-1${burgerChecked ? ' checked' : ''}`}></div>
        <div className={`burger-icon-2${burgerChecked ? ' checked' : ''}`}></div>
        <div className={`burger-icon-3${burgerChecked ? ' checked' : ''}`}></div>
      </div>

      <div
        ref={burgerContainerRef}
        className={`burger-container${burgerChecked ? ' checked' : ''}`}
      >
        <ul className='burger-items'>
          <LoginItem
            itemClass={'burger-item'}
            dropdownItemClass={'burger-dropdown-item'}
            linkClass={'burger-link'}
            firstItemArrow={'angles-down'}
            dropdownClass={'burger-dropdown'}
          />

          {navItems.map((item, index) => {
            let depthLevel = 0;
            return (
              <BurgerItem
                item={item}
                key={index}
                depthLevel={depthLevel}
                resetBurger={resetBurger}
                setResetBurger={setResetBurger}
              />
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Burger;
