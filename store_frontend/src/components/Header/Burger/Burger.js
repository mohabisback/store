import React, {useState, useEffect, useRef} from 'react'
import BurgerItem from './BurgerItem';
import navItems from '../navItems'

const Burger = () => {
  const [burgerChecked, setBurgerChecked] = useState(false)
  const [resetBurger ,setResetBurger] = useState({})

  //Reset burgerChecked when a link is pressed
  useEffect(() =>{
    setBurgerChecked(false)
  },[]);

  //close opened dropdown when click outside it
  let burgerMenuRef = useRef();
  useEffect(() => {
    const handler = (event) => {
     if (burgerChecked && burgerMenuRef.current && !burgerMenuRef.current.contains(event.target)) {
      //remove dropdown from this menu item
      setBurgerChecked(false);
     }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
     // Cleanup the event listener
     document.removeEventListener("mousedown", handler);
     document.removeEventListener("touchstart", handler);
    };
   }, [burgerChecked]);
  
  return (
    <>
      <div className={`burger-icon${burgerChecked ? ' checked':''}`}
      onClick={(e)=>{setBurgerChecked(state=>!state)}}
      >
        <div className={`burger-icon-1${burgerChecked ? ' checked' : ''}`}></div>
        <div className={`burger-icon-2${burgerChecked ? ' checked' : ''}`}></div>
        <div className={`burger-icon-3${burgerChecked ? ' checked' : ''}`}></div>
      </div>
      <div className={`burger-container${burgerChecked ? ' checked' : ''}`}>
        <ul className='burger-items'>
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
            )
          })}
        </ul>
    </div>
  </>
  )
}

export default Burger