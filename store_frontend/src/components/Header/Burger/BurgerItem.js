import { useState, useEffect, useRef } from "react";
import BurgerDropdown from './BurgerDropdown.js'
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const BurgerItem = ({ item, depthLevel, resetBurger, setResetBurger}) => {
  const [dropdown, setDropdown] = useState(false);

  //Reset dropdowns when a link is pressed
  useEffect(() =>{
    setDropdown(false)
  },[resetBurger]);

  //close opened dropdown when click outside it
  let burgerItemRef = useRef();
  useEffect(() => {
    const handler = (event) => {
     if (dropdown && burgerItemRef.current && !burgerItemRef.current.contains(event.target)) {
      //remove dropdown from this menu item
      setDropdown(false);
     }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
     // Cleanup the event listener
     document.removeEventListener("mousedown", handler);
     document.removeEventListener("touchstart", handler);
    };
   }, [dropdown]);

   const liClassName = (depthLevel > 0 ? 'burger-dropdown-item' : 'burger-item')
  
    let arrowDirection = 'right'
    if (window.innerWidth < 970) {
      arrowDirection = dropdown ? 'down': 'right'
    } else {
      arrowDirection = depthLevel > 0 ? 'right': 'down'
    }

    return (
    <li className={liClassName} ref={burgerItemRef}
    onMouseEnter={(e)=>{window.innerWidth > 970 && setDropdown(true);}}
    onMouseLeave={(e)=>{window.innerWidth > 970 && setDropdown(false);}}
    >
      {item.submenu ? (
        <>
          <NavLink className={'burger-link'}
            to='#'
            aria-haspopup="menu"
            aria-expanded={dropdown ? "true" : "false"}
            onClick={() => {setDropdown((prev) =>!prev)}}
          >
            <span>
              {item.icon && <FontAwesomeIcon icon={item.icon} size="1x" />}
              {' '}
              {item.title}
              {' '} 
            </span>
            <FontAwesomeIcon icon={`angles-${arrowDirection}`} size="1x" /> 
          </NavLink>
          <BurgerDropdown
          dropdown = {dropdown} 
          submenu={item.submenu}
          depthLevel={depthLevel}
          setResetBurger={setResetBurger}
          resetBurger={resetBurger}/>
        </>
      ) : (
        <NavLink className={'burger-link'}
        onClick={(e)=>{
          setResetBurger({})
        }}
        to={item.url}
        >
          <span>
            {item.icon && <FontAwesomeIcon icon={item.icon} size="1x" />}
            {' '}
            {item.title}
          </span>
        </NavLink>
      )}
    </li>
  );
};

export default BurgerItem;